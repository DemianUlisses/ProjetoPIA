using FluentNHibernate.Mapping;
using System;
using System.Collections.Generic;
using System.Text;
using ojogodabolsa;
using data.Extensions;

namespace config.NHibernate
{
    public class JogadorParaLigaMap: ClassMap<JogadorParaLiga>
    {
        public JogadorParaLigaMap()
        {
            Table("v_jogador_para_liga");
            Id(p => p.Id).Column("id");
            Map(p => p.Nome).Column("nome_completo");
            Map(p => p.Email).Column("email");
            Map(p => p.IdDaLiga).Column("id_liga");
            Map(p => p.DataDaSituacao).Column("data_situacao");
            Map(p => p.Situacao).Column("situacao_participacao").CustomType<IntToTipoType<SituacaoDeParticipacaoEmLiga>>();
            ReadOnly();
            SchemaAction.None();
            Views.RegisterCreateScript(@"
create or replace
   view v_jogador_para_liga
as
select cadastro.id, 
       cadastro.email, 
       cadastro.nome_completo, 
       cadastro.id_liga, 
       participante_de_liga.situacao situacao_participacao, 
       participante_de_liga.data_situacao
from (
select jogador.id,
       pessoa.email, 
       pessoa.nome_completo, 
       liga.id id_liga
  from jogador join pessoa on pessoa.id = jogador.id, 
       liga  
  ) as cadastro 
  left join
       participante_de_liga
    on participante_de_liga.id_jogador = cadastro.id
   and participante_de_liga.id_liga = cadastro.id_liga;");
        }
    }
}
