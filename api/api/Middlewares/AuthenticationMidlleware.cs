using framework;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.Net.Http.Headers;
using System.Collections.Generic;
using System.Security.Claims;
using System.Security.Principal;
using System.Threading.Tasks;

namespace api
{

    public class CustomIdentity : IIdentity
    {
        public string AuthenticationType { get; set; }
        public bool IsAuthenticated { get; set; }
        public string Name { get; set; }
    }

    public class AuthenticationMidlleware
    {
        private readonly RequestDelegate _next;

        public AuthenticationMidlleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task Invoke(HttpContext httpContext, api.Cfg cfg)
        {
            if (httpContext.Request.Method != "OPTIONS")
            {
                string IdDoUsuario = httpContext.Request.Headers["IdDoUsuario"];
                string Authorization = httpContext.Request.Headers["Authorization"];
                string Modulo = httpContext.Request.Path;
                string Metodo = httpContext.Request.Method.ToUpper();

                if ((Modulo != null) &&
                    (Modulo.StartsWith("/chathub")) &&
                    (Authorization != null) &&
                    (Authorization.Contains(":")))
                {
                    var strArray = Authorization.Split(":");
                    IdDoUsuario = strArray[0].Replace("Bearer ", "");
                    Authorization = strArray[1];
                }

                if ((Modulo != null) &&
                    (Modulo.StartsWith("/chathub")) &&
                    httpContext.Request.Query.ContainsKey("access_token"))
                {
                    Authorization = httpContext.Request.Query["access_token"];
                    var strArray = Authorization.Split(":");
                    IdDoUsuario = strArray[0].Replace("Bearer ", "");
                    Authorization = strArray[1];
                }

                var authenticationStatus = cfg.AccessControl.Authenticate(IdDoUsuario, Authorization, Modulo, Metodo, true);

                if (!(authenticationStatus.Equals(AuthenticationStatus.Authenticated) ||
                    authenticationStatus.Equals(AuthenticationStatus.AuthenticationNotRequired)))
                {
                    PrepareResponse(httpContext);
                    httpContext.Response.StatusCode = 401; //UnAuthorized   
                    await httpContext.Response.WriteAsync(GetMessage(authenticationStatus));
                    return;
                }

                var identity = new CustomIdentity()
                {
                    AuthenticationType = "Custom",
                    IsAuthenticated = true,
                    Name = IdDoUsuario
                };

                httpContext.User = new ClaimsPrincipal(identity) { };

                var rotina = default(long?);
                var accessValidationStatus = cfg.AccessControl.ValidateAccess(
                    IdDoUsuario, Authorization, Modulo, Metodo, false, out rotina);

                if (!(accessValidationStatus.Equals(AccessValidationStatus.AccessGranted)))
                {
                    PrepareResponse(httpContext);
                    httpContext.Response.StatusCode = 403; //Access Denied   
                    await httpContext.Response.WriteAsync(
                        rotina.HasValue ? $"Você não tem acesso a essa rotina [{rotina.Value.ToString("0000")}]." :
                        "Você não tem acesso a essa rotina.");
                    return;
                }
                else
                {
                    if (long.TryParse(IdDoUsuario, out long idDoUsuario))
                    {
                        cfg.IdDoUsuario = idDoUsuario;
                    }
                }
            }
            await _next.Invoke(httpContext);
        }

        private string GetMessage(AuthenticationStatus authenticationStatus)
        {
            var dict = new Dictionary<AuthenticationStatus, string>();
            dict.Add(AuthenticationStatus.Authenticated, "Autenticado.");
            dict.Add(AuthenticationStatus.AuthenticationNotRequired, "Autenticação não necessária.");
            dict.Add(AuthenticationStatus.InvalidUser, "Usuário inválido.");
            dict.Add(AuthenticationStatus.TokenExpired, "Sessão expirada.");            
            dict.Add(AuthenticationStatus.TokenOverwiten, "Sessão encerrada. Seu usuário está logado em outro local.");
            return dict[authenticationStatus];
        }

        private void PrepareResponse(HttpContext httpContext)
        {
            httpContext.Response.Headers[HeaderNames.AccessControlAllowOrigin] = httpContext.Request.Headers[HeaderNames.Origin];
            //httpContext.Response.Headers[HeaderNames.AccessControlAllowOrigin] = "null";
            httpContext.Response.Headers[HeaderNames.AccessControlAllowCredentials] = "true";
            httpContext.Response.Headers[HeaderNames.AccessControlAllowHeaders] = "X-Requested-With, Content-Type, Accept, IdDoUsuario, IdDaPessoa, Authorization";
            httpContext.Response.Headers[HeaderNames.AccessControlAllowMethods] = "OPTIONS, GET, POST, PUT, DELETE";
        }
    }

    // Extension method used to add the middleware to the HTTP request pipeline.
    public static class AuthenticationMidllewareExtensions
    {
        public static IApplicationBuilder UseAuthenticationMidlleware(this IApplicationBuilder builder)
        {
            return builder.UseMiddleware<AuthenticationMidlleware>();
        }
    }
}
