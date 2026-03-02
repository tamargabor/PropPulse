using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Logging;
using PropPulse.Database;
using PropPulse.Models;
using System.Net;

namespace PropPulse.Api.Functions;

public class DeleteOverheadFunction
{
    private readonly PropPulseDbContext _dbContext;
    private readonly ILogger<DeleteOverheadFunction> _logger;

    public DeleteOverheadFunction(PropPulseDbContext dbContext, ILogger<DeleteOverheadFunction> logger)
    {
        _dbContext = dbContext;
        _logger = logger;
    }

    [Function("DeleteOverhead")]
    public async Task<HttpResponseData> Run(
        [HttpTrigger(AuthorizationLevel.Anonymous, "delete", Route = "overheads/{id:guid}")] HttpRequestData req,
        Guid id)
    {
        try
        {
            Overhead? overhead = await _dbContext.Overheads.FindAsync(id);

            if (overhead is null)
            {
                return req.CreateResponse(HttpStatusCode.NotFound);
            }

            _dbContext.Overheads.Remove(overhead);
            await _dbContext.SaveChangesAsync();

            return req.CreateResponse(HttpStatusCode.NoContent);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred while deleting overhead with id {OverheadId}.", id);

            HttpResponseData errorResponse = req.CreateResponse(HttpStatusCode.InternalServerError);
            await errorResponse.WriteStringAsync("An unexpected error occurred. Please try again later.");
            return errorResponse;
        }
    }
}
