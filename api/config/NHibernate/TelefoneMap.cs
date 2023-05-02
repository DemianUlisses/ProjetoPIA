using ojogodabolsa;
using data.Extensions;
using FluentNHibernate.Mapping;

namespace config.NHibernate
{
    public class TelefoneMap : ClassMap<TelefoneDePessoa>
    {
        public TelefoneMap()
        {
            Table("telefone");
            Id(p => p.Id).Column("id").GeneratedBy.Identity();
            Map(p => p.Pais).Column("pais").Not.Nullable().Length(3);
            Map(p => p.DDD).Column("ddd").Not.Nullable().Length(3);
            Map(p => p.Numero).Column("numero").Not.Nullable().Length(10);
            Map(p => p.TemWhatsApp).Column("tem_whatsapp").Default("false");
            Map(p => p.Tipo).Column("tipo").CustomType<IntToTipoType<TipoDeTelefone>>().Not.Nullable()
                .Check(Enum<TipoDeTelefone>.GetDatabaseCheckConstraint("tipo"));
            References(p => p.Pessoa).Column("id_pessoa").Not.Nullable();
        }
    }
}
