using framework;
using messages;

namespace api
{
    public class Cfg
    {
        public AccessControl AccessControl { get; set; }
        public long? IdDoUsuario { get; set; }
        public IMessageControl MessageControl { get; set; }
        public static string DiretorioParaArmazenamentoDeArquivos { get; set; }
        public static string Url { get; set; }

        public Cfg(AccessControl accessControl, IMessageControl messageControl)
        {
            AccessControl = accessControl;
            MessageControl = messageControl;
        }
    }
}
