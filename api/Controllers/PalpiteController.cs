using ojogodabolsa;
using data;
using Microsoft.AspNetCore.Mvc;
using ojogodabolsa.Repositories;
using System;
using System.Linq;
using api.Dtos;
using Microsoft.AspNet.OData;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using framework.Extensions;

namespace api.Controllers
{
    [Route("palpite")]
    [Route("palpite/[action]")]
    public class PalpiteController : CustomController
    {
        private readonly PalpiteRepository PalpiteRepository;
        private readonly UsuarioRepository UsuarioRepository;
        private readonly JogadorRepository JogadorRepository;
        private readonly SemanaRepository SemanaRepository;
        private readonly Repository<Ganhador> AcaoRepository;
        private readonly EnvioDeEmail EnvioDeEmail;
        private readonly ParticipanteDeLigaRepository ParticipanteDeLigaRepository;
        private readonly Repository<PalpiteDeLiga> PalpiteDeLigaRepository;
        private readonly Repository<PalpiteDeCampeonato> PalpiteDeCampeonatoRepository;
        private readonly ParticipanteDeCampeonatoRepository ParticipanteDeCampeonatoRepository;

        public PalpiteController(
            PalpiteRepository palpiteRepository,
            UsuarioRepository usuarioRepository,
            JogadorRepository jogadorRepository,
            SemanaRepository semanaRepository,
            EnvioDeEmail envioDeEmail,
            Repository<Ganhador> acaoRepository,
            ParticipanteDeLigaRepository participanteDeLigaRepository,
            Repository<PalpiteDeLiga> palpiteDeLigaRepository,
            Repository<PalpiteDeCampeonato> palpiteDeCampeonatoRepository,
            ParticipanteDeCampeonatoRepository participanteDeCampeonatoRepository,
        Mensagens mensagens, Cfg cfg) : base(mensagens, cfg)
        {
            PalpiteRepository = palpiteRepository;
            UsuarioRepository = usuarioRepository;
            JogadorRepository = jogadorRepository;
            SemanaRepository = semanaRepository;
            AcaoRepository = acaoRepository;
            EnvioDeEmail = envioDeEmail;
            ParticipanteDeLigaRepository = participanteDeLigaRepository;
            PalpiteDeLigaRepository = palpiteDeLigaRepository;
            PalpiteDeCampeonatoRepository = palpiteDeCampeonatoRepository;
            ParticipanteDeCampeonatoRepository = participanteDeCampeonatoRepository;
        }

        [HttpGet]
        [ActionName("combos")]
        public CombosParaCadastroDePalpite GetCombos()
        {
            var jogador = GetJogador();
            var semana = SemanaRepository.GetSemanaAtiva();
            if (semana == null)
            {
                throw new Exception("Ainda não fizemos a abertura da semana. Tente novamente mais tarde.");
            }
            var result = new CombosParaCadastroDePalpite()
            {
                SemanaAtiva = SemanaDto.Build(semana, semana),
                PalpiteNaSemanaAtiva = PalpiteDto.Build(PalpiteRepository.GetAll()
                    .Where(i => i.Jogador.Id == jogador.Id)
                    .Where(i => i.Semana.Id == semana.Id)
                    .FirstOrDefault()),
                Semanas = SemanaRepository.GetAll().OrderBy(i => i.Ano).ThenBy(i => i.Numero)
                    .Select(i => SemanaDto.Build(i, semana))
                    .ToArray()
            };
            return result;
        }

        [ActionName("semana-ativa")]
        public SemanaDto GetSemanaAtiva()
        {
            var result = SemanaDto.Build(SemanaRepository.GetSemanaAtiva());
            return result;
        }

