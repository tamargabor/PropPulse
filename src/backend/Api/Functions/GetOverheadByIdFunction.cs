using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Logging;
using PropPulse.Database;
using PropPulse.Models;
using System.Net;

namespace PropPulse.Api.Functions;

public class GetOverheadByIdFunction
{
    private readonly PropPulseDbContext _dbContext;
    private readonly ILogger<GetOverheadByIdFunction> _logger;

    public GetOverheadByIdFunction(PropPulseDbContext dbContext, ILogger<GetOverheadByIdFunction> logger)
    {
        _dbContext = dbContext;
        _logger = logger;
    }

    [Function("GetOverheadById")]
    public async Task<HttpResponseData> Run(
        [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "overheads/{id:guid}")] HttpRequestData req,
        Guid id)
    {
        try
        {
            Overhead? overhead = await _dbContext.Overheads.FindAsync(id);

            if (overhead is null)
            {
                return req.CreateResponse(HttpStatusCode.NotFound);
            }

            HttpResponseData response = req.CreateResponse(HttpStatusCode.OK);
            await response.WriteAsJsonAsync(overhead);
            return response;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred while fetching overhead with id {OverheadId}.", id);

            HttpResponseData errorResponse = req.CreateResponse(HttpStatusCode.InternalServerError);
            await errorResponse.WriteStringAsync("An unexpected error occurred. Please try again later.");
            return errorResponse;
        }
    }
}
