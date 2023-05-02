using api.Middlewares;
using api.Services;
using ojogodabolsa;
using config;
using data;
using framework;
using messages;
using Microsoft.AspNet.OData.Builder;
using Microsoft.AspNet.OData.Extensions;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Linq;
using System.Reflection;
using api.BackgroundServices;

namespace api
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
           
            Cfg.DiretorioParaArmazenamentoDeArquivos =
                Configuration.GetValue<string>("DiretorioParaArmazenamentoDeArquivos");
            Cfg.Url = Configuration.GetValue<string>("Url");
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddMvc(x =>
            {
                x.EnableEndpointRouting = false;
            })
                // Incompatibilidade com o 3.1
                // .SetCompatibilityVersion(CompatibilityVersion.)
                // Incompatibilidade com o 3.1
                // .AddJsonOptions(x => x.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore);
                .AddNewtonsoftJson(x =>
                {
                    x.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore;
                });
            services.AddCors(options =>
            {
                options.AddPolicy("CorsPolicy",
                                    builder => builder
                                    .AllowAnyOrigin()
                                    .AllowAnyMethod()
                                    .AllowAnyHeader()
                                    );

                options.AddPolicy("signalr",
                    builder => builder
                    .AllowAnyMethod()
                    .AllowAnyHeader()

                    .AllowCredentials()
                    .SetIsOriginAllowed(hostName => true));
            });
            services.AddSignalR();

            AppDependencyRegister.Register(typeof(UnitOfWorkScope), typeof(UnitOfWorkScopeForNH), true,
            (dependency, implementation) =>
            {
                services.AddScoped(dependency, implementation);
            });

            AppDependencyRegister.Register(typeof(Mensagens), typeof(Mensagens), true,
            (dependency, implementation) =>
            {
                services.AddTransient(dependency, implementation);
            });

            AppDependencyRegister.Register(typeof(Cfg), typeof(Cfg), true,
            (dependency, implementation) =>
            {
                services.AddScoped(dependency, implementation);
            });

            services.AddSingleton<IUnitOfWorkScopeParams>((provider) =>
            {
                var result = new UnitOfWorkScopeParams()
                {
                    ConnectionString = Configuration.GetConnectionString("default"),
                    DefaultAction = UnitOfWorkScopeDefaultAction.Rollback,
                    UseTransaction = true,
                };
                return result;
            });

            AppDependencyRegister.Register(typeof(IUserValidator), typeof(WebApiUserValidator), true,
            (dependency, implementation) =>
            {
                services.AddTransient(dependency, implementation);
            });

            AppDependencyRegister.Register(typeof(IKeyProvider), typeof(WebApiKeyProvider), true,
            (dependency, implementation) =>
            {
                services.AddTransient(dependency, implementation);
            });

            AppDependencyRegister.Register(typeof(IMessageControl), typeof(MessagesPtBr), false,
            (dependency, implementation) =>
            {
                services.AddTransient(dependency, implementation);
            });

            AppDependencyRegister.Register(typeof(AccessControl), typeof(AccessControl), true,
            (dependency, implementation) =>
            {
                services.AddTransient(dependency, implementation);
            });

            AppDependencyRegister.Register(typeof(IUnitOfWork<>), typeof(UnitOfWorkForHN<>), true,
            (dependency, implementation) =>
            {
                services.AddTransient(dependency, implementation);
            });

            AppDependencyRegister.Register(typeof(ISqlCommand), typeof(NHCommand), true,
            (dependency, implementation) =>
            {
                services.AddTransient(dependency, implementation);
            });
            
            AppDependencyRegister.Register(typeof(ojogodabolsa.Pessoa).Assembly, true,
            (dependency, implementation) =>
            {
                services.AddTransient(dependency, implementation);
            });


            AppDependencyRegister.Register(typeof(data.Repository<>).Assembly, true,
            (dependency, implementation) =>
            {
                services.AddTransient(dependency, implementation);
            });

            AppDependencyRegister.Register(Assembly.GetExecutingAssembly(), "api.Controllers", true,
            (dependency, implementation) =>
            {
                services.AddTransient(dependency, implementation);
            });

            AppDependencyRegister.Register(Assembly.GetExecutingAssembly(), "api.Conversors", true,
            (dependency, implementation) =>
            {
                services.AddTransient(dependency, implementation);
            });

            services.AddOData();

            services.AddCors(options =>
            {
                options.AddPolicy("AllowAll",
                    builder =>
                    {
                        builder.AllowAnyOrigin()
                            .WithMethods("OPTIONS", "GET", "POST", "PUT", "DELETE")
                            .AllowAnyHeader();
                    });
            });

            services.Configure<MvcOptions>(options =>
            {
                // Incompatibilidade com o 3.1
                // options.Filters.Add(new CorsAuthorizationFilterFactory("AllowAll"));
            });

            // Incompatibilidade com o 3.1
            // services.BuildServiceProvider();

            services.AddHostedService<ScopedProcessingService>();
            services.AddScoped<EnvioDeEmailService, EnvioDeEmailService>();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        [Obsolete]
        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseHsts();
            }

            app.UseErrorHandlingMiddleware();
            app.UseRequestStartupMiddleware();
            app.UseAuthenticationMidlleware();
            app.UseDefaultFiles();

            app.UseStaticFiles();

            app.UseCors("CorsPolicy");

            app.UseAuthentication();

            var builder = new ODataConventionModelBuilder(app.ApplicationServices);

            app.UseMvc(routeBuilder =>
            {
                // and this line to enable OData query option, for example $filter
                routeBuilder.Select().Expand().Filter().OrderBy().MaxTop(null).Count();

                routeBuilder.MapODataServiceRoute("odata", "odata", builder.GetEdmModel());

                // uncomment the following line to Work-around for #1175 in beta1
                routeBuilder.EnableDependencyInjection();
            });
        }
    }

    internal static class AppDependencyRegister
    {
        public static void Register(Assembly assembly, bool resolveProperties, Action<Type, Type> handler)
        {
            foreach (var t in assembly.GetTypes()
                .Where(t => !t.IsAbstract))
            {
                handler(t, t);
            }
        }

        public static void Register(Type dependency, Type implementation, bool resolveProperties, Action<Type, Type> handler)
        {
            handler(dependency, implementation);
        }

        public static void Register(Assembly assembly, string nameSpace, bool resolveProperties, Action<Type, Type> handler)
        {
            foreach (var t in assembly.GetTypes()
                .Where(t => !t.IsAbstract)
                .Where(t => t.Namespace == nameSpace))
            {
                handler(t, t);
            }
        }
    }
}
