using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using PropPulse.Database;
using PropPulse.Models;
using System.Net;

namespace PropPulse.Api.Functions;

public class GetLeasesByTenantFunction
{
    private readonly PropPulseDbContext _dbContext;
    private readonly ILogger<GetLeasesByTenantFunction> _logger;

    public GetLeasesByTenantFunction(PropPulseDbContext dbContext, ILogger<GetLeasesByTenantFunction> logger)
    {
        _dbContext = dbContext;
        _logger = logger;
    }

    [Function("GetLeasesByTenant")]
    public async Task<HttpResponseData> Run(
        [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "leases/tenant/{tenantId:guid}")] HttpRequestData req,
        Guid tenantId)
    {
        try
        {
            List<Lease> leases = await _dbContext.Leases
                .Where(l => l.TenantId == tenantId)
                .OrderByDescending(l => l.StartDate)
                .ToListAsync();

            HttpResponseData response = req.CreateResponse(HttpStatusCode.OK);
            await response.WriteAsJsonAsync(leases);
            return response;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred while fetching leases for tenant {TenantId}.", tenantId);

            HttpResponseData errorResponse = req.CreateResponse(HttpStatusCode.InternalServerError);
            await errorResponse.WriteStringAsync("An unexpected error occurred. Please try again later.");
            return errorResponse;
        }
    }
}
