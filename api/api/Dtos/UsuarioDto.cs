using ojogodabolsa;
using framework;
using System.Linq;

namespace api.Dtos
{
    public class UsuarioDto
    {
        public long Id { get; set; }
        public string Nome { get; set; }
        public string NomeDeUsuario { get; set; }
        public string Senha { get; set; }
        public Tipo<TipoDeUsuario> TipoDeUsuario { get; set; }
        public PerfilDeUsuarioDto Perfil { get; set; }
        public Tipo<SituacaoDeUsuario> Situacao { get; set; }
        public string PushToken { get; set; }
        public string Searchable { get; set; }

        public static UsuarioDto Build(Usuario item)
        {
            var result = default(UsuarioDto);
            if (item != null)
            {
                result = new UsuarioDto()
                {
                    Id = item.Id,
                    Nome = item.Nome,
                    NomeDeUsuario = item.NomeDeUsuario,
                    Perfil = PerfilDeUsuarioDto.Build(item.Perfil),
                    PushToken = null,
                    Senha = null,
                    Situacao = item.Situacao,
                    TipoDeUsuario = item.TipoDeUsuario,
                    Searchable = item.Searchable
                };
            }
            return result;
        }
    }

    public class UsuarioSimplesDto
    {
        public long Id { get; set; }
        public string Nome { get; set; }
        public string NomeDeUsuario { get; set; }

        public static UsuarioSimplesDto Build(Usuario item)
        {
            var result = default(UsuarioSimplesDto);
            if (item != null)
            {
                result = new UsuarioSimplesDto()
                {
                    Id = item.Id,
                    Nome = item.Nome,
                    NomeDeUsuario = item.NomeDeUsuario,                    
                };
            }
            return result;
        }
    }
}
