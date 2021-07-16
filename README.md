# zukte

## prerequisite collection

You will need to download and install the following software such that you can call them from any directory in your terminal or shell:

- [.NET SDK](https://dotnet.microsoft.com/download)
- [Node](https://nodejs.org/en/download/)
- [pnpm](https://pnpm.io/installation)
- [Docker Desktop](https://www.docker.com/products/docker-desktop)
- [Java](https://www.oracle.com/au/java/technologies/javase-downloads.html)
- [PowerShell](https://github.com/PowerShell/PowerShell/releases/)

## how to start development

After you have installed the prerequisite software run

```
pnpm i
```

## additional tools

To help with Entity Framework migrations:

```
dotnet tool install dotnet-ef -g
```

To generate a trusted self-signed SSL certificate for local development:

```
dotnet dev-certs https -ep ./certificate.crt -np --trust --format PEM
```

A error message component which implements the https://tools.ietf.org/html/rfc7807 standard.
