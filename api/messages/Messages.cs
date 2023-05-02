using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace messages
{
    public enum Message
    {
        UsuarioNaoIdentificado,
        TelefoneNaoEncontrado,
        EnderecoNaoEncontrado,
        PessoaNaoEncontrada
    }

    public interface IMessageControl
    {
        string GetMessage(Message message, params object[] args);
    }

    public class MessagesPtBr : IMessageControl
    {
        public string GetMessage(Message message, params object[] args)
        {
            var result = string.Empty;
            //TODO: Mudar para Dictionary
            switch (message)
            {
                case Message.UsuarioNaoIdentificado: { result = "Usuário não identificado"; break; }

                default: { result = Enum.GetName(typeof(Message), message); break; }
            }
            return result;
        }
    }
}
