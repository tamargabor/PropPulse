using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Logging;
using PropPulse.Database;
using PropPulse.Models;
using System.Net;
using System.Text.Json;

namespace PropPulse.Api.Functions;

public class CreateTenantFunction
{
    private readonly PropPulseDbContext _dbContext;
    private readonly ILogger<CreateTenantFunction> _logger;

    public CreateTenantFunction(PropPulseDbContext dbContext, ILogger<CreateTenantFunction> logger)
    {
        _dbContext = dbContext;
        _logger = logger;
    }

    [Function("CreateTenant")]
    public async Task<HttpResponseData> Run(
        [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "tenants")] HttpRequestData req)
    {
        try
        {
            Tenant? tenant = await JsonSerializer.DeserializeAsync<Tenant>(
                req.Body,
                new JsonSerializerOptions { PropertyNameCaseInsensitive = true });

            if (tenant is null)
            {
                HttpResponseData badRequest = req.CreateResponse(HttpStatusCode.BadRequest);
                await badRequest.WriteStringAsync("Request body is missing or invalid.");
                return badRequest;
            }

            tenant.Id = Guid.NewGuid();

            await _dbContext.Tenants.AddAsync(tenant);
            await _dbContext.SaveChangesAsync();

            HttpResponseData response = req.CreateResponse(HttpStatusCode.Created);
            await response.WriteAsJsonAsync(tenant);
            return response;
        }
        catch (JsonException ex)
        {
            _logger.LogError(ex, "Failed to deserialize the request body into a Tenant.");

            HttpResponseData badRequest = req.CreateResponse(HttpStatusCode.BadRequest);
            await badRequest.WriteStringAsync("Invalid JSON in request body.");
            return badRequest;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred while creating a tenant.");

            HttpResponseData errorResponse = req.CreateResponse(HttpStatusCode.InternalServerError);
            await errorResponse.WriteStringAsync("An unexpected error occurred. Please try again later.");
            return errorResponse;
        }
    }
}
