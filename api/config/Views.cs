using System;
using System.Collections.Generic;
using System.Text;
using NHibernate;
using Npgsql;

namespace config
{
    public static class Views
    {
        private static readonly List<string> _scripts = new List<string>();
        private static readonly List<string> _dropScripts = new List<string>();

        internal static void RegisterCreateScript(string script)
        {
            _scripts.Add(script);
        }

        public static void Execute(ISession session)
        {
            foreach (var script in _dropScripts)
            {
                Console.WriteLine();
                Console.WriteLine(script);
                var command = session.Connection.CreateCommand();
                command.CommandText = script;
                try
                {
                    command.ExecuteNonQuery();
                }
                catch (PostgresException e)
                {                    
                    if (e.SqlState != "42P01")
                    {
                        throw;
                    }
                }
            }
            foreach (var script in _scripts)
            {
                Console.WriteLine();
                Console.WriteLine(script);
                var command = session.Connection.CreateCommand();
                command.CommandText = script;
                command.ExecuteNonQuery();
            }
        }

        internal static void RegisterDropScript(string script)
        {
            _dropScripts.Add(script);
        }
    }
}
