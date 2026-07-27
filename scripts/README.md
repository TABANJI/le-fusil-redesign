# Local QA scripts

Run from PowerShell without additional dependencies:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File scripts/check-localization.ps1
powershell -NoProfile -ExecutionPolicy Bypass -File scripts/check-links.ps1
powershell -NoProfile -ExecutionPolicy Bypass -File scripts/check-placeholders.ps1
powershell -NoProfile -ExecutionPolicy Bypass -File scripts/check-public-pages.ps1
```

They are read-only checks and do not modify project files.
