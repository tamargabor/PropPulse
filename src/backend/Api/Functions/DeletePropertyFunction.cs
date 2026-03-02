using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Logging;
using PropPulse.Database;
using PropPulse.Models;
using System.Net;

namespace PropPulse.Api.Functions;

public class DeletePropertyFunction
{
    private readonly PropPulseDbContext _dbContext;
    private readonly ILogger<DeletePropertyFunction> _logger;

    public DeletePropertyFunction(PropPulseDbContext dbContext, ILogger<DeletePropertyFunction> logger)
    {
        _dbContext = dbContext;
        _logger = logger;
    }

    [Function("DeleteProperty")]
    public async Task<HttpResponseData> Run(
        [HttpTrigger(AuthorizationLevel.Anonymous, "delete", Route = "properties/{id:guid}")] HttpRequestData req,
        Guid id)
    {
        try
        {
            Property? property = await _dbContext.Properties.FindAsync(id);

            if (property is null)
            {
                return req.CreateResponse(HttpStatusCode.NotFound);
            }

            _dbContext.Properties.Remove(property);
            await _dbContext.SaveChangesAsync();

            return req.CreateResponse(HttpStatusCode.NoContent);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred while deleting property with id {PropertyId}.", id);

            HttpResponseData errorResponse = req.CreateResponse(HttpStatusCode.InternalServerError);
            await errorResponse.WriteStringAsync("An unexpected error occurred. Please try again later.");
            return errorResponse;
        }
    }
}
