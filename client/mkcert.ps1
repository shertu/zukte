Set-Location $PSScriptRoot

Set-Variable -Name "out" -Value "./ssl/"
Remove-Item -Recurse $out -ErrorAction SilentlyContinue
New-Item -Path $out -ItemType "directory"

mkcert -cert-file $out/webpack-dev-server.pem -key-file $out/webpack-dev-server-key.pem localhost 127.0.0.1
