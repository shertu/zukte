# TODO modify script to take a URL as an argument and 
# parse the scheme and host values instead of using hardcoded values

$filename = "openapi.json"

Copy-Item "$PSScriptRoot/aspnetapp/$filename" -Destination "$PSScriptRoot/client"

$filepath = "$PSScriptRoot/client/$filename"

$json = Get-Content $filepath | ConvertFrom-Json

$schemes = @("https")

$json | Add-Member -Type NoteProperty -Name "host" -Value "localhost:8080"
$json | Add-Member -Type NoteProperty -Name "schemes" -Value $schemes

Write-Output $json

$json | ConvertTo-Json -Depth 32 | Set-Content $filepath

# clean output directory and execute open-api-generator cli
Set-Location "$PSScriptRoot/client"
Remove-Item -Recurse -Force ./src/openapi-generator -ErrorAction SilentlyContinue
npm run openapi

# clean up
Set-Location $PSScriptRoot
Remove-Item $filepath
