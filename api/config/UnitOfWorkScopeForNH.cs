using FluentNHibernate.Cfg;
using FluentNHibernate.Cfg.Db;
using FluentNHibernate.Conventions.Helpers;
using data;
using NHibernate;
using NHibernate.SqlCommand;
using System;
using System.Runtime.CompilerServices;

[assembly: InternalsVisibleTo("setup, PublicKey=0024000004800000940000000602000000240000525341310004000001000100916d2a8526e75ce7a6e4cf7574b80d4f793339e44c64c7eedf425df6e188e1916a6f0647f1eb5ee7e6fbf348dc0d55b635b87f13605678c685c5f13084a8bfc5fc16e94b036f090f269573130a9c404f0c7df8bbf44d4e67f594a12d506e5eef4562f063c274ac0d7885c4296db28136ad18a5bbf81f2c0a52dd628711e044d3")]

namespace config
{
    public class UnitOfWorkScopeForNH : UnitOfWorkScope
    {
        private ISession _session;

        public UnitOfWorkScopeForNH(IUnitOfWorkScopeParams unitOfWorkScopeParams) :
            base(unitOfWorkScopeParams)
        {

        }

        public override void StartTransaction()
        {
            GetSession().Transaction.Begin();
        }

        public override void Commit()
        {
            _session.Flush();
            _session.Transaction.Commit();
        }

        public override void Rollback()
        {
            _session.Transaction.Rollback();
        }

        public override void CloseSession()
        {
            if (_session != null)
            {

                _session.Dispose();
                _session = null;
            }
        }

        private ISession GetSession()
        {
            if (_session == null)
            {
                _session = NHSessionFactory.OneISessionFactory(_connectionString).OpenSession();
            }
            return _session;
        }

        public ISession Session()
        {
            return GetSession();
        }
    }


    internal static class NHSessionFactory
    {
        private static ISessionFactory _oneISessionFactory;

        internal static bool recreateDatabaseSchema = false;
        internal static bool updateDatabaseSchema = false;

        internal static ISessionFactory OneISessionFactory(string connectionString)
        {
            if (_oneISessionFactory == null)
            {
                var configMap = GetConfigMap(connectionString);
                _oneISessionFactory = configMap.BuildSessionFactory();
            }
            return _oneISessionFactory;
        }

        internal static FluentConfiguration GetConfigMap(string connectionString)
        {
            var configurer = PostgreSQLConfiguration.PostgreSQL82.ConnectionString(connectionString);
            var configMap = Fluently.Configure()
                .Database(configurer)
                .ExposeConfiguration(c => c.SetProperty(global::NHibernate.Cfg.Environment.ReleaseConnections, "on_close"))
                // Remova esse comentário se quiser mostrar os Sqls no output.
                //.ExposeConfiguration(c => c.SetInterceptor(new SqlStatementInterceptor()))
                .Mappings(m =>
                {
                    m.FluentMappings.Conventions.Setup(s => s.Add(AutoImport.Never()));
                    m.FluentMappings.AddFromAssembly(System.Reflection.Assembly.GetExecutingAssembly());

                    m.FluentMappings.Conventions.Add(ConventionBuilder.Class.Always(x => x.Not.LazyLoad()));
                    m.FluentMappings.Conventions.Add(ConventionBuilder.Reference.Always(x => x.Cascade.None()));
                    m.FluentMappings.Conventions.Add(ConventionBuilder.Reference.Always(x => x.LazyLoad()));
                    m.FluentMappings.Conventions.Add(ConventionBuilder.HasMany.Always(x => x.LazyLoad()));
                    m.FluentMappings.Conventions.Add(ConventionBuilder.HasManyToMany.Always(x => x.LazyLoad()));
                    m.FluentMappings.Conventions.Add(ConventionBuilder.HasMany.Always(x => x.Cascade.None()));
                    m.FluentMappings.Conventions.Add(
                        ConventionBuilder.Property.When(
                            c => c.Expect(p => p.Property.PropertyType == typeof(string)),
                            i => i.CustomType("AnsiString")
                        )
                    );
                });     

            return configMap;
        }
    }

    internal class SqlStatementInterceptor : EmptyInterceptor
    {
        public override SqlString OnPrepareStatement(SqlString sql)
        {
            var sqlp = base.OnPrepareStatement(sql);
            Console.WriteLine(sqlp);
            return sqlp;
        }
    }
}
