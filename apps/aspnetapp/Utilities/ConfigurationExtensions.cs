namespace Zukte.Utilities;

public static class ConfigurationExtensions
{
  public const string AllowedOriginsSectionKey = "AllowedOrigins";

  public static string[] GetAllowedOrigins(this IConfiguration configuration)
  {
    return configuration.GetSection(AllowedOriginsSectionKey).Get<string[]>();
  }
}
