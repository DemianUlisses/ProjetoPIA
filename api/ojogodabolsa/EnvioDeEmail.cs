using ojogodabolsa.Repositories;
using System;
using System.Collections.Generic;
using System.Net.Mail;
using System.Text;
using System.Threading.Tasks;

namespace ojogodabolsa
{
    public class EnvioDeEmail
    {
        private ParametrosRepository ParametrosRepository;

        public string Servidor { get; set; }
        public string Usuario { get; set; }
        public string Senha { get; set; }
        public int? Porta { get; set; }
        public string EmailRemetente { get; set; }
        public string NomeDoRemetente { get; set; }
        public bool UsarSsl { get; set; }

        public EnvioDeEmail(ParametrosRepository parametrosRepository)
        {
            ParametrosRepository = parametrosRepository;
            Servidor = ParametrosRepository.GetString("ServidorSmtp");
            Usuario = ParametrosRepository.GetString("UsuarioDoServidorSmtp");
            Senha = ParametrosRepository.GetString("SenhaDoServidorSmtp");
            Porta = ParametrosRepository.GetInt("PortaSmtp");
            EmailRemetente = ParametrosRepository.GetString("EmailRemetente");
            NomeDoRemetente = ParametrosRepository.GetString("NomeDoRemetente");
            UsarSsl = ParametrosRepository.GetBoolean("UsarSslNoServidorSmtp");
        }

        public virtual void Enviar(string assunto, string destinatario, string mensagem)
        {
            var client = new SmtpClient(Servidor, Porta.Value);
            client.UseDefaultCredentials = false;
            client.EnableSsl = UsarSsl;
            client.Credentials = new System.Net.NetworkCredential(!string.IsNullOrEmpty(Usuario) ? Usuario : EmailRemetente, Senha);
            client.Timeout = 20000;
            var from = new MailAddress(
                EmailRemetente,
                NomeDoRemetente,
                System.Text.Encoding.UTF8
            );

            var to = new MailAddress(destinatario);

            using (var message = new MailMessage(from, to))
            {
                message.IsBodyHtml = true;
                message.Body = mensagem;
                message.BodyEncoding = System.Text.Encoding.UTF8;
                message.Subject = assunto;
                message.SubjectEncoding = System.Text.Encoding.UTF8;
                try
                {
                    client.Send(message);
                }
                catch (Exception e)
                {
                    Console.WriteLine(e.ToString());
                }
            }
        }

        public void EnviarAsync(string assunto, string destinatario, string mensagem)
        {
            Task.Run(() =>
            {
                this.Enviar(assunto, destinatario, mensagem);
            });
        }
    }
}
