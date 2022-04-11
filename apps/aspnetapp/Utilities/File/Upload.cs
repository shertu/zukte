using Azure.Storage.Blobs;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using SkiaSharp;

namespace Zukte.Utilities.File;
public static class Upload
{
  public const uint MAX_FILE_SIZE = 5242880; // bytes = 5 MB

  public static async Task<Uri> UploadFileToBlobContainer(ModelStateDictionary modelState, BlobContainerClient container, string filepath, Stream stream)
  {
    BlobClient blob = container.GetBlobClient(filepath);

    if (stream.Length > MAX_FILE_SIZE)
    {
      modelState.AddModelError(filepath,
        $"The file {filepath} exceeds the {MAX_FILE_SIZE} byte upload limit.");
    }
    else
    {
      try
      {
        if (stream.CanSeek)
        {
          _ = stream.Seek(0, SeekOrigin.Begin);
        }

        _ = await blob.UploadAsync(stream);
      }
      catch (Azure.RequestFailedException ex)
      {
        modelState.AddModelError(filepath,
          $"The file {filepath} failed to upload with error: {ex.Message}");
      }
    }

    return blob.Uri;
  }
}

