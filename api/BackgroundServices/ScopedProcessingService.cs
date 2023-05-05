using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace api.BackgroundServices
{
    internal class ScopedProcessingService : BackgroundService
    {
        private readonly IServiceProvider Services;

        public ScopedProcessingService(IServiceProvider services)
        {
            this.Services = services;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            await DoWork(stoppingToken);
        }

        private async Task DoWork(CancellationToken stoppingToken)
        {
            using (var scope = Services.CreateScope())
            {
                var scopedProcessingService = scope.ServiceProvider.GetRequiredService<EnvioDeEmailService>();
                await scopedProcessingService.DoWork(stoppingToken);
            }
        }
    }
}
