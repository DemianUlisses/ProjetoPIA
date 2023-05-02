namespace ojogodabolsa.Builders
{
    public static class NomeDePessoaBuilder
    {
        public static NomeDePessoa Build(string nome, string sobrenome)
        {
            var nomeCompleto = string.Format("{0} {1}", nome.Trim(), sobrenome.Trim());
            return Build(nomeCompleto);
        }

        public static NomeDePessoa Build(string nomeCompleto)
        {
            if (string.IsNullOrEmpty(nomeCompleto))
            {
                return null;
            }
            var nomes = nomeCompleto.Split(' ');
            var nome = nomes[0];
            var nomeDoMeio = string.Empty;
            for (var i = 1; i < nomes.Length - 1; i++)
            {
                nomeDoMeio = string.Concat(nomeDoMeio, nomes[i], " ");
            }
            nomeDoMeio = nomeDoMeio.Trim();
            var ultimoNome = nomes[nomes.Length - 1];
            var result = new NomeDePessoa()
            {
                PrimeiroNome = nome,
                NomeDoMeio = (string.IsNullOrEmpty(nomeDoMeio) ? null : nomeDoMeio),
                UltimoNome = ultimoNome,
            };
            return result;
        }
    }
}
