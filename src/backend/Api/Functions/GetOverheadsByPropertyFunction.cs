using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using PropPulse.Database;
using PropPulse.Models;
using System.Net;

namespace PropPulse.Api.Functions;

public class GetOverheadsByPropertyFunction
{
    private readonly PropPulseDbContext _dbContext;
    private readonly ILogger<GetOverheadsByPropertyFunction> _logger;

    public GetOverheadsByPropertyFunction(PropPulseDbContext dbContext, ILogger<GetOverheadsByPropertyFunction> logger)
    {
        _dbContext = dbContext;
        _logger = logger;
    }

    [Function("GetOverheadsByProperty")]
    public async Task<HttpResponseData> Run(
        [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "overheads/property/{propertyId:guid}")] HttpRequestData req,
        Guid propertyId)
    {
        try
        {
            List<Overhead> overheads = await _dbContext.Overheads
                .Where(o => o.PropertyId == propertyId)
                .OrderByDescending(o => o.DueDate)
                .ToListAsync();

            HttpResponseData response = req.CreateResponse(HttpStatusCode.OK);
            await response.WriteAsJsonAsync(overheads);
            return response;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred while fetching overheads for property {PropertyId}.", propertyId);

            HttpResponseData errorResponse = req.CreateResponse(HttpStatusCode.InternalServerError);
            await errorResponse.WriteStringAsync("An unexpected error occurred. Please try again later.");
            return errorResponse;
        }
    }
}
