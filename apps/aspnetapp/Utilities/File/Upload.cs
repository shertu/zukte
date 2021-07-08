using Azure.Storage.Blobs;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using SkiaSharp;
using System;
using System.IO;
using System.Threading.Tasks;

namespace Zukte.Utilities.File {
	public static class Upload {
		public const uint MAX_FILE_SIZE = 5000000; // bytes = 5 MB
		public static readonly uint MAX_FILE_SIZE_MB = MAX_FILE_SIZE / 1000000;

		public static bool IsActualImageFile(Stream stream) {
			if (stream.CanSeek) {
				_ = stream.Seek(0, SeekOrigin.Begin);
			}

			SKData data = SKData.Create(stream);
			return !SKBitmap.DecodeBounds(data).IsEmpty;
		}

		public static async Task<Uri> UploadFileToBlobContainer(ModelStateDictionary modelState, BlobContainerClient container, string filepath, Stream stream) {
			BlobClient blob = container.GetBlobClient(filepath);

			if (stream.Length > MAX_FILE_SIZE) {
				modelState.AddModelError(filepath,
				  $"The file {filepath} exceeds the {MAX_FILE_SIZE_MB} MB upload limit.");
			} else {
				try {
					if (stream.CanSeek) {
						_ = stream.Seek(0, SeekOrigin.Begin);
					}

					_ = await blob.UploadAsync(stream);
				} catch (Azure.RequestFailedException ex) {
					modelState.AddModelError(filepath,
					  $"The file {filepath} failed to upload with error: {ex.Message}");
				}
			}

			return blob.Uri;
		}
	}
}
