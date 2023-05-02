using data;
using System.Collections.Generic;
using System.Text;

namespace ojogodabolsa
{
    public class RotinaDoSistema: ISearchableEntity
    {
        public long Id { get; set; }
        public string NomeDaEntidade => "Rotina do sistema";
        public Genero GeneroDaEntidade => Genero.Feminino;
        public string Descricao { get; set; }

        public string Searchable { get; set; }
        public virtual string GetSearchableText()
        {
            var result = new StringBuilder();
            result.Append(Descricao);
            return SearchableBuilder.Build(result.ToString());
        }
    }

    public static class RotinasDoSistema
    {
        private static Dictionary<long, KeyValuePair<string, string>> rotinasLivres = null;
        private static Dictionary<long, KeyValuePair<string, string>> rotinasControladas = null;

        public static Dictionary<long, KeyValuePair<string, string>> RotinasLivres()
        {
            if (rotinasLivres == null)
            {
                rotinasLivres = new Dictionary<long, KeyValuePair<string, string>>();
                rotinasLivres.Add(0, new KeyValuePair<string, string>("/", "GET"));
                rotinasLivres.Add(5, new KeyValuePair<string, string>("/login/token", "POST"));
                rotinasLivres.Add(6, new KeyValuePair<string, string>("/login/refresh_token", "POST"));
                rotinasLivres.Add(7, new KeyValuePair<string, string>("/login/recover", "POST"));
                rotinasLivres.Add(8, new KeyValuePair<string, string>("/login/pushtoken", "POST"));
                rotinasLivres.Add(9, new KeyValuePair<string, string>("/login/log", "POST"));
                rotinasLivres.Add(6000, new KeyValuePair<string, string>("/arquivo", "POST"));
                rotinasLivres.Add(6001, new KeyValuePair<string, string>("/arquivo*", "GET"));
                rotinasLivres.Add(3004, new KeyValuePair<string, string>("/jogador/cadastroweb", "POST"));
                rotinasLivres.Add(3006, new KeyValuePair<string, string>("/jogador/porusuario*", "GET"));
                rotinasControladas.Add(3007, new KeyValuePair<string, string>("/jogador/alterardadosmobile", "PUT"));
            }
            return rotinasLivres;
        }

