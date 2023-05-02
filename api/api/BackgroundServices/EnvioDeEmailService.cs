using framework.Extensions;
using ojogodabolsa;
using ojogodabolsa.Repositories;
using System;
using System.Globalization;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace api.BackgroundServices
{
    internal class EnvioDeEmailService
    {
        private readonly ParametrosRepository ParametrosRepository;
        private readonly JogadorRepository JogadorRepository;
        private readonly PalpiteRepository PalpiteRepository;
        private readonly SemanaRepository SemanaRepository;
        private readonly EnvioDeEmail EnvioDeEmail;

        public EnvioDeEmailService(
            ParametrosRepository parametrosRepository,
            JogadorRepository jogadorRepository,
            PalpiteRepository palpiteRepository,
            SemanaRepository semanaRepository,
            EnvioDeEmail envioDeEmail
        )
        {
            ParametrosRepository = parametrosRepository;
            JogadorRepository = jogadorRepository;
            PalpiteRepository = palpiteRepository;
            SemanaRepository = semanaRepository;
            EnvioDeEmail = envioDeEmail;
        }

        public async Task DoWork(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                await Task.Delay(5000);
                EnviarEmails();
            }
            await Task.CompletedTask;
        }

        protected virtual void EnviarEmails()
        {
            SafeExecute(() => EnviarEmailDeAberturaDosJogos());
            SafeExecute(() => EnviarEmailDeFechametoDosJogos());
        }

        protected virtual void EnviarEmailDeAberturaDosJogos()
        {
            var template = ParametrosRepository.GetEmailDeAberturaDosJogos();
            if (!string.IsNullOrEmpty(template))
            {
                var semana = SemanaRepository.GetSemanaAtiva();
                if (semana != null && !semana.EmailDeAberturaEnviado)
                {
                    var jogadores = JogadorRepository.GetAll()
                        .Where(i => i.ReceberEmailsDeAberturaDosJogos)
                        .ToArray();
                    jogadores.ForEach(jogador =>
                    {
                        var mensagem = jogador.ProcessarTemplate(template);
                        mensagem = semana.ProcessarTemplate(mensagem);
                        EnvioDeEmail.EnviarAsync("Abertura dos jogos", jogador.Email, mensagem);
                    });
                    semana.EmailDeAberturaEnviado = true;
                    SemanaRepository.Update(semana);
                }
            }
        }

        protected virtual void EnviarEmailDeFechametoDosJogos()
        {
            var template = ParametrosRepository.GetEmailDeFechamentoDosJogos();
            if (!string.IsNullOrEmpty(template))
            {
                var semana = SemanaRepository.GetAll()
                    .Where(i => !i.EmailDeFechamentoEnviado)
                    .Where(i => i.DataDeFechamentoDosJogos <= DateTime.Now.Date)
                    .Where(i => i.HoraDeFechamentoDosJogos <= DateTime.Now.TimeOfDay)
                    .OrderByDescending(i => i.Ano)
                    .ThenByDescending(i => i.Numero)
                    .FirstOrDefault();
                if (semana != null)
                {

                    var palpitesNaSemanaAtiva = PalpiteRepository.GetAll()
                        .Where(i => i.Jogador.ReceberEmailsDeFechamentoDosJogos)
                        .Where(i => i.Semana.Id == semana.Id);
                    palpitesNaSemanaAtiva.ForEach(palpite =>
                    {
                        var mensagem = palpite.Jogador.ProcessarTemplate(template);
                        mensagem = semana.ProcessarTemplate(mensagem);
                        mensagem = palpite.ProcessarTemplate(mensagem);
                        EnvioDeEmail.EnviarAsync("Fechamento dos jogos", palpite.Jogador.Email, mensagem);
                    });
                    semana.EmailDeFechamentoEnviado = true;
                    SemanaRepository.Update(semana);
                }
            }
        }

        private void SafeExecute(Action action)
        {
            try
            {
                action();
            }
            catch (Exception e)
            {
                Console.WriteLine(e.Message);
            }
        }

    }
}
