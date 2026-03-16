using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using PropPulse.Database;
using PropPulse.Models;
using System.Net;

namespace PropPulse.Api.Functions;

public class GetLeasesByPropertyFunction
{
    private readonly PropPulseDbContext _dbContext;
    private readonly ILogger<GetLeasesByPropertyFunction> _logger;

    public GetLeasesByPropertyFunction(PropPulseDbContext dbContext, ILogger<GetLeasesByPropertyFunction> logger)
    {
        _dbContext = dbContext;
        _logger = logger;
    }

    [Function("GetLeasesByProperty")]
    public async Task<HttpResponseData> Run(
        [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "leases/property/{propertyId:guid}")] HttpRequestData req,
        Guid propertyId)
    {
        try
        {
            List<Lease> leases = await _dbContext.Leases
                .Where(l => l.PropertyId == propertyId)
                .ToListAsync();

            HttpResponseData response = req.CreateResponse(HttpStatusCode.OK);
            await response.WriteAsJsonAsync(leases);
            return response;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred while fetching leases for property {PropertyId}.", propertyId);

            HttpResponseData errorResponse = req.CreateResponse(HttpStatusCode.InternalServerError);
            await errorResponse.WriteStringAsync("An unexpected error occurred. Please try again later.");
            return errorResponse;
        }
    }
}
