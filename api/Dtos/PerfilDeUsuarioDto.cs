using ojogodabolsa;
using framework;
using System.Linq;

namespace api.Dtos
{
    public class PerfilDeUsuarioDto
    {
        public long Id { get; set; }
        public string Nome { get; set; }
        public Tipo<SituacaoDePerfilDeUsuario> Situacao { get; set; }
        public AcessoDePerfilDeUsuarioDto[] Acessos { get; set; }
        public bool PerfilPadraoParaCadastroDeJogador { get; set; }

        public static PerfilDeUsuarioDto Build(PerfilDeUsuario item)
        {
            var result = default(PerfilDeUsuarioDto);
            if (item != null)
            {
                result = new PerfilDeUsuarioDto()
                {
                    Id = item.Id,
                    Acessos = item.Acessos.Select(i => AcessoDePerfilDeUsuarioDto.Build(i)).ToArray(),
                    Nome = item.Nome,
                    PerfilPadraoParaCadastroDeJogador = item.PerfilPadraoParaCadastroDeJogador,
                    Situacao = item.Situacao

                };
            }
            return result;
        }
    }

    public class AcessoDePerfilDeUsuarioDto
    {
        public long Id { get; set; }
        public RotinaDoSistemaDto Rotina { get; set; }

        public static AcessoDePerfilDeUsuarioDto Build(AcessoDePerfilDeUsuario item)
        {
            var result = default(AcessoDePerfilDeUsuarioDto);
            if (item != null)
            {
                result = new AcessoDePerfilDeUsuarioDto()
                {
                    Id = item.Id,
                    Rotina = RotinaDoSistemaDto.Build(item.Rotina)                    
                };
            }
            return result;
        }
    }

    public class RotinaDoSistemaDto
    {
        public long Id { get; set; }
        public string Descricao { get; set; }

        public static RotinaDoSistemaDto Build(RotinaDoSistema item)
        {
            var result = default(RotinaDoSistemaDto);
            if (item != null)
            {
                result = new RotinaDoSistemaDto()
                {
                    Id = item.Id,
                    Descricao = item.Descricao
                };
            }
            return result;
        }
    }
}
