using Microsoft.Azure.Functions.Worker;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using PropPulse.Database;

var host = new HostBuilder()
    .ConfigureFunctionsWorkerDefaults()
    .ConfigureServices((context, services) =>
    {
        var connectionString = context.Configuration["SqlConnectionString"]
            ?? throw new InvalidOperationException(
                "SqlConnectionString is not configured. " +
                "Add it to local.settings.json (locally) or to the Application Settings in Azure.");

        services.AddDbContext<PropPulseDbContext>(options =>
            options.UseSqlServer(connectionString));
    })
    .Build();

await host.RunAsync();
