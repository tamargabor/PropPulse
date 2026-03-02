using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using PropPulse.Database;
using PropPulse.Models;
using System.Net;

namespace PropPulse.Api.Functions;

public class GetOverheadsFunction
{
    private readonly PropPulseDbContext _dbContext;
    private readonly ILogger<GetOverheadsFunction> _logger;

    public GetOverheadsFunction(PropPulseDbContext dbContext, ILogger<GetOverheadsFunction> logger)
    {
        _dbContext = dbContext;
        _logger = logger;
    }

    [Function("GetOverheads")]
    public async Task<HttpResponseData> Run(
        [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "overheads")] HttpRequestData req)
    {
        try
        {
            List<Overhead> overheads = await _dbContext.Overheads.ToListAsync();

            HttpResponseData response = req.CreateResponse(HttpStatusCode.OK);
            await response.WriteAsJsonAsync(overheads);
            return response;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred while fetching overheads.");

            HttpResponseData errorResponse = req.CreateResponse(HttpStatusCode.InternalServerError);
            await errorResponse.WriteStringAsync("An unexpected error occurred. Please try again later.");
            return errorResponse;
        }
    }
}
