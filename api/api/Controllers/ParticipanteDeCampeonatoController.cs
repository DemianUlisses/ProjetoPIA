using framework;
using ojogodabolsa.Repositories;
using Microsoft.AspNetCore.Mvc;
using System;
using ojogodabolsa;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using ojogodabolsa.Builders;
using data;
using framework.Extensions;
using Microsoft.Extensions.DependencyInjection;
using api.Dtos;
using Microsoft.AspNet.OData;

namespace api.Controllers
{
    [ApiController]
    [Route("participante-campeonato/[action]")]
    [Route("participante-campeonato")]
    public class ParticipanteDeCampeonatoController : CustomController
    {
        private readonly UsuarioRepository UsuarioRepository;
        private readonly CampeonatoRepository CampeonatoRepository;
        private readonly ParticipanteDeCampeonatoRepository ParticipanteDeCampeonatoRepository;
        private readonly JogadorRepository JogadorRepository;
        private readonly Repository<CampeonatoParaParticipacao> CampeonatoParaParticipacaoRepository;
        private readonly Repository<JogadorParaCampeonato> JogadoresParaCampeonatoRepository;


        public ParticipanteDeCampeonatoController(
            Mensagens mensagens,
            Cfg cfg,
            UsuarioRepository usuarioRepository,
            CampeonatoRepository campeonatoRepository, 
            ParticipanteDeCampeonatoRepository participanteDeCampeonatoRepository,
            JogadorRepository jogadorRepository,
            Repository<CampeonatoParaParticipacao> campeonatoParaParticipacaoRepository,
            Repository<JogadorParaCampeonato> jogadoresParaCampeonatoRepository
            ) : base(mensagens, cfg)
        {
            UsuarioRepository = usuarioRepository;
            CampeonatoRepository = campeonatoRepository;
            CampeonatoRepository = campeonatoRepository;
            ParticipanteDeCampeonatoRepository = participanteDeCampeonatoRepository;
            JogadorRepository = jogadorRepository;
            CampeonatoParaParticipacaoRepository = campeonatoParaParticipacaoRepository;
            JogadoresParaCampeonatoRepository = jogadoresParaCampeonatoRepository;
        }

        [ActionName("participar")]
        public bool Participar([FromBody] SolicitacaoDeParticipacaoEmCampeonato request)
        {
            var jogador = GetJogador();
            var campeonato = CampeonatoRepository.Get(request.IdDaCampeonato, true);

            if (campeonato.QuantidadeDeParticipantes.HasValue && campeonato.QuantidadeDeParticipantes.Value > 0)
            {
                var participantes = ParticipanteDeCampeonatoRepository.GetAll()
                    .Where(i => i.Situacao == SituacaoDeParticipacaoEmCampeonato.Solicitada ||
                     i.Situacao == SituacaoDeParticipacaoEmCampeonato.Participando)
                    .Count();
                if (participantes >= campeonato.QuantidadeDeParticipantes.Value)
                {
                    throw new Exception("Essa campeonato já atingiu o número máximo de participantes.");
                }
            }

            if (DateTime.Now.Date > campeonato.DataLimiteParaIngressoNoCampeonato.Date)
            {
                throw new Exception("A data limite para ingressar nesse campeonato já passou.");
            }

            var item = ParticipanteDeCampeonatoRepository.GetAll()
               .Where(i => i.Campeonato.Id == campeonato.Id)
               .Where(i => i.Jogador.Id == jogador.Id)
               .FirstOrDefault();

            if (item == null)
            {
                item = new ParticipanteDeCampeonato()
                {
                    Jogador = GetJogador(),
                    Campeonato = CampeonatoRepository.Get(request.IdDaCampeonato, true),
                };
            }
            item.DataDaSituacao = DateTime.Now;
            item.Situacao = campeonato.NecessitaAutorizacao ? SituacaoDeParticipacaoEmCampeonato.Solicitada : SituacaoDeParticipacaoEmCampeonato.Participando;

            ParticipanteDeCampeonatoRepository.Insert(item);
            return true;
        }

        [ActionName("sair")]
        public bool Sair([FromBody] SolicitacaoDeSairDaCampeonato request)
        {
            var jogador = GetJogador();
            var campeonato = CampeonatoRepository.Get(request.IdDaCampeonato, true);
            var item = ParticipanteDeCampeonatoRepository.GetAll()
                .Where(i => i.Campeonato.Id == campeonato.Id)
                .Where(i => i.Jogador.Id == jogador.Id)
                .FirstOrDefault();
            if (item != null)
            {
                item.Situacao = SituacaoDeParticipacaoEmCampeonato.Saiu;
                item.DataDaSituacao = DateTime.Now;
                ParticipanteDeCampeonatoRepository.Update(item);
            }
            return true;
        }

        [ActionName("adicionar")]
        public bool Adicionar([FromBody] SolicitacaoDeInclusaoDeJogadorNaCampeonato request)
        {
            var jogador = JogadorRepository.Get(request.IdDoJogador, true);
            var campeonato = CampeonatoRepository.Get(request.IdDaCampeonato, true);
            var item = ParticipanteDeCampeonatoRepository.GetAll()
               .Where(i => i.Campeonato.Id == campeonato.Id)
               .Where(i => i.Jogador.Id == jogador.Id)
               .FirstOrDefault();
            if (item == null)
            {
                item = new ParticipanteDeCampeonato()
                {
                    Jogador = jogador,
                    Campeonato = campeonato
                };
            }
            item.DataDaSituacao = DateTime.Now;
            item.Situacao = SituacaoDeParticipacaoEmCampeonato.Participando;
            ParticipanteDeCampeonatoRepository.Insert(item);
            return true;
        }

