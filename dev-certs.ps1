Set-Location $PSScriptRoot

Set-Variable -Name "out" -Value "./dev-certs/"
Remove-Item -Recurse $out -ErrorAction SilentlyContinue

dotnet dev-certs https -ep $out/certificate.crt -np --trust --format PEM
