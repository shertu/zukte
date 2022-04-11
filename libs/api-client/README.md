# api-client

As a superuser, you will need to add the certificate to your Java via:

```
keytool -import -file <path-to-certificate> -alias localhost -cacerts
```

The default keystore password is `changeit`

You may need to run the following command and then re-run `aspnetapp`

```
dotnet dev-certs https --trust
```
