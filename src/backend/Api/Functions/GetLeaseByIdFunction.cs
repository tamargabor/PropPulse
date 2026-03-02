using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Logging;
using PropPulse.Database;
using PropPulse.Models;
using System.Net;

namespace PropPulse.Api.Functions;

public class GetLeaseByIdFunction
{
    private readonly PropPulseDbContext _dbContext;
    private readonly ILogger<GetLeaseByIdFunction> _logger;

    public GetLeaseByIdFunction(PropPulseDbContext dbContext, ILogger<GetLeaseByIdFunction> logger)
    {
        _dbContext = dbContext;
        _logger = logger;
    }

    [Function("GetLeaseById")]
    public async Task<HttpResponseData> Run(
        [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "leases/{id:guid}")] HttpRequestData req,
        Guid id)
    {
        try
        {
            Lease? lease = await _dbContext.Leases.FindAsync(id);

            if (lease is null)
            {
                return req.CreateResponse(HttpStatusCode.NotFound);
            }

            HttpResponseData response = req.CreateResponse(HttpStatusCode.OK);
            await response.WriteAsJsonAsync(lease);
            return response;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred while fetching lease with id {LeaseId}.", id);

            HttpResponseData errorResponse = req.CreateResponse(HttpStatusCode.InternalServerError);
            await errorResponse.WriteStringAsync("An unexpected error occurred. Please try again later.");
            return errorResponse;
        }
    }
}