        protected virtual Jogador GetJogador()
        {
            var usuario = GetUsuario(UsuarioRepository);
            if (usuario.TipoDeUsuario.IsNot(TipoDeUsuario.Jogador))
            {
                throw new Exception("Tipo de usuário inválido para realizar novos palpites.");
            }

            var jogador = JogadorRepository.GetAll()
                .Where(i => i.Usuario.Id == usuario.Id)
                .FirstOrDefault();

            if (jogador == null)
            {
                throw new Exception("Não foi possível identificar um jogador vinculado ao seu usuário.");
            }
            return jogador;
        }

        [HttpGet]
        [ActionName("palpite-aleatorio")]
        public PalpiteAleatorioDto GetPalpiteAleatorio()
        {
            var acoes = AcaoRepository.GetAll().PickRandom(6).ToArray();

            var result = new PalpiteAleatorioDto()
            {
                Acao1 = AcaoDto.Build(acoes[0]),
                Acao2 = AcaoDto.Build(acoes[1]),
                Acao3 = AcaoDto.Build(acoes[2]),
                Acao4 = AcaoDto.Build(acoes[3]),
                Acao5 = AcaoDto.Build(acoes[4]),
                PiorAcao = AcaoDto.Build(acoes[5]),
            };

            return result;
        }

        [HttpGet]
        [ActionName("palpite-anterior/{semana}")]
        public PalpiteDto GetPalpiteAnterior([FromRoute] long semana)
        {
            var jogador = GetJogador();

            var semanaAnterior = SemanaRepository.Get(semana, true);

            var result = PalpiteDto.Build(PalpiteRepository.GetAll()
                .Where(i => i.Jogador.Id == jogador.Id)
                .Where(i => (i.Semana.Ano < semanaAnterior.Ano) ||
                    ((i.Semana.Ano == semanaAnterior.Ano) && (i.Semana.Numero < semanaAnterior.Numero)))
                .OrderByDescending(i => i.Semana.Ano)
                .ThenByDescending(i => i.Semana.Numero)
                .FirstOrDefault());

            return result;
        }

        [HttpGet]
        [ActionName("resultado/semana/{semana}/liga/{liga}/campeonato/{campeonato}")]
        public PalpiteDto[] GetRelatorio([FromRoute] long? semana, [FromRoute] long? liga, [FromRoute] long? campeonato)
        {
            var usuario = GetUsuario(UsuarioRepository);

            if (!(usuario.TipoDeUsuario.Is(TipoDeUsuario.Operador) || usuario.TipoDeUsuario.Is(TipoDeUsuario.Master)))
            {
                throw new Exception("Tipo de usuário inválido para consultar relatório de palpites.");
            }

            IEnumerable<Palpite> palpites = null;

            palpites = PalpiteRepository.GetAll()
                .OrderBy(i => i.Jogador.NomeCompleto);

            if (semana.HasValue)
            {
                palpites = palpites
                    .Join(SemanaRepository.GetAll().Where(i => i.Id == semana),
                    i => i.Semana.Id,
                    i => i.Id,
                    (i, j) => new { i, j })
                    .Select(i => i.i);
            }

            if (liga.HasValue)
            {
                palpites = palpites
                    .Join(PalpiteDeLigaRepository.GetAll().Where(i => i.Liga.Id == liga),
                    i => i.Id,
                    i => i.Palpite.Id,
                    (i, j) => new { i, j })
                    .Select(i => i.i);
            }

            if (campeonato.HasValue)
            {
                palpites = palpites
                    .Join(PalpiteDeCampeonatoRepository.GetAll().Where(i => i.Campeonato.Id == campeonato),
                    i => i.Id,
                    i => i.Palpite.Id,
                    (i, j) => new { i, j })
                    .Select(i => i.i);
            }

            var result = palpites.Select(i => PalpiteDto.Build(i)).ToArray();
            return result;
        }

