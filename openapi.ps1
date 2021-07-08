param (
    [Parameter(Mandatory=$true)][System.Uri]$url = "https://localhost:8080"
)

$filename = "openapi.json"
$filepath = "$PSScriptRoot/client/$filename"

Copy-Item "$PSScriptRoot/aspnetapp/$filename" -Destination "$PSScriptRoot/client"

if($url) {
    $json = Get-Content $filepath | ConvertFrom-Json
    
    $servers = @(@{"url" = $url.ToString()})
    $json | Add-Member -Type NoteProperty -Name "servers" -Value $servers

    Write-Output $json

    $json | ConvertTo-Json -Depth 32 | Set-Content $filepath
}

# execute open-api-generator cli
Set-Location "$PSScriptRoot/client"
Remove-Item -Recurse -Force ./src/openapi-generator -ErrorAction SilentlyContinue
npm run openapi

# clean up
Set-Location $PSScriptRoot
Remove-Item $filepath
