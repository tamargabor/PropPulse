using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Logging;
using PropPulse.Database;
using PropPulse.Models;
using System.Net;

namespace PropPulse.Api.Functions;

public class GetPropertyByIdFunction
{
    private readonly PropPulseDbContext _dbContext;
    private readonly ILogger<GetPropertyByIdFunction> _logger;

    public GetPropertyByIdFunction(PropPulseDbContext dbContext, ILogger<GetPropertyByIdFunction> logger)
    {
        _dbContext = dbContext;
        _logger = logger;
    }

    [Function("GetPropertyById")]
    public async Task<HttpResponseData> Run(
        [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "properties/{id:guid}")] HttpRequestData req,
        Guid id)
    {
        try
        {
            Property? property = await _dbContext.Properties.FindAsync(id);

            if (property is null)
            {
                return req.CreateResponse(HttpStatusCode.NotFound);
            }

            HttpResponseData response = req.CreateResponse(HttpStatusCode.OK);
            await response.WriteAsJsonAsync(property);
            return response;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred while fetching property with id {PropertyId}.", id);

            HttpResponseData errorResponse = req.CreateResponse(HttpStatusCode.InternalServerError);
            await errorResponse.WriteStringAsync("An unexpected error occurred. Please try again later.");
            return errorResponse;
        }
    }
}
