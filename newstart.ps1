Set-Location $PSScriptRoot
./protobuf.ps1

Set-Location $PSScriptRoot/aspnetapp
dotnet build

Set-Location $PSScriptRoot/client
npm install

Set-Location $PSScriptRoot
./openapi.ps1

Set-Location $PSScriptRoot
docker-compose up -d --build