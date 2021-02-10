Set-Location $PSScriptRoot

$OutputDirectory = "./aspnetapp/protobuf"

Remove-Item $OutputDirectory -Recurse -ErrorAction Ignore
New-Item -Path $OutputDirectory -ItemType "directory"

& protoc --csharp_out=${OutputDirectory} `
    protobuf/application_user_delete_request.proto `
    protobuf/application_user_list_request.proto `
    protobuf/application_user.proto `
