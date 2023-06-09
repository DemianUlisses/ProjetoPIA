﻿using framework;
using framework.Extensions;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.Net.Http.Headers;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;

namespace api.Middlewares
{
    public class ErrorHandlingMiddleware
    {
        private readonly RequestDelegate _next;

        public ErrorHandlingMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task Invoke(HttpContext context /* other dependencies */)
        {
            if (context.Request.Method == "OPTIONS")
            {
                PrepareResponse(context);
                return;
            }
            else
            {
                try
                {
                    await _next(context);
                }
                catch (Exception ex)
                {
                    await HandleExceptionAsync(context, ex);
                }
            }
        }

        private static Task HandleExceptionAsync(HttpContext context, Exception ex)
        {
            PrepareResponse(context);

            var code = HttpStatusCode.InternalServerError; // 500 if unexpected

            /*if (ex is MyNotFoundException) code = HttpStatusCode.NotFound;
            else if (ex is MyException) code = HttpStatusCode.BadRequest;*/
            if (ex is NotAuthenticatedException)
            {
                code = HttpStatusCode.Unauthorized;
            }
            var result = JsonConvert.SerializeObject(new { errorMessage = ex.Message });
            context.Response.ContentType = "application/json";
            context.Response.StatusCode = (int)code;

            //pch.log.Logger.Add(Log.Modulo.WebApi.Description(), context.Request.Path.ToString().ToLower(),
            //    GetExceptionInfo(ex), Log.Categoria.Geral.ToInt(), Log.SubCategoria.Erro.ToInt(),
            //    context.TraceIdentifier, context.Request.Method, context.Response.StatusCode);

            return context.Response.WriteAsync(result);
        }

        private static void PrepareResponse(HttpContext httpContext)
        {
            httpContext.Response.Headers[HeaderNames.AccessControlAllowOrigin] = httpContext.Request.Headers[HeaderNames.Origin];
            //httpContext.Response.Headers[HeaderNames.AccessControlAllowOrigin] = "null";
            httpContext.Response.Headers[HeaderNames.AccessControlAllowCredentials] = "true";
            httpContext.Response.Headers[HeaderNames.AccessControlAllowHeaders] = "X-Requested-With, Content-Type, Accept, IdDoUsuario, IdDaPessoa, Authorization";
            httpContext.Response.Headers[HeaderNames.AccessControlAllowMethods] = "OPTIONS, GET, POST, PUT, DELETE";
        }

        private static string GetExceptionInfo(Exception e)
        {
            var result =
                string.Format("Message: {0}\nStack trace: {1}\n", e.Message, e.StackTrace);
            if (e.InnerException != null)
            {
                result = string.Format("{0}\nInner exception: {1}", result, e.InnerException.Message);
            }
            return result;
        }
    }

    // Extension method used to add the middleware to the HTTP request pipeline.
    public static class ErrorHandlingMiddlewareExtensions
    {
        public static IApplicationBuilder UseErrorHandlingMiddleware(this IApplicationBuilder builder)
        {
            return builder.UseMiddleware<ErrorHandlingMiddleware>();
        }
    }
}