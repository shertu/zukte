Set-Location $PSScriptRoot

Copy-Item ".\aspnetapp\swagger.json" -Destination ".\client"

$filepath = '.\client\swagger.json'

$json = Get-Content $filepath | ConvertFrom-Json

$schemes = @("https")

$json | Add-Member -Type NoteProperty -Name "host" -Value "localhost:8080"
$json | Add-Member -Type NoteProperty -Name "schemes" -Value $schemes

Write-Output $json

$json | ConvertTo-Json -Depth 32 | Set-Content $filepath

Remove-Item -Recurse -Force ".\client\src\openapi-generator" -ErrorAction SilentlyContinue

Set-Location ".\client"

npm run openapi

Set-Location "..\"
Remove-Item $filepath
