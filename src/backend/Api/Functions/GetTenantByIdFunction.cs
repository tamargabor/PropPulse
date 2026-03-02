using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Logging;
using PropPulse.Database;
using PropPulse.Models;
using System.Net;

namespace PropPulse.Api.Functions;

public class GetTenantByIdFunction
{
    private readonly PropPulseDbContext _dbContext;
    private readonly ILogger<GetTenantByIdFunction> _logger;

    public GetTenantByIdFunction(PropPulseDbContext dbContext, ILogger<GetTenantByIdFunction> logger)
    {
        _dbContext = dbContext;
        _logger = logger;
    }

    [Function("GetTenantById")]
    public async Task<HttpResponseData> Run(
        [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "tenants/{id:guid}")] HttpRequestData req,
        Guid id)
    {
        try
        {
            Tenant? tenant = await _dbContext.Tenants.FindAsync(id);

            if (tenant is null)
            {
                return req.CreateResponse(HttpStatusCode.NotFound);
            }

            HttpResponseData response = req.CreateResponse(HttpStatusCode.OK);
            await response.WriteAsJsonAsync(tenant);
            return response;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred while fetching tenant with id {TenantId}.", id);

            HttpResponseData errorResponse = req.CreateResponse(HttpStatusCode.InternalServerError);
            await errorResponse.WriteStringAsync("An unexpected error occurred. Please try again later.");
            return errorResponse;
        }
    }
}
