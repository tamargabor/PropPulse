using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Logging;
using PropPulse.Database;
using PropPulse.Models;
using System.Net;
using System.Text.Json;

namespace PropPulse.Api.Functions;

public class UpdateOverheadFunction
{
    private readonly PropPulseDbContext _dbContext;
    private readonly ILogger<UpdateOverheadFunction> _logger;

    public UpdateOverheadFunction(PropPulseDbContext dbContext, ILogger<UpdateOverheadFunction> logger)
    {
        _dbContext = dbContext;
        _logger = logger;
    }

    [Function("UpdateOverhead")]
    public async Task<HttpResponseData> Run(
        [HttpTrigger(AuthorizationLevel.Anonymous, "put", Route = "overheads/{id:guid}")] HttpRequestData req,
        Guid id)
    {
        try
        {
            Overhead? payload = await JsonSerializer.DeserializeAsync<Overhead>(
                req.Body,
                new JsonSerializerOptions { PropertyNameCaseInsensitive = true });

            if (payload is null)
            {
                HttpResponseData badRequest = req.CreateResponse(HttpStatusCode.BadRequest);
                await badRequest.WriteStringAsync("Request body is missing or invalid.");
                return badRequest;
            }

            Overhead? existing = await _dbContext.Overheads.FindAsync(id);

            if (existing is null)
            {
                return req.CreateResponse(HttpStatusCode.NotFound);
            }

            existing.Type = payload.Type;
            existing.Amount = payload.Amount;
            existing.ServiceMonth = payload.ServiceMonth;
            existing.PropertyId = payload.PropertyId;
            existing.LeaseId = payload.LeaseId;
            existing.DueDate = payload.DueDate;
            existing.IsPaid = payload.IsPaid;

            await _dbContext.SaveChangesAsync();

            HttpResponseData response = req.CreateResponse(HttpStatusCode.OK);
            await response.WriteAsJsonAsync(existing);
            return response;
        }
        catch (JsonException ex)
        {
            _logger.LogError(ex, "Failed to deserialize the request body for overhead update (id: {OverheadId}).", id);

            HttpResponseData badRequest = req.CreateResponse(HttpStatusCode.BadRequest);
            await badRequest.WriteStringAsync("Invalid JSON in request body.");
            return badRequest;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred while updating overhead with id {OverheadId}.", id);

            HttpResponseData errorResponse = req.CreateResponse(HttpStatusCode.InternalServerError);
            await errorResponse.WriteStringAsync("An unexpected error occurred. Please try again later.");
            return errorResponse;
        }
    }
}
