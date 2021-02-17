Set-Location $PSScriptRoot

$out = "./aspnetapp/protobuf"
Remove-Item -Recurse $out -ErrorAction SilentlyContinue
New-Item -Path $out -ItemType "directory"

protoc --csharp_out=${out} `
    protobuf/application_user_delete_request.proto `
    protobuf/application_user_list_request.proto `
    protobuf/application_user.proto `
