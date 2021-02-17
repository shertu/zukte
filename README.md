# zukte

## prerequisite collection

You will need to download and install the following software such that you can call them from any directory in your terminal or shell:

-   [.NET SDK](https://dotnet.microsoft.com/download)
-   [npm](https://nodejs.org/en/download/)
-   [Docker Desktop](https://www.docker.com/products/docker-desktop)
-   [Java Runtime Environment (JRE)](https://www.java.com/en/download/)
-   [PowerShell](https://github.com/PowerShell/PowerShell/releases/)

## how to start development

You will need to execute the following commands in sequence:

PowerShell A:

-   `docker-compose up -d`
-   `./protobuf.ps1`
-   `Set-Location ./aspnetapp/`
-   `dotnet run`

PowerShell B:

dotnet dev-certs https -ep ./certificate.crt -np --trust --format PEM

-   `Set-Location ./client/`
-   `npm install`
-   `./mkcert.ps1`
-   `npm run start`

PowerShell C:

-   `Set-Location ./client/`
-   `./openapi.ps1`

Open webpack-dev-server in the web browser of your choice, e.g.

```
open https://localhost:8080/
```

```
explorer https://localhost:8080/
```

## additional tools

dotnet tool install dotnet-ef
