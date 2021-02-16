Set-Location $PSScriptRoot

Set-Variable -Name "out" -Value "./openapi.json"
Remove-Item -Recurse -Force ./src/openapi-generator -ErrorAction SilentlyContinue
Invoke-WebRequest https://localhost:8080/swagger/v1/swagger.json -OutFile $out
npm run openapi
Remove-Item $out
