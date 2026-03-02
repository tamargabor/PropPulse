using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Logging;
using PropPulse.Database;
using PropPulse.Models;
using System.Net;
using System.Text.Json;

namespace PropPulse.Api.Functions;

public class CreateLeaseFunction
{
    private readonly PropPulseDbContext _dbContext;
    private readonly ILogger<CreateLeaseFunction> _logger;

    public CreateLeaseFunction(PropPulseDbContext dbContext, ILogger<CreateLeaseFunction> logger)
    {
        _dbContext = dbContext;
        _logger = logger;
    }

    [Function("CreateLease")]
    public async Task<HttpResponseData> Run(
        [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "leases")] HttpRequestData req)
    {
        try
        {
            Lease? lease = await JsonSerializer.DeserializeAsync<Lease>(
                req.Body,
                new JsonSerializerOptions { PropertyNameCaseInsensitive = true });

            if (lease is null)
            {
                HttpResponseData badRequest = req.CreateResponse(HttpStatusCode.BadRequest);
                await badRequest.WriteStringAsync("Request body is missing or invalid.");
                return badRequest;
            }

            lease.Id = Guid.NewGuid();

            await _dbContext.Leases.AddAsync(lease);
            await _dbContext.SaveChangesAsync();

            HttpResponseData response = req.CreateResponse(HttpStatusCode.Created);
            await response.WriteAsJsonAsync(lease);
            return response;
        }
        catch (JsonException ex)
        {
            _logger.LogError(ex, "Failed to deserialize the request body into a Lease.");

            HttpResponseData badRequest = req.CreateResponse(HttpStatusCode.BadRequest);
            await badRequest.WriteStringAsync("Invalid JSON in request body.");
            return badRequest;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred while creating a lease.");

            HttpResponseData errorResponse = req.CreateResponse(HttpStatusCode.InternalServerError);
            await errorResponse.WriteStringAsync("An unexpected error occurred. Please try again later.");
            return errorResponse;
        }
    }
}
