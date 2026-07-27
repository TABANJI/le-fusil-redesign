$ErrorActionPreference='Stop'
$projectRoot=[IO.Path]::GetFullPath((Join-Path $PSScriptRoot '..'))
$imageRoot=Join-Path $projectRoot 'assets\images'
$paths=Get-ChildItem -LiteralPath $imageRoot -Recurse -File | Where-Object {$_.Extension.ToLowerInvariant() -in '.jpg','.jpeg','.png','.webp','.avif','.gif','.svg'} | ForEach-Object {$_.FullName.Substring($projectRoot.Length+1).Replace('\','/')} | Sort-Object
$json=$paths|ConvertTo-Json -Compress
$content="window.LEFUSIL_MEDIA_FILES=$json;`n"
[IO.File]::WriteAllText((Join-Path $projectRoot 'js\admin-media-inventory.js'),$content,[Text.UTF8Encoding]::new($false))
Write-Output "Generated $($paths.Count) media paths from $imageRoot"
