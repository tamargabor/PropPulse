using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using PropPulse.Database;
using PropPulse.Models;
using System.Net;

namespace PropPulse.Api.Functions;

public class GetTenantsFunction
{
    private readonly PropPulseDbContext _dbContext;
    private readonly ILogger<GetTenantsFunction> _logger;

    public GetTenantsFunction(PropPulseDbContext dbContext, ILogger<GetTenantsFunction> logger)
    {
        _dbContext = dbContext;
        _logger = logger;
    }

    [Function("GetTenants")]
    public async Task<HttpResponseData> Run(
        [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "tenants")] HttpRequestData req)
    {
        try
        {
            List<Tenant> tenants = await _dbContext.Tenants.ToListAsync();

            HttpResponseData response = req.CreateResponse(HttpStatusCode.OK);
            await response.WriteAsJsonAsync(tenants);
            return response;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred while fetching tenants.");

            HttpResponseData errorResponse = req.CreateResponse(HttpStatusCode.InternalServerError);
            await errorResponse.WriteStringAsync("An unexpected error occurred. Please try again later.");
            return errorResponse;
        }
    }
}
