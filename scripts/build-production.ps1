$ErrorActionPreference='Stop'
$root=Resolve-Path (Join-Path $PSScriptRoot '..')
$dist=Join-Path $root 'dist'
foreach($name in @('SUPABASE_URL','SUPABASE_PUBLISHABLE_KEY','PUBLIC_SITE_URL','ADMIN_ALLOWED_EMAIL')){if([string]::IsNullOrWhiteSpace([Environment]::GetEnvironmentVariable($name))){throw "Required production configuration is missing: $name"}}
$supabase=[Environment]::GetEnvironmentVariable('SUPABASE_URL');$publicUrl=[Environment]::GetEnvironmentVariable('PUBLIC_SITE_URL')
if($supabase -notmatch '^https://[a-z0-9-]+\.supabase\.co$'){throw 'SUPABASE_URL is malformed.'}
if($publicUrl -notmatch '^https://'){throw 'PUBLIC_SITE_URL must use HTTPS.'}
if(Test-Path -LiteralPath $dist){Remove-Item -LiteralPath $dist -Recurse -Force}
New-Item -ItemType Directory -Path $dist|Out-Null
$exclude=@('.git','.github','.agents','.codex','dist','docs','scripts','supabase','.env','.env.example','.gitignore')
Get-ChildItem -LiteralPath $root -Force|Where-Object{$_.Name -notin $exclude}|ForEach-Object{Copy-Item -LiteralPath $_.FullName -Destination $dist -Recurse -Force}
$config=[ordered]@{environment='production';publicSiteUrl=$publicUrl.TrimEnd('/');supabaseUrl=$supabase.TrimEnd('/');supabasePublishableKey=[Environment]::GetEnvironmentVariable('SUPABASE_PUBLISHABLE_KEY');adminAllowedEmail=[Environment]::GetEnvironmentVariable('ADMIN_ALLOWED_EMAIL')}
$json=$config|ConvertTo-Json -Compress
$runtime="(function(g){'use strict';g.LEFUSIL_RUNTIME_CONFIG=$json;})(window);"
Set-Content -LiteralPath (Join-Path $dist 'js\runtime-config.js') -Value $runtime -Encoding UTF8
Get-ChildItem -LiteralPath $dist -Filter *.html | ForEach-Object {
  $html=Get-Content -Raw -LiteralPath $_.FullName
  if($html -notmatch 'js/runtime-config\.js'){
    $html=$html.Replace('</head>','<script src="js/runtime-config.js"></script></head>')
    Set-Content -LiteralPath $_.FullName -Value $html -Encoding UTF8
  }
}
if((Get-ChildItem $dist -Recurse -File|Select-String -Pattern 'SUPABASE_SERVICE_ROLE_KEY|DATABASE_PASSWORD|JWT_SECRET')){throw 'Forbidden server secret name found in build output.'}
Write-Output 'Production artifact generated. Configuration values were not printed.'
