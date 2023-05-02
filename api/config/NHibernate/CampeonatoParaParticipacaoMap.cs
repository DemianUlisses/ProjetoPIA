using FluentNHibernate.Mapping;
using ojogodabolsa;

namespace config.NHibernate
{
    public class CampeonatoParaParticipacaoMap : ClassMap<CampeonatoParaParticipacao>
    {
        public CampeonatoParaParticipacaoMap()
        {
            Table("v_campeonato_para_participacao");
            Id(p => p.Id).Column("id");
            Map(p => p.Foto).Column("foto");
            Map(p => p.Nome).Column("nome");
            Map(p => p.Descricao).Column("descricao");
            Map(p => p.IdDoJogador).Column("id_jogador");
            Map(p => p.DataDaSituacao).Column("data_situacao");
            Map(p => p.NecessitaAutorizacao).Column("necessita_autorizacao");
            Map(p => p.Situacao).Column("situacao_participacao").CustomType<IntToTipoType<SituacaoDeParticipacaoEmCampeonato>>();
            Map(p => p.DataLimiteParaIngressoNoCampeonato).Column("data_limite_para_ingresso_no_campeonato").Not.Nullable();
            ReadOnly();
            SchemaAction.None();
            Views.RegisterDropScript("drop view v_campeonato_para_participacao cascade;");
            Views.RegisterCreateScript(@"
create or replace 
  view v_campeonato_para_participacao 
as
select cadastro.id, 
       cadastro.nome, 
       cadastro.descricao, 
       cadastro.foto, 
       cadastro.id_jogador, 
       participante_de_campeonato.situacao situacao_participacao, 
       participante_de_campeonato.data_situacao,
       cadastro.necessita_autorizacao,
       cadastro.data_limite_para_ingresso_no_campeonato
from (
select campeonato.id,
       campeonato.nome,
       campeonato.descricao,
       campeonato.necessita_autorizacao,
       arquivo.nome foto, 
       jogador.id id_jogador,
       campeonato.data_limite_para_ingresso_no_campeonato
  from campeonato join arquivo on arquivo.id = campeonato.id_foto, 
       jogador 
 where campeonato.situacao = 1
  ) as cadastro 
  left join
       participante_de_campeonato
    on participante_de_campeonato.id_campeonato = cadastro.id
   and participante_de_campeonato.id_jogador = cadastro.id_jogador;");
        }
    }
}
