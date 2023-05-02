using NHibernate.Tool.hbm2ddl;
using System.Collections.Generic;
using System.Text;

namespace setup
{
    public class Setup : CustomProgram
    {
        private static readonly byte[] _usuario_ramon = new byte[] { 114, 97, 109, 111, 110 };
        private static readonly byte[] _senha_ramon = new byte[] { 101, 114, 116, 53, 53, 48 };
        private static readonly byte[] _usuario_ivan = new byte[] { 111, 99, 116, 111, 112, 117, 115 };
        private static readonly byte[] _senha_ivan = new byte[] { 108, 105, 118, 105, 110, 103, 73, 110, 84, 104,
            101, 83, 101, 97, 84, 111, 100, 97, 121 };

        public static void Main(string[] args)
        {
            Execute<Setup>();
        }

        protected override void RegistrarOpcoes()
        {
#if DEBUG
            AdicionarOpcao("criar novo banco de dados", () => CriarBancoDeDados());
            AdicionarOpcao("recriar objetos", () => RecriarObjetosDeBancoDeDados());
            AdicionarOpcao("atualizar objetos", () => AtualizarObjetosDeBancoDeDados());
            AdicionarOpcao("sair", () => Sair());
#else
            AdicionarOpcao("login", () => Logar());
            AdicionarOpcao("sair", () => Sair());
#endif
        }

        protected virtual bool Logar()
        {
            Clear();
            var usuarioInformado = ObterValor<string>("Usuário:");
            var senhaInformada = ObterValor<string>("Senha:");

            var loginOk = LoginOk(usuarioInformado, senhaInformada);

            if (loginOk)
            {
                LimparOpcoes();
                AdicionarOpcao("criar novo banco de dados", () => CriarBancoDeDados());
                AdicionarOpcao("recriar objetos", () => RecriarObjetosDeBancoDeDados());
                AdicionarOpcao("atualizar objetos", () => AtualizarObjetosDeBancoDeDados());
                AdicionarOpcao("sair", () => Sair());
            }
            else
            {
                WriteLine("Usuário ou senha inválida.");
                Esperar();
            }
            return true;
        }

        private bool LoginOk(string usuarioInformado, string senhaInformada)
        {
            var result = false;
            var usuarios = new Dictionary<string, string>
            {
                { UTF8Encoding.UTF8.GetString(_usuario_ramon), UTF8Encoding.UTF8.GetString(_senha_ramon) },
                { UTF8Encoding.UTF8.GetString(_usuario_ivan), UTF8Encoding.UTF8.GetString(_senha_ivan) }
            };

            if (usuarios.ContainsKey(usuarioInformado))
            {
                result = usuarios[usuarioInformado] == senhaInformada;
            }
            return result;
        }

        protected virtual bool AtualizarObjetosDeBancoDeDados()
        {
            Clear();
            var parametrosDeAcessoAoBanco = GetParametrosDeAcessoABanco();
            var confirma = ObterValor<bool>(
                string.Format("Servidor {0}:{1}, banco de dados {2}. Confirma a atualização dos objetos?",
                    parametrosDeAcessoAoBanco.Servidor, parametrosDeAcessoAoBanco.Porta,
                    parametrosDeAcessoAoBanco.NomeDoBancoDeDados));
            var connectionString = parametrosDeAcessoAoBanco.GetConnectionString();
            UpdateDatabaseSchema(connectionString);
            WriteLine("Objetos atualizados com suceso!");
            Esperar();
            return true;
        }

        protected virtual bool RecriarObjetosDeBancoDeDados()
        {
            Clear();
            var parametrosDeAcessoAoBanco = GetParametrosDeAcessoABanco();
            var confirma = ObterValor<bool>(string.Format(
                @"Atenção!!!
Essa operação vai APAGAR TODOS OS DADOS do banco de dados {0} no servidor {1}:{2}. Deseja realmente prosseguir?",
                 parametrosDeAcessoAoBanco.NomeDoBancoDeDados, parametrosDeAcessoAoBanco.Servidor,
                 parametrosDeAcessoAoBanco.Porta));
            var connectionString = parametrosDeAcessoAoBanco.GetConnectionString();
            RecreateDatabaseSchema(connectionString);
            WriteLine("Objetos recriados com suceso!");
            Esperar();
            return true;
        }

        protected virtual void RecreateDatabaseSchema(string connectionString)
        {
            var configMap = config.NHSessionFactory.GetConfigMap(connectionString);
            configMap.ExposeConfiguration(cfg => new SchemaExport(cfg).Execute(true, true, false));

            using (var sessionFactory = configMap.BuildSessionFactory())
            {
                using (var session = sessionFactory.OpenSession())
                {
                    config.Views.Execute(session);
                }
            }
        }

        protected virtual void UpdateDatabaseSchema(string connectionString)
        {
            var configMap = config.NHSessionFactory.GetConfigMap(connectionString);
            configMap.ExposeConfiguration(cfg => new SchemaUpdate(cfg).Execute(false, true));

            using (var sessionFactory = configMap.BuildSessionFactory())
            {
                using (var session = sessionFactory.OpenSession())
                {
                    config.Views.Execute(session);
                }
            }
        }

        protected virtual bool CriarBancoDeDados()
        {
            Clear();
            var parametrosDeAcessoAoBanco = GetParametrosDeAcessoABanco();
            var confirma = ObterValor<bool>(string.Format("Servidor {0}:{1}, banco de dados {2}. Confirma a criação?",
                parametrosDeAcessoAoBanco.Servidor, parametrosDeAcessoAoBanco.Porta,
                parametrosDeAcessoAoBanco.NomeDoBancoDeDados));
            var connectionString = parametrosDeAcessoAoBanco.GetConnectionString(false);
            using (var connection = new Npgsql.NpgsqlConnection(connectionString))
            {
                connection.Open();
                var command = connection.CreateCommand();
                command.CommandText = string.Format(
        @"CREATE DATABASE {0}
    WITH OWNER = {1}
    ENCODING = 'UTF8'
    CONNECTION LIMIT = -1", parametrosDeAcessoAoBanco.NomeDoBancoDeDados, parametrosDeAcessoAoBanco.Usuario);
                command.ExecuteNonQuery();
                WriteLine("Banco de dados criado com sucesso!");
                Esperar();
            }
            return true;
        }

        protected virtual ParametrosDeAcessoABanco GetParametrosDeAcessoABanco()
        {
            var result = new ParametrosDeAcessoABanco
            {
                Servidor = ObterValor<string>("Servidor [localhost]:"),
                Porta = ObterValor<int?>("Porta [5432]:"),
                Usuario = ObterValor<string>("Usuário [postgres]:"),
                Senha = ObterValor<string>("Senha:"),
                NomeDoBancoDeDados = ObterValor<string>("Nome do banco de dados:")
            };

            result.Servidor = !string.IsNullOrWhiteSpace(result.Servidor) ? result.Servidor : "localhost";
            result.Porta = result.Porta.HasValue ? result.Porta.Value : (int?)5432;
            result.Usuario = !string.IsNullOrWhiteSpace(result.Usuario) ? result.Usuario : "postgres";

            return result;
        }
    }
}
