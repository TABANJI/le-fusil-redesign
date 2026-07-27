$ErrorActionPreference = 'Stop'
$root = [IO.Path]::GetFullPath((Join-Path $PSScriptRoot '..'))
$keys = @{}
foreach ($locale in 'en','ar','fr') {
  $path = Join-Path $root "data\translations\$locale.js"
  if (-not (Test-Path -LiteralPath $path)) { throw "Missing translation file: $locale" }
  $text = Get-Content -Raw $path
  $quoted = [regex]::Matches($text, "'([^']+)'\s*:") | ForEach-Object { $_.Groups[1].Value }
  $plain = [regex]::Matches($text, '(?:^|,)([A-Za-z][A-Za-z ]*)\s*:') | ForEach-Object { $_.Groups[1].Value.Trim() }
  $keys[$locale] = @($quoted + $plain | Sort-Object -Unique)
}
$errors = @()
foreach ($locale in 'ar','fr') {
  $missing = $keys.en | Where-Object { $_ -notin $keys[$locale] }
  if ($missing) { $errors += "$locale missing: $($missing -join ', ')" }
}
if ($errors) { throw ($errors -join "`n") }
'Localization files present; baseline keys matched.'