        [HttpPost]
        public virtual PalpiteDto InseirPalpite([FromBody] SolicitacaoDePaplite request)
        {
            var jogador = GetJogador();

            var semana = SemanaRepository.Get(request.IdDaSemana, true);

            if (PalpiteRepository.GetAll()
                    .Where(i => i.Jogador.Id == jogador.Id)
                    .Where(i => i.Semana.Id == semana.Id)
                    .Any())
            {
                throw new Exception("Você já enviou o seu palpite para essa semana.");
            }

            var semanaAtiva = GetSemanaAtiva();
            if (semanaAtiva == null)
            {
                throw new Exception("Nenhuma semana ativa.");
            }

            if (semanaAtiva.Id != semana.Id)
            {
                throw new Exception($"Não é mais possível realizar palpites nessa semana, a semana atual é a{semanaAtiva.Numero.ToString()}.");
            }

            var acao1 = AcaoRepository.Get(request.IdDaAcao1);
            var acao2 = AcaoRepository.Get(request.IdDaAcao2);
            var acao3 = AcaoRepository.Get(request.IdDaAcao3);
            var acao4 = AcaoRepository.Get(request.IdDaAcao4);
            var acao5 = AcaoRepository.Get(request.IdDaAcao5);
            var piorAcao = AcaoRepository.Get(request.IdDaPiorAcao);

            var palpite = new Palpite()
            {
                Semana = semana,
                Jogador = jogador,
                Acao1 = acao1,
                Acao2 = acao2,
                Acao3 = acao3,
                Acao4 = acao4,
                Acao5 = acao5,
                PiorAcao = piorAcao,
                DataDeInclusao = DateTime.Now
            };

            PalpiteRepository.Insert(palpite);

            ParticipanteDeLigaRepository.GetAll()
                .Where(i => i.Jogador.Id == palpite.Jogador.Id)
                .Where(i => i.Situacao == SituacaoDeParticipacaoEmLiga.Participando)
                .ForEach(i =>
                {
                    PalpiteDeLigaRepository.Insert(new PalpiteDeLiga()
                    {
                        Palpite = palpite,
                        Liga = i.Liga
                    });
                });

            ParticipanteDeCampeonatoRepository.GetAll()
                .Where(i => i.Jogador.Id == palpite.Jogador.Id)
                .Where(i => i.Situacao == SituacaoDeParticipacaoEmCampeonato.Participando)
                .ForEach(i =>
                {
                    PalpiteDeCampeonatoRepository.Insert(new PalpiteDeCampeonato()
                    {
                        Palpite = palpite,
                        Campeonato = i.Campeonato
                    });
                });

            EnvioDeEmail.EnviarAsync("Seu palpite foi recebido!", jogador.Email,
                string.Format(@"<b>Recebemos seu palpite!</b><br/><br/>
{0}<br/><br/>

Ações que mais irão valorizar:<br/><br/>
1º lugar: {1}<br/>
2º lugar: {2}<br/>
3º lugar: {3}<br/>
4º lugar: {4}<br/>
5º lugar: {5}<br/><br/>

Ação que mais irá desvalorizar:<br/><br/>
{6}<br/><br/>
Boa sorte!",
                palpite.Semana.Nome,
                palpite.Acao1.Nome,
                palpite.Acao2.Nome,
                palpite.Acao3.Nome,
                palpite.Acao4.Nome,
                palpite.Acao5.Nome,
                palpite.PiorAcao.Nome
            ));

            return PalpiteDto.Build(palpite);
        }

