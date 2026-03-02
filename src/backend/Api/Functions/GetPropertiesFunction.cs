using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using PropPulse.Database;
using PropPulse.Models;
using System.Net;

namespace PropPulse.Api.Functions;

public class GetPropertiesFunction
{
    private readonly PropPulseDbContext _dbContext;
    private readonly ILogger<GetPropertiesFunction> _logger;

    public GetPropertiesFunction(PropPulseDbContext dbContext, ILogger<GetPropertiesFunction> logger)
    {
        _dbContext = dbContext;
        _logger = logger;
    }

    [Function("GetProperties")]
    public async Task<HttpResponseData> Run(
        [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "properties")] HttpRequestData req)
    {
        try
        {
            List<Property> properties = await _dbContext.Properties.ToListAsync();

            HttpResponseData response = req.CreateResponse(HttpStatusCode.OK);
            await response.WriteAsJsonAsync(properties);
            return response;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred while fetching properties.");

            HttpResponseData errorResponse = req.CreateResponse(HttpStatusCode.InternalServerError);
            await errorResponse.WriteStringAsync("An unexpected error occurred. Please try again later.");
            return errorResponse;
        }
    }
}
