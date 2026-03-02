using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using PropPulse.Database;
using PropPulse.Models;
using System.Net;

namespace PropPulse.Api.Functions;

public class GetLeasesFunction
{
    private readonly PropPulseDbContext _dbContext;
    private readonly ILogger<GetLeasesFunction> _logger;

    public GetLeasesFunction(PropPulseDbContext dbContext, ILogger<GetLeasesFunction> logger)
    {
        _dbContext = dbContext;
        _logger = logger;
    }

    [Function("GetLeases")]
    public async Task<HttpResponseData> Run(
        [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "leases")] HttpRequestData req)
    {
        try
        {
            List<Lease> leases = await _dbContext.Leases.ToListAsync();

            HttpResponseData response = req.CreateResponse(HttpStatusCode.OK);
            await response.WriteAsJsonAsync(leases);
            return response;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred while fetching leases.");

            HttpResponseData errorResponse = req.CreateResponse(HttpStatusCode.InternalServerError);
            await errorResponse.WriteStringAsync("An unexpected error occurred. Please try again later.");
            return errorResponse;
        }
    }
}
