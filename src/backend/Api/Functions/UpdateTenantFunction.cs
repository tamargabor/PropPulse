using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Logging;
using PropPulse.Database;
using PropPulse.Models;
using System.Net;
using System.Text.Json;

namespace PropPulse.Api.Functions;

public class UpdateTenantFunction
{
    private readonly PropPulseDbContext _dbContext;
    private readonly ILogger<UpdateTenantFunction> _logger;

    public UpdateTenantFunction(PropPulseDbContext dbContext, ILogger<UpdateTenantFunction> logger)
    {
        _dbContext = dbContext;
        _logger = logger;
    }

    [Function("UpdateTenant")]
    public async Task<HttpResponseData> Run(
        [HttpTrigger(AuthorizationLevel.Anonymous, "put", Route = "tenants/{id:guid}")] HttpRequestData req,
        Guid id)
    {
        try
        {
            Tenant? payload = await JsonSerializer.DeserializeAsync<Tenant>(
                req.Body,
                new JsonSerializerOptions { PropertyNameCaseInsensitive = true });

            if (payload is null)
            {
                HttpResponseData badRequest = req.CreateResponse(HttpStatusCode.BadRequest);
                await badRequest.WriteStringAsync("Request body is missing or invalid.");
                return badRequest;
            }

            Tenant? existing = await _dbContext.Tenants.FindAsync(id);

            if (existing is null)
            {
                return req.CreateResponse(HttpStatusCode.NotFound);
            }

            existing.FullName = payload.FullName;
            existing.PhoneNumber = payload.PhoneNumber;
            existing.UserId = payload.UserId;

            await _dbContext.SaveChangesAsync();

            HttpResponseData response = req.CreateResponse(HttpStatusCode.OK);
            await response.WriteAsJsonAsync(existing);
            return response;
        }
        catch (JsonException ex)
        {
            _logger.LogError(ex, "Failed to deserialize the request body for tenant update (id: {TenantId}).", id);

            HttpResponseData badRequest = req.CreateResponse(HttpStatusCode.BadRequest);
            await badRequest.WriteStringAsync("Invalid JSON in request body.");
            return badRequest;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred while updating tenant with id {TenantId}.", id);

            HttpResponseData errorResponse = req.CreateResponse(HttpStatusCode.InternalServerError);
            await errorResponse.WriteStringAsync("An unexpected error occurred. Please try again later.");
            return errorResponse;
        }
    }
}
