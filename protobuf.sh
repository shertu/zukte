BASEDIR=$(dirname "$0")
cd ${BASEDIR}

OutputDirectory=./aspnetapp/protobuf

rm -r ${OutputDirectory}
mkdir ${OutputDirectory}

protoc --csharp_out=${OutputDirectory} \
protobuf/application_user_delete_request.proto \
protobuf/application_user_list_request.proto \
protobuf/application_user.proto \