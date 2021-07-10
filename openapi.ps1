param (
    [Parameter(Mandatory=$true)][System.Uri]$url = "https://localhost:8080"
)

$LocationT = "$PSScriptRoot/libs/api-client"
$LocationAspnetapp = "$PSScriptRoot/apps/aspnetapp"

$filename = "openapi.json"
$filepath = "$LocationT/$filename"

Copy-Item "$LocationAspnetapp/$filename" -Destination $LocationT

if($url) {
    $json = Get-Content $filepath | ConvertFrom-Json
    
    $servers = @(@{"url" = $url.ToString()})
    $json | Add-Member -Type NoteProperty -Name "servers" -Value $servers

    Write-Output $json

    $json | ConvertTo-Json -Depth 32 | Set-Content $filepath
}

# execute open-api-generator cli
Set-Location $LocationT
Remove-Item -Recurse -Force ./src/openapi-generator -ErrorAction SilentlyContinue
npm run openapi
npm run compile

# clean up
Set-Location $PSScriptRoot
Remove-Item $filepath
