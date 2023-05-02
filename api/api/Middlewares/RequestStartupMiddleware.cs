using data;
using framework.Extensions;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace api.Middlewares
{
    public class RequestStartupMiddleware
    {
        private readonly RequestDelegate _next;

        public RequestStartupMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task Invoke(HttpContext httpContext, UnitOfWorkScope scope)
        {
            var transactionStarted = false;
            var numeroDeTentativas = 0;
            while (!transactionStarted)
            {
                try
                {
                    scope.StartTransaction();
                    transactionStarted = true;
                }
                catch (Exception e)
                {
                    numeroDeTentativas++;
                    if (numeroDeTentativas >= 5)
                    {
                        throw new Exception(string.Format("Erro na conexão com o banco de dados. \n\n{0}\n{1}", 
                            e.Message, e.InnerException != null ? e.InnerException.Message : null).Trim(), e);
                    }
                    Thread.Sleep(3000);
                }
            }
            try
            {
                await _next(httpContext);
                scope.Commit();
                scope.CloseSession();
            }
            catch (Exception e)
            {
               

                scope.Rollback();
                scope.CloseSession();
                throw e;
            }
        }
    }

    // Extension method used to add the middleware to the HTTP request pipeline.
    public static class AuthenticationMidllewareExtensions
    {
        public static IApplicationBuilder UseRequestStartupMiddleware(this IApplicationBuilder builder)
        {
            return builder.UseMiddleware<RequestStartupMiddleware>();
        }
    }
}
