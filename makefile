# targets: prerequisites
#    command
#    command
#    command

# Start the web app for local development for the first time
newstart_server:
	docker-compose up -d --build
	./protobuf.sh
	cd aspnetapp && dotnet run

newstart_client:
	cd client && npm install
	-rm -r client/src/openapi-generator
	cd client && npm run openapi
	cd client && npm run start

# # Generate messages and services
# codegen:
# 	./protobuf.sh
# 	make start_server
# 	# cd client && npm run openapi

# start_server:
# 	docker-compose up -d
# 	cd aspnetapp && dotnet run

# start_client:
# 	cd client && npm run start

# Build the client for production
# build:
# 	cd client && npm run build

# Execute code linters to fix code style
# lint_server:
# 	cd laravel && php-cs-fixer fix . --rules=@Symfony
lint_client:
	cd client && npm run eslint
	cd client && npm run stylelint

# Test web application in a variety of ways
# test_server:
# 	cd laravel && php artisan test
# test_client:
# 	cd client && npm run test