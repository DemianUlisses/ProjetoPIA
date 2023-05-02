using FluentNHibernate.Mapping;
using ojogodabolsa;

namespace config.NHibernate
{
    public class JogadorParaCampeonatoMap: ClassMap<JogadorParaCampeonato>
    {
        public JogadorParaCampeonatoMap()
        {
            Table("v_jogador_para_campeonato");
            Id(p => p.Id).Column("id");
            Map(p => p.Nome).Column("nome_completo");
            Map(p => p.Email).Column("email");
            Map(p => p.IdDoCampeonato).Column("id_campeonato");
            Map(p => p.DataDaSituacao).Column("data_situacao");
            Map(p => p.Situacao).Column("situacao_participacao").CustomType<IntToTipoType<SituacaoDeParticipacaoEmCampeonato>>();
            ReadOnly();
            SchemaAction.None();
            Views.RegisterCreateScript(@"
create or replace
   view v_jogador_para_campeonato
as
select cadastro.id, 
       cadastro.email, 
       cadastro.nome_completo, 
       cadastro.id_campeonato, 
       participante_de_campeonato.situacao situacao_participacao, 
       participante_de_campeonato.data_situacao
from (
select jogador.id,
       pessoa.email, 
       pessoa.nome_completo, 
       campeonato.id id_campeonato
  from jogador join pessoa on pessoa.id = jogador.id, 
       campeonato  
  ) as cadastro 
  left join
       participante_de_campeonato
    on participante_de_campeonato.id_jogador = cadastro.id
   and participante_de_campeonato.id_campeonato = cadastro.id_campeonato;");
        }
    }
}
