namespace Zukte.Utilities;

public static class ConfigurationExtensions
{
  public const string AllowedOriginsSectionKey = "AllowedOrigins";

  public static string[] GetAllowedOrigins(this IConfiguration configuration)
  {
    IConfigurationSection section = configuration.GetSection(AllowedOriginsSectionKey);
    string[] _array = section.Get<string[]>();
    return _array;
  }
}