        [HttpPut]
        public virtual PalpiteDto AlterarPalpite([FromBody] SolicitacaoDeAlteracaoDePaplite request)
        {
            var usuario = GetUsuario(UsuarioRepository);
            if (usuario.TipoDeUsuario.IsNot(TipoDeUsuario.Jogador))
            {
                throw new Exception("Tipo de usuário inválido para realizar novos palpites.");
            }

            var jogador = JogadorRepository.GetAll()
                .Where(i => i.Usuario.Id == usuario.Id)
                .FirstOrDefault();

            if (jogador == null)
            {
                throw new Exception("Não foi possível identificar um jogador vinculado ao seu usuário.");
            }

            var palpite = PalpiteRepository.Get(request.Id, true);

            palpite.Acao1 = AcaoRepository.Get(request.IdDaAcao1);
            palpite.Acao2 = AcaoRepository.Get(request.IdDaAcao2);
            palpite.Acao3 = AcaoRepository.Get(request.IdDaAcao3);
            palpite.Acao4 = AcaoRepository.Get(request.IdDaAcao4);
            palpite.Acao5 = AcaoRepository.Get(request.IdDaAcao5);
            palpite.PiorAcao = AcaoRepository.Get(request.IdDaPiorAcao);

            PalpiteRepository.Update(palpite);

            EnvioDeEmail.EnviarAsync("Seu palpite foi alterado!", jogador.Email,
                string.Format(@"<b>Recebemos a alteração do seu palpite!</b><br/><br/>
{0}<br/><br/>

Ações que mais irão valorizar:<br/><br/>
1º lugar: {1}<br/>
2º lugar: {2}<br/>
3º lugar: {3}<br/>
4º lugar: {4}<br/>
5º lugar: {5}<br/><br/>

Ação que mais irá desvalorizar:<br/><br/>
{6}<br/><br/>
Boa sorte!",
                palpite.Semana.Nome,
                palpite.Acao1.Nome,
                palpite.Acao2.Nome,
                palpite.Acao3.Nome,
                palpite.Acao4.Nome,
                palpite.Acao5.Nome,
                palpite.PiorAcao.Nome
            ));

            return PalpiteDto.Build(palpite);
        }

        [HttpGet("{semana}")]
        [EnableQuery]
        public virtual PalpiteDto Get([FromRoute] long semana)
        {
            var usuario = GetUsuario(UsuarioRepository);
            if (usuario.TipoDeUsuario.IsNot(TipoDeUsuario.Jogador))
            {
                throw new Exception("Tipo de usuário inválido para realizar novos palpites.");
            }

            var jogador = JogadorRepository.GetAll()
                .Where(i => i.Usuario.Id == usuario.Id)
                .FirstOrDefault();

            if (jogador == null)
            {
                throw new Exception("Não foi possível identificar um jogador vinculado ao seu usuário.");
            }

            var result = PalpiteDto.Build(PalpiteRepository.GetAll()
                .Where(i => i.Jogador.Id == jogador.Id)
                .Where(i => i.Semana.Id == semana)
                .FirstOrDefault());

            return result;
        }

    }

    public class PalpiteDto
    {
        public long Id { get; set; }
        public SemanaDto Semana { get; set; }
        public JogadorSimplesDto Jogador { get; set; }
        public AcaoDto Acao1 { get; set; }
        public AcaoDto Acao2 { get; set; }
        public AcaoDto Acao3 { get; set; }
        public AcaoDto Acao4 { get; set; }
        public AcaoDto Acao5 { get; set; }
        public AcaoDto PiorAcao { get; set; }

        public static PalpiteDto Build(Palpite item)
        {
            if (item == null)
            {
                return null;
            }
            var result = new PalpiteDto()
            {
                Id = item.Id,
                Jogador = JogadorSimplesDto.Build(item.Jogador),
                Semana = SemanaDto.Build(item.Semana),
                Acao1 = AcaoDto.Build(item.Acao1),
                Acao2 = AcaoDto.Build(item.Acao2),
                Acao3 = AcaoDto.Build(item.Acao3),
                Acao4 = AcaoDto.Build(item.Acao4),
                Acao5 = AcaoDto.Build(item.Acao5),
                PiorAcao = AcaoDto.Build(item.PiorAcao),
            };
            return result;
        }
    }

    public class SolicitacaoDePaplite
    {
        public long IdDaSemana { get; set; }
        public long IdDaAcao1 { get; set; }
        public long IdDaAcao2 { get; set; }
        public long IdDaAcao3 { get; set; }
        public long IdDaAcao4 { get; set; }
        public long IdDaAcao5 { get; set; }
        public long IdDaPiorAcao { get; set; }
    }

