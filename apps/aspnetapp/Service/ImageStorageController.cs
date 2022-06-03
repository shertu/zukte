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
public class ImageStorageController : ControllerBase, IPaginationService<int>
{
  public const int PAGE_SIZE_HINT_MAXIMUM = 30;

  private readonly BlobContainerClient blobContainerClient;

  private readonly ApplicationDbContext db;

  public ImageStorageController(BlobServiceClient blobServiceClient, ApplicationDbContext db)
  {
    blobContainerClient = blobServiceClient.GetBlobContainerClient("image-service");
    _ = blobContainerClient.CreateIfNotExists();
    _ = blobContainerClient.SetAccessPolicy(PublicAccessType.BlobContainer);

    this.db = db;
  }

  [HttpGet]
  public async Task<ActionResult<ImageStorageListResponse>> GetList([FromQuery] ImageStorageListRequest request)
  {
    #region model validation
    if (request.PageSizeHint <= 0)
    {
      ModelState.AddModelError("PSH-001", "page size hint should be greater than zero");
    }

    if (!ModelState.IsValid)
    {
      return BadRequest(ModelState);
    }
    #endregion

    #region build queryable
    var queryable = db.ImageStorageElements.AsQueryable();
    queryable = queryable.OrderByDescending(e => e.Id);
    if (TryParseContinuationToken(request.ContinuationToken, out int continuationToken))
    {
      queryable = queryable.Where(e => e.Id < continuationToken);
    }
    queryable = queryable.ApplyPageHintSize(request.PageSizeHint, PAGE_SIZE_HINT_MAXIMUM);
    #endregion

    #region build response
    ImageStorageElement[] items = await queryable.ToArrayAsync();
    var response = new ImageStorageListResponse();
    response.Items.Add(items);
    if (items.Length > 0)
    {
      var item = items[items.Length - 1];
      response.ContinuationToken = EncodeContinuationToken(item.Id);
    }
    #endregion

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

        if (!ModelState.IsValid)
        {
          return BadRequest(ModelState);
        }

        response.Width = imageInfo.Width;
        response.Height = imageInfo.Height;

        db.ImageStorageElements.Add(response);
        await db.SaveChangesAsync();

        return response;
      }
    }

    return BadRequest(ModelState);
  }

  [NonAction]
  public bool TryParseContinuationToken(string continuationToken, out int v)
  {
    return int.TryParse(continuationToken, out v);
  }

  [NonAction]
  public string EncodeContinuationToken(int v)
  {
    return v.ToString();
  }
}

