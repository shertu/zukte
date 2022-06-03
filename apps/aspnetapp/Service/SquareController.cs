using System.Net;
using Microsoft.AspNetCore.Mvc;
using Square;
using Square.Apis;
using Square.Exceptions;
using Square.Models;

namespace Zukte.Service;
/// <inheritdoc/>
[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
public class SquareController : ControllerBase
{
  private readonly SquareClient squareClient;

  public SquareController(SquareClient squareClient)
  {
    this.squareClient = squareClient;
  }

  [HttpPost(nameof(CreatePayment))]
  public async Task<ActionResult<Payment>> CreatePayment(CreatePaymentRequest request)
  {
    IPaymentsApi paymentsApi = squareClient.PaymentsApi;

    try
    {
      var response = await paymentsApi.CreatePaymentAsync(request);
      var payment = response.Payment;
      return Ok(payment);
    }
    catch (ApiException ex)
    {
      var errors = ex.Errors;
      var statusCode = ex.ResponseCode;

      foreach (Error error in errors)
      {
        ModelState.AddModelError(error.Code, error.Detail);
      }

      if (statusCode == (int)HttpStatusCode.BadRequest)
      {
        return BadRequest(ModelState);
      }
      else
      {
        return StatusCode(statusCode);
      }
    }
  }
}

