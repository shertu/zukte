Set-Location "$PSScriptRoot/aspnetapp"
dotnet build

Set-Location "$PSScriptRoot/client"
npm install

& "$PSScriptRoot/openapi.ps1" https://localhost:8080

Set-Location $PSScriptRoot
docker-compose up -d --build
