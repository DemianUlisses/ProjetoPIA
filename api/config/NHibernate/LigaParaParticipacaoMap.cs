using FluentNHibernate.Mapping;
using System;
using System.Collections.Generic;
using System.Text;
using ojogodabolsa;
using data.Extensions;

namespace config.NHibernate
{
    public class LigaParaParticipacaoMap : ClassMap<LigaParaParticipacao>
    {
        public LigaParaParticipacaoMap()
        {
            Table("v_liga_para_participacao");
            Id(p => p.Id).Column("id");
            Map(p => p.Foto).Column("foto");
            Map(p => p.Nome).Column("nome");
            Map(p => p.Descricao).Column("descricao");
            Map(p => p.IdDoJogador).Column("id_jogador");
            Map(p => p.DataDaSituacao).Column("data_situacao");
            Map(p => p.NecessitaAutorizacao).Column("necessita_autorizacao");
            Map(p => p.Situacao).Column("situacao_participacao").CustomType<IntToTipoType<SituacaoDeParticipacaoEmLiga>>();
            ReadOnly();
            SchemaAction.None();
            Views.RegisterDropScript("drop view v_liga_para_participacao cascade;");
            Views.RegisterCreateScript(@"
create or replace 
  view v_liga_para_participacao 
as
select cadastro.id, 
       cadastro.nome, 
       cadastro.descricao, 
       cadastro.foto, 
       cadastro.id_jogador, 
       participante_de_liga.situacao situacao_participacao, 
       participante_de_liga.data_situacao,
       cadastro.necessita_autorizacao
from (
select liga.id,
       liga.nome,
       liga.descricao,
       liga.necessita_autorizacao,
       arquivo.nome foto, 
       jogador.id id_jogador
  from liga join arquivo on arquivo.id = liga.id_foto, 
       jogador 
 where liga.situacao = 1
  ) as cadastro 
  left join
       participante_de_liga
    on participante_de_liga.id_liga = cadastro.id
   and participante_de_liga.id_jogador = cadastro.id_jogador;");
        }
    }
}
