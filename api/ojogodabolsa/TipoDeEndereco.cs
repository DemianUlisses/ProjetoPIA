using System.ComponentModel;

namespace ojogodabolsa
{
    public enum TipoDeEndereco
    {
        [Description("Não inormado")]
        NaoInformado = 0,

        [Description("Residencial")]
        Residencial = 1,

        [Description("Comercial")]
        Comercial = 2,
    }
}