using ojogodabolsa;
using data.Extensions;
using FluentNHibernate.Mapping;

namespace config.NHibernate
{
    public class JogadorMap: SubclassMap<Jogador>
    {
        public JogadorMap()
        {
            Table("jogador");
            KeyColumn("id");
            References(p => p.Banco).Column("id_banco");
            Map(p => p.AgenciaDaContaCorrente).Column("agencia_cc").Length(10);
            Map(p => p.NumeroDaContaCorrente).Column("numero_cc").Length(10);
            Map(p => p.DigitoDaContaCorrente).Column("dv_cc").Length(1);
            Map(p => p.ChavePix).Column("chave_pix").Length(200);            
            Map(p => p.TipoDeConta).Column("tp_cc").CustomType<IntToTipoType<TipoDeContaBancaria>>().Default("0")
              .Check(Enum<TipoDeContaBancaria>.GetDatabaseCheckConstraint("tp_cc"));

            Map(p => p.ReceberEmailsDeAberturaDosJogos).Column("receber_email_de_abertura_dos_jogos")
                .Default("true").Not.Nullable();
            Map(p => p.ReceberEmailsDeFechamentoDosJogos).Column("receber_email_de_fechamento_dos_jogos")
                .Default("true").Not.Nullable();
        }
    }
}
