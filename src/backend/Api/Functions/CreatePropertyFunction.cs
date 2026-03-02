using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Logging;
using PropPulse.Database;
using PropPulse.Models;
using System.Net;
using System.Text.Json;

namespace PropPulse.Api.Functions;

public class CreatePropertyFunction
{
    private readonly PropPulseDbContext _dbContext;
    private readonly ILogger<CreatePropertyFunction> _logger;

    public CreatePropertyFunction(PropPulseDbContext dbContext, ILogger<CreatePropertyFunction> logger)
    {
        _dbContext = dbContext;
        _logger = logger;
    }

    [Function("CreateProperty")]
    public async Task<HttpResponseData> Run(
        [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "properties")] HttpRequestData req)
    {
        try
        {
            Property? property = await JsonSerializer.DeserializeAsync<Property>(
                req.Body,
                new JsonSerializerOptions { PropertyNameCaseInsensitive = true });

            if (property is null)
            {
                HttpResponseData badRequestResponse = req.CreateResponse(HttpStatusCode.BadRequest);
                await badRequestResponse.WriteStringAsync("Request body is missing or invalid.");
                return badRequestResponse;
            }

            // Ensure a new ID is assigned regardless of what the client sends.
            property.Id = Guid.NewGuid();

            await _dbContext.Properties.AddAsync(property);
            await _dbContext.SaveChangesAsync();

            HttpResponseData response = req.CreateResponse(HttpStatusCode.Created);
            await response.WriteAsJsonAsync(property);
            return response;
        }
        catch (JsonException ex)
        {
            _logger.LogError(ex, "Failed to deserialize the request body into a Property.");

            HttpResponseData badRequestResponse = req.CreateResponse(HttpStatusCode.BadRequest);
            await badRequestResponse.WriteStringAsync("Invalid JSON in request body.");
            return badRequestResponse;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred while creating a property.");

            HttpResponseData errorResponse = req.CreateResponse(HttpStatusCode.InternalServerError);
            await errorResponse.WriteStringAsync("An unexpected error occurred. Please try again later.");
            return errorResponse;
        }
    }
}
