using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Logging;
using PropPulse.Database;
using PropPulse.Models;
using System.Net;

namespace PropPulse.Api.Functions;

public class DeleteLeaseFunction
{
    private readonly PropPulseDbContext _dbContext;
    private readonly ILogger<DeleteLeaseFunction> _logger;

    public DeleteLeaseFunction(PropPulseDbContext dbContext, ILogger<DeleteLeaseFunction> logger)
    {
        _dbContext = dbContext;
        _logger = logger;
    }

    [Function("DeleteLease")]
    public async Task<HttpResponseData> Run(
        [HttpTrigger(AuthorizationLevel.Anonymous, "delete", Route = "leases/{id:guid}")] HttpRequestData req,
        Guid id)
    {
        try
        {
            Lease? lease = await _dbContext.Leases.FindAsync(id);

            if (lease is null)
            {
                return req.CreateResponse(HttpStatusCode.NotFound);
            }

            _dbContext.Leases.Remove(lease);
            await _dbContext.SaveChangesAsync();

            return req.CreateResponse(HttpStatusCode.NoContent);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred while deleting lease with id {LeaseId}.", id);

            HttpResponseData errorResponse = req.CreateResponse(HttpStatusCode.InternalServerError);
            await errorResponse.WriteStringAsync("An unexpected error occurred. Please try again later.");
            return errorResponse;
        }
    }
}
