using data;
using messages;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace ojogodabolsa.Repositories
{
    public class ParametrosRepository : Repository<Parametro>
    {
        public ParametrosRepository(IUnitOfWork<Parametro> unitOfWork, IMessageControl messageControl) 
            : base(unitOfWork, messageControl)
        {
        }

        protected virtual object GetValue(string nome)
        {
            var result = GetAll()
                .Where(i => i.Nome == nome)
                .FirstOrDefault();
            return result != null ? result.Valor : null;
        }

        public virtual string GetString(string nome)
        {
            var result = default(string);
            var value = GetValue(nome);
            if (value != null)
            {
                result = value.ToString();
            }
            return result;
        }

        public virtual int? GetInt(string nome)
        {
            var result = default(int?);
            var value = GetValue(nome);
            if (value != null)
            {
                if (int.TryParse(value.ToString(), out int resultInt))
                {
                    result = resultInt;
                }
            }
            return result;
        }

        public virtual long? GetLong(string nome)
        {
            var result = default(long?);
            var value = GetValue(nome);
            if (value != null)
            {
                if (long.TryParse(value.ToString(), out long resultInt))
                {
                    result = resultInt;
                }
            }
            return result;
        }

        public virtual bool GetBoolean(string nome)
        {
            var valores = new string[] { "sim", "1", "true", "t", "y" };
            var result = default(bool);
            var value = GetValue(nome);
            if (value != null)
            {
                result = valores.Contains(value.ToString().ToLower());
            }
            return result;
        }

        public virtual string GetEmailDeBoasVindas()
        {
            var result = GetString("Emails.BoasVindas");
            return result;
        }

        public virtual string GetEmailDeAberturaDosJogos()
        {
            var result = GetString("Emails.EmailDeAberturaDosJogos");
            return result;
        }

        public virtual string GetEmailDeFechamentoDosJogos()
        {
            var result = GetString("Emails.EmailDeFechamentoDosJogos");
            return result;
        }

        public virtual string GetEmailDeSolicitacaoDeDadosBancariosParaGanhador()
        {
            var result = GetString("Emails.EmailDeSolicitacaoDeDadosBancariosParaGanhador");
            return result;
        }
    }
}
