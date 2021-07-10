using System.Collections.Generic;
using System.Linq;
using Microsoft.Extensions.Configuration;

namespace Zukte.Utilities {
  public static class ConfigurationExtensions {
    public const string AllowedOriginsSectionKey = "AllowedOrigins";

    public static IEnumerable<string> GetAllowedOrigins(this IConfiguration configuration) {
      IConfigurationSection originsSection = configuration.GetSection(AllowedOriginsSectionKey);
      return originsSection.GetChildren().Select(kv => kv.Value);
    }
  }
}