        public static Dictionary<long, KeyValuePair<string, string>> RotinasControladas()
        {
            if (rotinasControladas == null)
            {
                rotinasControladas = new Dictionary<long, KeyValuePair<string, string>>();

                rotinasControladas.Add(1, new KeyValuePair<string, string>("/usuario", "POST"));
                rotinasControladas.Add(2, new KeyValuePair<string, string>("/usuario", "PUT"));
                rotinasControladas.Add(3, new KeyValuePair<string, string>("/usuario*", "DELETE"));
                rotinasControladas.Add(4, new KeyValuePair<string, string>("/usuario*", "GET"));

                rotinasControladas.Add(20, new KeyValuePair<string, string>("/perfilusuario", "POST"));
                rotinasControladas.Add(21, new KeyValuePair<string, string>("/perfilusuario", "PUT"));
                rotinasControladas.Add(22, new KeyValuePair<string, string>("/perfilusuario*", "DELETE"));
                rotinasControladas.Add(23, new KeyValuePair<string, string>("/perfilusuario*", "GET"));         

                rotinasControladas.Add(3000, new KeyValuePair<string, string>("/jogador", "POST"));
                rotinasControladas.Add(3001, new KeyValuePair<string, string>("/jogador", "PUT"));
                rotinasControladas.Add(3002, new KeyValuePair<string, string>("/jogador*", "DELETE"));
                rotinasControladas.Add(3003, new KeyValuePair<string, string>("/jogador*;/jogador/buscar*;/jogador/combosparacadastro", "GET"));
                
                rotinasControladas.Add(2811, new KeyValuePair<string, string>("/conta", "PUT"));
                rotinasControladas.Add(2813, new KeyValuePair<string, string>("/conta;/conta/combos", "GET"));

                rotinasControladas.Add(7000, new KeyValuePair<string, string>("/parametro", "POST"));
                rotinasControladas.Add(7001, new KeyValuePair<string, string>("/parametro", "PUT"));
                rotinasControladas.Add(7002, new KeyValuePair<string, string>("/parametro*", "DELETE"));
                rotinasControladas.Add(7003, new KeyValuePair<string, string>("/parametro*", "GET"));

                rotinasControladas.Add(2510, new KeyValuePair<string, string>("/feriado", "POST"));
                rotinasControladas.Add(2511, new KeyValuePair<string, string>("/feriado", "PUT"));
                rotinasControladas.Add(2512, new KeyValuePair<string, string>("/feriado*", "DELETE"));
                rotinasControladas.Add(2513, new KeyValuePair<string, string>("/feriado*", "GET"));

                rotinasControladas.Add(2010, new KeyValuePair<string, string>("/acao", "POST"));
                rotinasControladas.Add(2011, new KeyValuePair<string, string>("/acao", "PUT"));
                rotinasControladas.Add(2012, new KeyValuePair<string, string>("/acao*", "DELETE"));
                rotinasControladas.Add(2013, new KeyValuePair<string, string>("/acao*", "GET"));

                rotinasControladas.Add(2110, new KeyValuePair<string, string>("/semana", "POST"));
                rotinasControladas.Add(2111, new KeyValuePair<string, string>("/semana", "PUT"));
                rotinasControladas.Add(2112, new KeyValuePair<string, string>("/semana*", "DELETE"));
                rotinasControladas.Add(2113, new KeyValuePair<string, string>("/semana*;/semana/semana-ativa", "GET"));

                rotinasControladas.Add(2310, new KeyValuePair<string, string>("/palpite", "POST"));
                rotinasControladas.Add(2311, new KeyValuePair<string, string>("/palpite", "PUT"));
                rotinasControladas.Add(2312, new KeyValuePair<string, string>("/palpite*", "DELETE"));
                rotinasControladas.Add(2313, new KeyValuePair<string, string>("/palpite*;/palpite/palpite-aleatorio*;/palpite/palpite-anterior*;/resultado", "GET"));

                rotinasControladas.Add(2410, new KeyValuePair<string, string>("/dashboard", "POST"));
                rotinasControladas.Add(2411, new KeyValuePair<string, string>("/dashboard", "PUT"));
                rotinasControladas.Add(2412, new KeyValuePair<string, string>("/dashboard*", "DELETE"));
                rotinasControladas.Add(2413, new KeyValuePair<string, string>("/dashboard*", "GET"));
                rotinasControladas.Add(2414, new KeyValuePair<string, string>("/dashboard/dashboard-jogador", "GET"));

                rotinasControladas.Add(2610, new KeyValuePair<string, string>("/ganhadores", "POST"));
                rotinasControladas.Add(2611, new KeyValuePair<string, string>("/ganhadores", "PUT"));
                rotinasControladas.Add(2612, new KeyValuePair<string, string>("/ganhadores*", "DELETE"));   
                rotinasControladas.Add(2613, new KeyValuePair<string, string>("/ganhadores*;/ganhadores/combos-para-consulta-de-ganhadores", "GET"));
                rotinasControladas.Add(2614, new KeyValuePair<string, string>("/ganhadores/ganhadores-jogador*", "GET"));

                rotinasControladas.Add(2710, new KeyValuePair<string, string>("/banco", "POST"));
                rotinasControladas.Add(2711, new KeyValuePair<string, string>("/banco", "PUT"));
                rotinasControladas.Add(2712, new KeyValuePair<string, string>("/banco*", "DELETE"));
                rotinasControladas.Add(2713, new KeyValuePair<string, string>("/banco*", "GET"));

                rotinasControladas.Add(2910, new KeyValuePair<string, string>("/liga", "POST"));
                rotinasControladas.Add(2911, new KeyValuePair<string, string>("/liga", "PUT"));
                rotinasControladas.Add(2912, new KeyValuePair<string, string>("/liga*", "DELETE"));
                rotinasControladas.Add(2913, new KeyValuePair<string, string>("/liga*", "GET"));

                rotinasControladas.Add(3100, new KeyValuePair<string, string>("/participante-liga/participar", "POST"));
                rotinasControladas.Add(3101, new KeyValuePair<string, string>("/participante-liga/sair", "POST"));
                rotinasControladas.Add(3102, new KeyValuePair<string, string>("/participante-liga/adicionar", "POST"));
                rotinasControladas.Add(3103, new KeyValuePair<string, string>("/participante-liga/recusar-participacao", "POST"));
                rotinasControladas.Add(3104, new KeyValuePair<string, string>("/participante-liga/aceitar-participacao", "POST"));
                rotinasControladas.Add(3105, new KeyValuePair<string, string>("/participante-liga*;ligas-para-participacao*;jogadores-para-liga/*", "GET"));
                rotinasControladas.Add(3106, new KeyValuePair<string, string>("/participante-liga/remover", "POST"));

                rotinasControladas.Add(3310, new KeyValuePair<string, string>("/campeonato", "POST"));
                rotinasControladas.Add(3311, new KeyValuePair<string, string>("/campeonato", "PUT"));
                rotinasControladas.Add(3312, new KeyValuePair<string, string>("/campeonato*", "DELETE"));
                rotinasControladas.Add(3313, new KeyValuePair<string, string>("/campeonato*", "GET"));

                rotinasControladas.Add(3200, new KeyValuePair<string, string>("/participante-campeonato/participar", "POST"));
                rotinasControladas.Add(3201, new KeyValuePair<string, string>("/participante-campeonato/sair", "POST"));
                rotinasControladas.Add(3202, new KeyValuePair<string, string>("/participante-campeonato/adicionar", "POST"));
                rotinasControladas.Add(3203, new KeyValuePair<string, string>("/participante-campeonato/recusar-participacao", "POST"));
                rotinasControladas.Add(3204, new KeyValuePair<string, string>("/participante-campeonato/aceitar-participacao", "POST"));
                rotinasControladas.Add(3205, new KeyValuePair<string, string>("/participante-campeonato*;campeonatos-para-participacao*;jogadores-para-campeonato/*", "GET"));
                rotinasControladas.Add(3206, new KeyValuePair<string, string>("/participante-campeonato/remover", "POST"));
            }
            return rotinasControladas;
        }
    }
}