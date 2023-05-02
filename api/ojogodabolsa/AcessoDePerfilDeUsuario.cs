using data;
using System.Collections.Generic;

namespace ojogodabolsa
{
    public class AcessoDePerfilDeUsuario: IEntity
    {
        public long Id { get; set; }
        public RotinaDoSistema Rotina { get; set; }
        public PerfilDeUsuario PerfilDeUsuario { get; set; }
        public string NomeDaEntidade => "Acesso de perfil de usuário";
        public Genero GeneroDaEntidade => Genero.Masculino;
    }

    internal class AcessoDePerfilDeUsuarioEqualityComparer : IEqualityComparer<AcessoDePerfilDeUsuario>
    {
        public bool Equals(AcessoDePerfilDeUsuario x, AcessoDePerfilDeUsuario y)
        {
            return (x.PerfilDeUsuario.Id == y.PerfilDeUsuario.Id) && (x.Rotina.Id == y.Rotina.Id);
        }

        public int GetHashCode(AcessoDePerfilDeUsuario obj)
        {
            return obj.Rotina.Id.GetHashCode() | obj.PerfilDeUsuario.Id.GetHashCode();
        }
    }
    
}
