param([string]$Root=(Resolve-Path (Join-Path $PSScriptRoot '..\..')))
$ErrorActionPreference='Stop'
$issues=[System.Collections.Generic.List[string]]::new()
$html=Get-ChildItem -LiteralPath $Root -Filter '*.html' -File
foreach($file in $html){
  $text=Get-Content -LiteralPath $file.FullName -Raw -Encoding UTF8
  $ids=[regex]::Matches($text,'\sid="([^"]+)"')|ForEach-Object{$_.Groups[1].Value}
  $ids|Group-Object|Where-Object Count -gt 1|ForEach-Object{$issues.Add("Duplicate id '$($_.Name)' in $($file.Name)")}
  $runtimeHeadingPages=@('product.html','privacy.html','terms.html','cookies.html','legal-notice.html','responsible-use.html')
  if($file.Name -notin (@('admin.html','404.html','offline.html')+$runtimeHeadingPages) -and ([regex]::Matches($text,'<h1(?:\s|>)','IgnoreCase').Count -ne 1)){$issues.Add("Expected one H1 in $($file.Name)")}
  foreach($pattern in @('href=""','javascript:void','localhost','[A-Z]:\\Users\\')){if($text -match $pattern){$issues.Add("Forbidden pattern '$pattern' in $($file.Name)")}}
  foreach($href in ([regex]::Matches($text,'(?:href|src)="([^"]+)"')|ForEach-Object{$_.Groups[1].Value})){
    if($href -match '^(?:https?:|mailto:|tel:|#|data:)' -or $href -match '[?{]') {continue}
    $target=Join-Path $Root ($href.Split('#')[0]);if($href -and !(Test-Path -LiteralPath $target)){$issues.Add("Missing local reference '$href' in $($file.Name)")}
  }
}
$js=Get-ChildItem (Join-Path $Root 'js') -Filter '*.js' -File -Recurse
foreach($file in $js){$text=Get-Content $file.FullName -Raw -Encoding UTF8;if($text -match 'SUPABASE_SERVICE_ROLE_KEY\s*=\s*[^\s''"]+'){$issues.Add("Possible service-role secret in $($file.Name)")}}
$manifest=Get-Content (Join-Path $Root 'manifest.webmanifest') -Raw -Encoding UTF8|ConvertFrom-Json
if(!$manifest.name -or !$manifest.start_url -or !$manifest.icons){$issues.Add('Manifest is missing required launch fields')}
$result=[ordered]@{checkedAt=(Get-Date).ToUniversalTime().ToString('o');htmlPages=$html.Count;jsFiles=$js.Count;issues=$issues.Count;status=if($issues.Count){'FAIL'}else{'PASS'};details=$issues}
$result|ConvertTo-Json -Depth 4
if($issues.Count){exit 1}
