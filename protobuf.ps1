$protoc_csharp_out = "$PSScriptRoot/aspnetapp/protobuf"
Remove-Item -Recurse $protoc_csharp_out -ErrorAction SilentlyContinue
New-Item -Path $protoc_csharp_out -ItemType "directory"

protoc --csharp_out=${protoc_csharp_out} `
    protobuf/application_user_delete_request.proto `
    protobuf/application_user_list_request.proto `
    protobuf/application_user.proto `