    public class SolicitacaoDeAlteracaoDePaplite
    {
        public long Id { get; set; }
        public long IdDaAcao1 { get; set; }
        public long IdDaAcao2 { get; set; }
        public long IdDaAcao3 { get; set; }
        public long IdDaAcao4 { get; set; }
        public long IdDaAcao5 { get; set; }
        public long IdDaPiorAcao { get; set; }
    }

    public class AcaoDto
    {
        public long Id { get; set; }
        public string Nome { get; set; }

        internal static AcaoDto Build(Ganhador item)
        {
            if (item == null)
            {
                return null;
            }
            var result = new AcaoDto()
            {
                Id = item.Id,
                Nome = item.Nome
            };
            return result;
        }
    }

    public class SemanaDto
    {
        public long Id { get; set; }
        public int Ano { get; set; }
        public int Numero { get; set; }
        public string Nome { get; set; }
        public string Descricao { get; set; }
        public DateTime DataIncialDaApuracao { get; set; }
        public DateTime DataFinalDaApuracao { get; set; }
        public string HoraDeAberturaDosJogos { get; set; }
        public string HoraDeFechamentoDosJogos { get; set; }
        public bool SemanaJaPassou { get; set; }
        public bool SemanaAindaNaoFoiAberta { get; set; }
        public DateTime DataDeAberturaDosJogos { get; set; }
        public DateTime DataDeFechamentoDosJogos { get; set; }

        public static SemanaDto Build(Semana item)
        {
            if (item == null)
            {
                return null;
            }
            var result = new SemanaDto()
            {
                Id = item.Id,
                Ano = item.Ano,
                Numero = item.Numero,
                Nome = item.Nome,
                Descricao = item.Descricao,
                DataIncialDaApuracao = item.DataIncialDaApuracao,
                DataFinalDaApuracao = item.DataFinalDaApuracao,
                DataDeAberturaDosJogos = item.DataDeAberturaDosJogos,
                DataDeFechamentoDosJogos = item.DataDeFechamentoDosJogos,
                HoraDeAberturaDosJogos = item.HoraDeAberturaDosJogos.ToHoraString(),
                HoraDeFechamentoDosJogos = item.HoraDeFechamentoDosJogos.ToHoraString(),
                SemanaAindaNaoFoiAberta = item.DataDeAberturaDosJogos.Add(item.HoraDeAberturaDosJogos) > DateTime.Now
            };
            return result;
        }

        public static SemanaDto Build(Semana item, Semana semanaAtiva)
        {
            var result = Build(item);
            result.SemanaJaPassou = (item.Ano < semanaAtiva.Ano) ||
                ((item.Ano == semanaAtiva.Ano) && (item.Numero < semanaAtiva.Numero));
            return result;
        }
    }

    public class CombosParaCadastroDePalpite
    {
        public SemanaDto SemanaAtiva { get; set; }
        public PalpiteDto PalpiteNaSemanaAtiva { get; set; }
        public SemanaDto[] Semanas { get; set; }
    }

    public class PalpiteAleatorioDto
    {
        public AcaoDto Acao1 { get; set; }
        public AcaoDto Acao2 { get; set; }
        public AcaoDto Acao3 { get; set; }
        public AcaoDto Acao4 { get; set; }
        public AcaoDto Acao5 { get; set; }
        public AcaoDto PiorAcao { get; set; }
    }


    public static class EnumerableExtension
    {
        public static T PickRandom<T>(this IEnumerable<T> source)
        {
            return source.PickRandom(1).Single();
        }

        public static IEnumerable<T> PickRandom<T>(this IEnumerable<T> source, int count)
        {
            return source.Shuffle().Take(count);
        }

        public static IEnumerable<T> Shuffle<T>(this IEnumerable<T> source)
        {
            return source.OrderBy(x => Guid.NewGuid());
        }
    }
}