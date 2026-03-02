using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Logging;
using PropPulse.Database;
using PropPulse.Models;
using System.Net;
using System.Text.Json;

namespace PropPulse.Api.Functions;

public class UpdatePropertyFunction
{
    private readonly PropPulseDbContext _dbContext;
    private readonly ILogger<UpdatePropertyFunction> _logger;

    public UpdatePropertyFunction(PropPulseDbContext dbContext, ILogger<UpdatePropertyFunction> logger)
    {
        _dbContext = dbContext;
        _logger = logger;
    }

    [Function("UpdateProperty")]
    public async Task<HttpResponseData> Run(
        [HttpTrigger(AuthorizationLevel.Anonymous, "put", Route = "properties/{id:guid}")] HttpRequestData req,
        Guid id)
    {
        try
        {
            Property? payload = await JsonSerializer.DeserializeAsync<Property>(
                req.Body,
                new JsonSerializerOptions { PropertyNameCaseInsensitive = true });

            if (payload is null)
            {
                HttpResponseData badRequest = req.CreateResponse(HttpStatusCode.BadRequest);
                await badRequest.WriteStringAsync("Request body is missing or invalid.");
                return badRequest;
            }

            Property? existing = await _dbContext.Properties.FindAsync(id);

            if (existing is null)
            {
                return req.CreateResponse(HttpStatusCode.NotFound);
            }

            // Apply scalar field updates only — navigation collections are not accepted from clients.
            existing.Title = payload.Title;
            existing.Address = payload.Address;
            existing.City = payload.City;
            existing.MonthlyRent = payload.MonthlyRent;

            await _dbContext.SaveChangesAsync();

            HttpResponseData response = req.CreateResponse(HttpStatusCode.OK);
            await response.WriteAsJsonAsync(existing);
            return response;
        }
        catch (JsonException ex)
        {
            _logger.LogError(ex, "Failed to deserialize the request body for property update (id: {PropertyId}).", id);

            HttpResponseData badRequest = req.CreateResponse(HttpStatusCode.BadRequest);
            await badRequest.WriteStringAsync("Invalid JSON in request body.");
            return badRequest;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred while updating property with id {PropertyId}.", id);

            HttpResponseData errorResponse = req.CreateResponse(HttpStatusCode.InternalServerError);
            await errorResponse.WriteStringAsync("An unexpected error occurred. Please try again later.");
            return errorResponse;
        }
    }
}
