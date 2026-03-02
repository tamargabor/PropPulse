using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Logging;
using PropPulse.Database;
using PropPulse.Models;
using System.Net;
using System.Text.Json;

namespace PropPulse.Api.Functions;

public class UpdateLeaseFunction
{
    private readonly PropPulseDbContext _dbContext;
    private readonly ILogger<UpdateLeaseFunction> _logger;

    public UpdateLeaseFunction(PropPulseDbContext dbContext, ILogger<UpdateLeaseFunction> logger)
    {
        _dbContext = dbContext;
        _logger = logger;
    }

    [Function("UpdateLease")]
    public async Task<HttpResponseData> Run(
        [HttpTrigger(AuthorizationLevel.Anonymous, "put", Route = "leases/{id:guid}")] HttpRequestData req,
        Guid id)
    {
        try
        {
            Lease? payload = await JsonSerializer.DeserializeAsync<Lease>(
                req.Body,
                new JsonSerializerOptions { PropertyNameCaseInsensitive = true });

            if (payload is null)
            {
                HttpResponseData badRequest = req.CreateResponse(HttpStatusCode.BadRequest);
                await badRequest.WriteStringAsync("Request body is missing or invalid.");
                return badRequest;
            }

            Lease? existing = await _dbContext.Leases.FindAsync(id);

            if (existing is null)
            {
                return req.CreateResponse(HttpStatusCode.NotFound);
            }

            existing.PropertyId = payload.PropertyId;
            existing.TenantId = payload.TenantId;
            existing.StartDate = payload.StartDate;
            existing.EndDate = payload.EndDate;
            existing.MonthlyRentAmount = payload.MonthlyRentAmount;
            existing.Status = payload.Status;

            await _dbContext.SaveChangesAsync();

            HttpResponseData response = req.CreateResponse(HttpStatusCode.OK);
            await response.WriteAsJsonAsync(existing);
            return response;
        }
        catch (JsonException ex)
        {
            _logger.LogError(ex, "Failed to deserialize the request body for lease update (id: {LeaseId}).", id);

            HttpResponseData badRequest = req.CreateResponse(HttpStatusCode.BadRequest);
            await badRequest.WriteStringAsync("Invalid JSON in request body.");
            return badRequest;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred while updating lease with id {LeaseId}.", id);

            HttpResponseData errorResponse = req.CreateResponse(HttpStatusCode.InternalServerError);
            await errorResponse.WriteStringAsync("An unexpected error occurred. Please try again later.");
            return errorResponse;
        }
    }
}
