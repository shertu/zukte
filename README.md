# zukte

## prerequisite collection

You will need to download and install the following software such that you can call them from any directory in your terminal or shell:

-   [.NET SDK](https://dotnet.microsoft.com/download)
-   [npm](https://nodejs.org/en/download/)
-   [Docker Desktop](https://www.docker.com/products/docker-desktop)
-   [Java Runtime Environment (JRE)](https://www.java.com/en/download/)
-   [PowerShell](https://github.com/PowerShell/PowerShell/releases/)

## how to start development

After you have installed the prerequisite software and cloned the repositiory, you can build the docker images, install dependencies, and generate an API client library, via the PowerShell script:

```
./newstart.ps1
```

Afterwards, please start the aspnetapp via:

```
dotnet run
```

and client or webpack-dev-server via:

```
npm run start
```

Lastly, open the client or webpack-dev-server in the web browser of your choice, e.g.

```
open https://localhost:8080/
```

```
explorer https://localhost:8080/
```

## additional tools

To help with Entity Framework migrations:

```
dotnet tool install dotnet-ef
```

To generate a trusted self-signed SSL certificate for local development:

```
dotnet dev-certs https -ep ./certificate.crt -np --trust --format PEM
```
