param (
    [Parameter(Mandatory=$true)][System.Uri]$url = "https://localhost:8080"
)

$filename = "openapi.json"
$filepath = "$PSScriptRoot/client/$filename"

Copy-Item "$PSScriptRoot/aspnetapp/$filename" -Destination "$PSScriptRoot/client"

if($url) {
    $json = Get-Content $filepath | ConvertFrom-Json

    $http = [System.Uri]::UriSchemeHttp
    $https = [System.Uri]::UriSchemeHttps

    $schemes = @()

    if ($url.Scheme -eq $http) {
        $schemes += $http
    }

    if ($url.Scheme -eq $https) {
        $schemes += $https
    }

    $json | Add-Member -Type NoteProperty -Name "host" -Value $url.Authority
    $json | Add-Member -Type NoteProperty -Name "schemes" -Value $schemes

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
