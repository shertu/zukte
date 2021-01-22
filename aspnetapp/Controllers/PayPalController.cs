//using BraintreeHttp;
//using Microsoft.AspNetCore.Mvc;
//using PayPal.Core;
//using PayPal.Payments;
//using System.Collections.Generic;
//using System.Linq;
//using System.Net;
//using System.Threading.Tasks;
//using zukte.com.Database;

//namespace zukte.com.Controllers {
//  [Route("api/[controller]")]
//  [ApiController]
//  public class PayPalController : ControllerBase {
//    private readonly ApplicationDbContext context;
//    private readonly PayPalHttpClient paypalClient;

//    /// <summary>
//    /// Gets the redirect url for the OAuth2 request.
//    /// </summary>
//    private string PayPalRedirectUri_ReturnUrl => Url.Action(nameof(ExecutePayment), null, null, Request.Scheme);

//    /// <summary>
//    /// Gets the redirect url for the OAuth2 request.
//    /// </summary>
//    private string PayPalRedirectUri_CancelUrl => Url.Action(nameof(ExecutePayment), null, null, Request.Scheme);

//    public PayPalController(ApplicationDbContext context, PayPalHttpClient paypalClient) {
//      this.context = context;
//      this.paypalClient = paypalClient;
//    }

//    /// <summary>
//    /// 
//    /// </summary>
//    /// <param name="amount"></param>
//    /// <returns></returns>
//    private Payment DefineSingleSale(Amount amount) {
//      return new Payment() {
//        Intent = "SALE", // SALE, AUTHORIZE, ORDER, NONE
//        Transactions = new List<Transaction>() {
//          new Transaction() {
//            Amount = amount
//          }
//        },

//        RedirectUrls = new RedirectUrls() {
//          CancelUrl = PayPalRedirectUri_CancelUrl,
//          ReturnUrl = PayPalRedirectUri_ReturnUrl
//        },

//        Payer = new Payer() {
//          PaymentMethod = "paypal"
//        },
//      };
//    }

//    [HttpGet("/create")]
//    public async Task<IActionResult> CreatePayment(int amountTotal, string amountCurrency) {
//      Amount amount = new Amount() {
//        Total = amountTotal.ToString(),
//        Currency = amountCurrency.ToString(),
//      };

//      Payment payment = DefineSingleSale(amount);

//      PaymentCreateRequest request = new PaymentCreateRequest();
//      _ = request.RequestBody(payment);

//      try {
//        HttpResponse response = await paypalClient.Execute(request);
//        HttpStatusCode statusCode = response.StatusCode;
//        Payment result = response.Result<Payment>();

//        foreach (LinkDescriptionObject item in result.Links) {
//          if (item.Rel == "approval_url") {
//            // Redirect the customer to link.href
//            return Redirect(item.Href);
//          }
//        }
//      } catch (HttpException httpException) {
//        HttpStatusCode statusCode = httpException.StatusCode;
//        string debugId = httpException.Headers.GetValues("PayPal-Debug-Id").FirstOrDefault();
//        return StatusCode((int) statusCode);
//      }

//      throw new System.Exception("An error occured while creating the payment.");
//    }

//    [HttpGet("/execute")]
//    public IActionResult ExecutePayment() {
//      return Ok();
//    }

//    [HttpGet("/cancel")]
//    public IActionResult CancelPayment() {
//      return Ok();
//    }
//  }
//}
