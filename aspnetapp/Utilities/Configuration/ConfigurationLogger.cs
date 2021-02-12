using System.Collections.Generic;
using System.Linq;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace Zukte.Utilities.Configuration {
	public class ConfigurationLogger {
		private readonly IConfiguration configuration;

		private readonly ILogger<ConfigurationLogger> logger;

		public ConfigurationLogger(IConfiguration configuration, ILogger<ConfigurationLogger> logger) {
			this.configuration = configuration;
			this.logger = logger;
		}

		/// <summary>
		/// Logs the values in the application configuration.
		/// </summary>
		public void LogConfiguration() {
			LogConfigurationRecursive(configuration.GetChildren());
		}

		private void LogConfigurationRecursive(IEnumerable<IConfigurationSection> sections) {
			foreach (var section in sections) {
				var children = section.GetChildren();

				if (children.Count() == 0) {
					logger.LogInformation($"{section.Path} {section.Value}");
				}

				LogConfigurationRecursive(children);
			}
		}
	}
}