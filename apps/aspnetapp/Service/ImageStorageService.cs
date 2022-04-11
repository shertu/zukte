using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SkiaSharp;
using Zukte.Database;
using Zukte.Utilities.Pagination;
using ZukteFile = Zukte.Utilities.File;

namespace Zukte.Service;
/// <inheritdoc/>
[ApiController]
[Route("api/blob-storage/[controller]")]
[Produces("application/json")]
public class ImageStorageService : ControllerBase
{
  public const int PAGE_SIZE_HINT_MAXIMUM = 30;

  private readonly BlobContainerClient blobContainerClient;

  private readonly ApplicationDbContext db;

  public ImageStorageService(BlobServiceClient blobServiceClient, ApplicationDbContext db)
  {
    blobContainerClient = blobServiceClient.GetBlobContainerClient("image-service");
    _ = blobContainerClient.CreateIfNotExists();
    _ = blobContainerClient.SetAccessPolicy(PublicAccessType.BlobContainer);

    this.db = db;
  }

  [HttpGet]
  public async Task<ActionResult<ImageStorageListResponse>> GetList([FromQuery] ImageStorageListRequest request)
  {
    #region input validation
    if (request.PageSizeHint <= 0)
    {
      ModelState.AddModelError("PSH-001", "page size hint should be greater than zero");
    }

    if (!ModelState.IsValid)
    {
      return BadRequest(ModelState);
    }
    #endregion

    var q = db.ImageStorageElements!.AsQueryable();
    q = q.OrderBy(e => e.Url);
    q = q.Where(e => string.Compare(e.Url, request.ContinuationToken) > 0);
    q = q.ApplyPageHintSize(request.PageSizeHint, PAGE_SIZE_HINT_MAXIMUM);

    ImageStorageElement[] items = await q.ToArrayAsync();
    var response = new ImageStorageListResponse();
    response.Items.Add(items);

    // set the next continuation token
    if (items.Length > 0)
    {
      var item = items[items.Length - 1];
      response.ContinuationToken = item.Url;
    }

    return response;
  }

  [HttpPost]
  public async Task<ActionResult<ImageStorageElement>> Insert(IFormFile file)
  {
    using (var ms = new MemoryStream((int)file.Length))
    {
      await file.CopyToAsync(ms);
      string filepath = Guid.NewGuid().ToString();
      ms.Seek(0, SeekOrigin.Begin);
      var data = SKData.Create(ms);
      var imageInfo = SKBitmap.DecodeBounds(data);

      if (imageInfo.IsEmpty)
      {
        ModelState.AddModelError(filepath,
          $"The file {filepath} is an invalid image file.");
      }
      else
      {
        var response = new ImageStorageElement();
        response.Url = (await ZukteFile.Upload.UploadFileToBlobContainer(ModelState, blobContainerClient, filepath, ms)).AbsoluteUri;
        response.Width = imageInfo.Width;
        response.Height = imageInfo.Height;

        #region Database
        db.ImageStorageElements.Add(response);
        await db.SaveChangesAsync();
        #endregion

        return response;
      }
    }

    return BadRequest(ModelState);
  }
}

