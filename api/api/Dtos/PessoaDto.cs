namespace api.Dtos
{
    public class PessoaDto
    {
        public long Id { get; set; }
        public NomeDePessoaDto Nome { get; set; }
    }

    public class NomeDePessoaDto
    {
        public string PrimeiroNome { get; set; }
        public string NomeDoMeio { get; set; }
        public string UltimoNome { get; set; }
        public string NomeCompleto { get; set; }
    }

    public static class PessoaExtensions
    {
        public static NomeDePessoaDto Build(this ojogodabolsa.NomeDePessoa item)
        {
            var result = new NomeDePessoaDto
            {
                PrimeiroNome = item.PrimeiroNome,
                NomeCompleto = item.PrimeiroNome
            };

            if (!string.IsNullOrEmpty(item.NomeDoMeio))
            {
                result.NomeDoMeio = item.NomeDoMeio;
                result.NomeCompleto += " " + item.NomeDoMeio;
            }

            if (!string.IsNullOrEmpty(item.UltimoNome))
            {
                result.UltimoNome = item.UltimoNome;
                result.NomeCompleto += " " + item.UltimoNome;
            }

            return result;
        }
    }
}