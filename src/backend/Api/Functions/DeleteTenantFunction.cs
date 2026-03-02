using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Logging;
using PropPulse.Database;
using PropPulse.Models;
using System.Net;

namespace PropPulse.Api.Functions;

public class DeleteTenantFunction
{
    private readonly PropPulseDbContext _dbContext;
    private readonly ILogger<DeleteTenantFunction> _logger;

    public DeleteTenantFunction(PropPulseDbContext dbContext, ILogger<DeleteTenantFunction> logger)
    {
        _dbContext = dbContext;
        _logger = logger;
    }

    [Function("DeleteTenant")]
    public async Task<HttpResponseData> Run(
        [HttpTrigger(AuthorizationLevel.Anonymous, "delete", Route = "tenants/{id:guid}")] HttpRequestData req,
        Guid id)
    {
        try
        {
            Tenant? tenant = await _dbContext.Tenants.FindAsync(id);

            if (tenant is null)
            {
                return req.CreateResponse(HttpStatusCode.NotFound);
            }

            _dbContext.Tenants.Remove(tenant);
            await _dbContext.SaveChangesAsync();

            return req.CreateResponse(HttpStatusCode.NoContent);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred while deleting tenant with id {TenantId}.", id);

            HttpResponseData errorResponse = req.CreateResponse(HttpStatusCode.InternalServerError);
            await errorResponse.WriteStringAsync("An unexpected error occurred. Please try again later.");
            return errorResponse;
        }
    }
}
