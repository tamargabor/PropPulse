using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Logging;
using PropPulse.Database;
using PropPulse.Models;
using System.Net;
using System.Text.Json;

namespace PropPulse.Api.Functions;

public class CreateOverheadFunction
{
    private readonly PropPulseDbContext _dbContext;
    private readonly ILogger<CreateOverheadFunction> _logger;

    public CreateOverheadFunction(PropPulseDbContext dbContext, ILogger<CreateOverheadFunction> logger)
    {
        _dbContext = dbContext;
        _logger = logger;
    }

    [Function("CreateOverhead")]
    public async Task<HttpResponseData> Run(
        [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "overheads")] HttpRequestData req)
    {
        try
        {
            Overhead? overhead = await JsonSerializer.DeserializeAsync<Overhead>(
                req.Body,
                new JsonSerializerOptions { PropertyNameCaseInsensitive = true });

            if (overhead is null)
            {
                HttpResponseData badRequest = req.CreateResponse(HttpStatusCode.BadRequest);
                await badRequest.WriteStringAsync("Request body is missing or invalid.");
                return badRequest;
            }

            overhead.Id = Guid.NewGuid();

            await _dbContext.Overheads.AddAsync(overhead);
            await _dbContext.SaveChangesAsync();

            HttpResponseData response = req.CreateResponse(HttpStatusCode.Created);
            await response.WriteAsJsonAsync(overhead);
            return response;
        }
        catch (JsonException ex)
        {
            _logger.LogError(ex, "Failed to deserialize the request body into an Overhead.");

            HttpResponseData badRequest = req.CreateResponse(HttpStatusCode.BadRequest);
            await badRequest.WriteStringAsync("Invalid JSON in request body.");
            return badRequest;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred while creating an overhead.");

            HttpResponseData errorResponse = req.CreateResponse(HttpStatusCode.InternalServerError);
            await errorResponse.WriteStringAsync("An unexpected error occurred. Please try again later.");
            return errorResponse;
        }
    }
}