        [ActionName("aceitar-participacao")]
        public bool Aceitar([FromBody] SolicitacaoDeAceiteDeJogadorNaCampeonato request)
        {
            var campeonato = CampeonatoRepository.Get(request.IdDaCampeonato, true);
            var jogador = JogadorRepository.Get(request.IdDoJogador, true);
            var item = ParticipanteDeCampeonatoRepository.GetAll()
                .Where(i => i.Campeonato.Id == campeonato.Id)
                .Where(i => i.Jogador.Id == jogador.Id)
                .Where(i => i.Situacao == SituacaoDeParticipacaoEmCampeonato.Solicitada)
                .FirstOrDefault();
            if (item != null)
            {
                item.Situacao = SituacaoDeParticipacaoEmCampeonato.Participando;
                item.DataDaSituacao = DateTime.Now;
                ParticipanteDeCampeonatoRepository.Update(item);
            }
            return true;
        }

        [ActionName("recusar-participacao")]
        public bool Recusar([FromBody] SolicitacaoDeRecusaDeJogadorNaCampeonato request)
        {
            var campeonato = CampeonatoRepository.Get(request.IdDaCampeonato, true);
            var jogador = JogadorRepository.Get(request.IdDoJogador, true);
            var item = ParticipanteDeCampeonatoRepository.GetAll()
                .Where(i => i.Campeonato.Id == campeonato.Id)
                .Where(i => i.Jogador.Id == jogador.Id)
                .Where(i => i.Situacao == SituacaoDeParticipacaoEmCampeonato.Solicitada)
                .FirstOrDefault();
            if (item != null)
            {
                item.Situacao = SituacaoDeParticipacaoEmCampeonato.SolicitacaoNegada;
                item.DataDaSituacao = DateTime.Now;
                ParticipanteDeCampeonatoRepository.Update(item);
            }
            return true;
        }


        [ActionName("remover")]
        public bool Remover([FromBody] SolicitacaoDeRemocaoDeJogadorDaCampeonato request)
        {
            var campeonato = CampeonatoRepository.Get(request.IdDaCampeonato, true);
            var jogador = JogadorRepository.Get(request.IdDoJogador, true);
            var item = ParticipanteDeCampeonatoRepository.GetAll()
                .Where(i => i.Campeonato.Id == campeonato.Id)
                .Where(i => i.Jogador.Id == jogador.Id)
                .Where(i => i.Situacao == SituacaoDeParticipacaoEmCampeonato.Participando)
                .FirstOrDefault();
            if (item != null)
            {
                item.Situacao = SituacaoDeParticipacaoEmCampeonato.Removido;
                item.DataDaSituacao = DateTime.Now;
                ParticipanteDeCampeonatoRepository.Update(item);
            }
            return true;
        }


        [HttpGet("{id}")]
        public ParticipanteDeCampeonatoDto[] Get(long id)
        {
            var campeonato = CampeonatoRepository.Get(id, true);

            var result = ParticipanteDeCampeonatoRepository.GetAll()
                .Where(i => i.Campeonato.Id == campeonato.Id)
                .Select(i => ParticipanteDeCampeonatoDto.Build(i))
                .ToArray();

            return result;
        }

        [ActionName("campeonatos-para-participacao")]
        [EnableQuery]
        public IQueryable<CampeonatoParaParticipacao> GetCampeonatosParaParticipacao()
        {
            var jogador = GetJogador();
            var result = CampeonatoParaParticipacaoRepository.GetAll()
                .Where(i => i.IdDoJogador == jogador.Id);
            return result;
        }

        [ActionName("jogadores-para-campeonato/{id}")]
        [EnableQuery]
        public IQueryable<JogadorParaCampeonato> GetJogadoresPara([FromRoute] long id)
        {
            var campeonato = CampeonatoRepository.Get(id, true);
            var result = JogadoresParaCampeonatoRepository.GetAll()
                .Where(i => i.IdDoCampeonato == campeonato.Id);
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
    }

    public class SolicitacaoDeParticipacaoEmCampeonato
    {
        public long IdDaCampeonato { get; set; }
    }

    public class SolicitacaoDeSairDaCampeonato
    {
        public long IdDaCampeonato { get; set; }
    }

    public class SolicitacaoDeInclusaoDeJogadorNaCampeonato
    {
        public long IdDaCampeonato { get; set; }
        public long IdDoJogador { get; set; }
    }

    public class SolicitacaoDeRecusaDeJogadorNaCampeonato
    {
        public long IdDaCampeonato { get; set; }
        public long IdDoJogador { get; set; }
    }

    public class SolicitacaoDeAceiteDeJogadorNaCampeonato
    {
        public long IdDaCampeonato { get; set; }
        public long IdDoJogador { get; set; }
    }

    public class SolicitacaoDeRemocaoDeJogadorDaCampeonato
    {
        public long IdDaCampeonato { get; set; }
        public long IdDoJogador { get; set; }
    }

    public class ParticipanteDeCampeonatoDto
    {
        public CampeonatoDto Campeonato { get; set; }
        public JogadorSimplesDto Jogador { get; set; }
        public Tipo<SituacaoDeParticipacaoEmCampeonato> Situacao { get; set; }
        public DateTime DataDaSituacao { get; set; }

        public static ParticipanteDeCampeonatoDto Build(ParticipanteDeCampeonato item)
        {
            if (item == null)
            {
                return null;
            }
            var result = new ParticipanteDeCampeonatoDto()
            {
                Campeonato = CampeonatoDto.Build(item.Campeonato),
                Jogador = JogadorSimplesDto.Build(item.Jogador),
                Situacao = item.Situacao,
                DataDaSituacao = item.DataDaSituacao
            };
            return result;
        }
    }
}
