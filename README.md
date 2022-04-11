# zukte

## prerequisite collection

You will need to download and install the following software such that you can call them from any directory in your terminal or shell:

- [.NET SDK](https://dotnet.microsoft.com/download)
- [Node](https://nodejs.org/en/download/)
- [pnpm](https://pnpm.io/installation)
- [Docker Desktop](https://www.docker.com/products/docker-desktop)
- [Java](https://www.oracle.com/au/java/technologies/javase-downloads.html)

## how to start development

After you have installed the prerequisite software run

```
pnpm i
```

## additional tools

To help with Entity Framework migrations:

```
dotnet tool install --global dotnet-ef
```

To help with production database migrations:

```
dotnet ef migrations script -i -o ./production.sql
```

How to translate script for MySQL 8:

```
IF NOT EXISTS(SELECT * FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20210218114626_InitialCreate')
BEGIN
    CREATE TABLE `ApplicationUsers` (
        `Id` varchar(767) NOT NULL,
        `Name` text NULL,
        `Picture` text NULL,
        PRIMARY KEY (`Id`)
    );
END;

IF NOT EXISTS(SELECT * FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20210218114626_InitialCreate')
BEGIN
    INSERT INTO `__EFMigrationsHistory` (`MigrationId`, `ProductVersion`)
    VALUES ('20210218114626_InitialCreate', '5.0.8');
END;
```

```
CREATE TABLE IF NOT EXISTS `ApplicationUsers` (
    `Id` varchar(767) NOT NULL,
    `Name` text NULL,
    `Picture` text NULL,
    PRIMARY KEY (`Id`)
);

INSERT IGNORE INTO `__EFMigrationsHistory` (`MigrationId`, `ProductVersion`)
VALUES ('20210218114626_InitialCreate', '5.0.8');
```

A error message component which implements the https://tools.ietf.org/html/rfc7807 standard.
