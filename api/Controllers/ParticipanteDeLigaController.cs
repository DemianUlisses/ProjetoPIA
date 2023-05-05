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
    [Route("participante-liga/[action]")]
    [Route("participante-liga")]
    public class ParticipanteDeLigaController : CustomController
    {
        private readonly UsuarioRepository UsuarioRepository;
        private readonly LigaRepository LigaRepository;
        private readonly ParticipanteDeLigaRepository ParticipanteDeLigaRepository;
        private readonly JogadorRepository JogadorRepository;
        private readonly Repository<LigaParaParticipacao> LigaParaParticipacaoRepository;
        private readonly Repository<JogadorParaLiga> JogadoresParaLigaRepository;


        public ParticipanteDeLigaController(
            Mensagens mensagens,
            Cfg cfg,
            LigaRepository ligaRepository,
            UsuarioRepository usuarioRepository,
            JogadorRepository jogadorRepository,
            ParticipanteDeLigaRepository participanteDeLigaRepository,
            Repository<LigaParaParticipacao> ligaParaParticipacaoRepository,
            Repository<JogadorParaLiga> jogadoresParaLigaRepository
            ) : base(mensagens, cfg)
        {
            LigaRepository = ligaRepository;
            UsuarioRepository = usuarioRepository;
            JogadorRepository = jogadorRepository;
            ParticipanteDeLigaRepository = participanteDeLigaRepository;
            LigaParaParticipacaoRepository = ligaParaParticipacaoRepository;
            JogadoresParaLigaRepository = jogadoresParaLigaRepository;
        }

        [ActionName("participar")]
        public bool Participar([FromBody] SolicitacaoDeParticipacaoEmLiga request)
        {
            var jogador = GetJogador();
            var liga = LigaRepository.Get(request.IdDaLiga, true);

            if (liga.LimiteDeParticipantes.HasValue && liga.LimiteDeParticipantes.Value > 0)
            {
                var participantes = ParticipanteDeLigaRepository.GetAll()
                    .Where(i => i.Situacao == SituacaoDeParticipacaoEmLiga.Solicitada ||
                     i.Situacao == SituacaoDeParticipacaoEmLiga.Participando)
                    .Count();
                if (participantes >= liga.LimiteDeParticipantes.Value)
                {
                    throw new Exception("Essa liga já atingiu o número máximo de participantes.");
                }
            }

            var item = ParticipanteDeLigaRepository.GetAll()
               .Where(i => i.Liga.Id == liga.Id)
               .Where(i => i.Jogador.Id == jogador.Id)
               .FirstOrDefault();

            if (item == null)
            {
                item = new ParticipanteDeLiga()
                {
                    Jogador = GetJogador(),
                    Liga = LigaRepository.Get(request.IdDaLiga, true),
                };
            }
            item.DataDaSituacao = DateTime.Now;
            item.Situacao = liga.NecessitaAutorizacao ? SituacaoDeParticipacaoEmLiga.Solicitada : SituacaoDeParticipacaoEmLiga.Participando;

            ParticipanteDeLigaRepository.Insert(item);
            return true;
        }

        [ActionName("sair")]
        public bool Sair([FromBody] SolicitacaoDeSairDaLiga request)
        {
            var jogador = GetJogador();
            var liga = LigaRepository.Get(request.IdDaLiga, true);
            var item = ParticipanteDeLigaRepository.GetAll()
                .Where(i => i.Liga.Id == liga.Id)
                .Where(i => i.Jogador.Id == jogador.Id)
                .FirstOrDefault();
            if (item != null)
            {
                item.Situacao = SituacaoDeParticipacaoEmLiga.Saiu;
                item.DataDaSituacao = DateTime.Now;
                ParticipanteDeLigaRepository.Update(item);
            }
            return true;
        }

        [ActionName("adicionar")]
        public bool Adicionar([FromBody] SolicitacaoDeInclusaoDeJogadorNaLiga request)
        {
            var jogador = JogadorRepository.Get(request.IdDoJogador, true);
            var liga = LigaRepository.Get(request.IdDaLiga, true);
            var item = ParticipanteDeLigaRepository.GetAll()
               .Where(i => i.Liga.Id == liga.Id)
               .Where(i => i.Jogador.Id == jogador.Id)
               .FirstOrDefault();
            if (item == null)
            {
                item = new ParticipanteDeLiga()
                {
                    Jogador = jogador,
                    Liga = liga
                };
            }
            item.DataDaSituacao = DateTime.Now;
            item.Situacao = SituacaoDeParticipacaoEmLiga.Participando;
            ParticipanteDeLigaRepository.Insert(item);
            return true;
        }

        [ActionName("aceitar-participacao")]
        public bool Aceitar([FromBody] SolicitacaoDeAceiteDeJogadorNaLiga request)
        {
            var liga = LigaRepository.Get(request.IdDaLiga, true);
            var jogador = JogadorRepository.Get(request.IdDoJogador, true);
            var item = ParticipanteDeLigaRepository.GetAll()
                .Where(i => i.Liga.Id == liga.Id)
                .Where(i => i.Jogador.Id == jogador.Id)
                .Where(i => i.Situacao == SituacaoDeParticipacaoEmLiga.Solicitada)
                .FirstOrDefault();
            if (item != null)
            {
                item.Situacao = SituacaoDeParticipacaoEmLiga.Participando;
                item.DataDaSituacao = DateTime.Now;
                ParticipanteDeLigaRepository.Update(item);
            }
            return true;
        }

        [ActionName("recusar-participacao")]
        public bool Recusar([FromBody] SolicitacaoDeRecusaDeJogadorNaLiga request)
        {
            var liga = LigaRepository.Get(request.IdDaLiga, true);
            var jogador = JogadorRepository.Get(request.IdDoJogador, true);
            var item = ParticipanteDeLigaRepository.GetAll()
                .Where(i => i.Liga.Id == liga.Id)
                .Where(i => i.Jogador.Id == jogador.Id)
                .Where(i => i.Situacao == SituacaoDeParticipacaoEmLiga.Solicitada)
                .FirstOrDefault();
            if (item != null)
            {
                item.Situacao = SituacaoDeParticipacaoEmLiga.SolicitacaoNegada;
                item.DataDaSituacao = DateTime.Now;
                ParticipanteDeLigaRepository.Update(item);
            }
            return true;
        }


        [ActionName("remover")]
        public bool Remover([FromBody] SolicitacaoDeRemocaoDeJogadorDaLiga request)
        {
            var liga = LigaRepository.Get(request.IdDaLiga, true);
            var jogador = JogadorRepository.Get(request.IdDoJogador, true);
            var item = ParticipanteDeLigaRepository.GetAll()
                .Where(i => i.Liga.Id == liga.Id)
                .Where(i => i.Jogador.Id == jogador.Id)
                .Where(i => i.Situacao == SituacaoDeParticipacaoEmLiga.Participando)
                .FirstOrDefault();
            if (item != null)
            {
                item.Situacao = SituacaoDeParticipacaoEmLiga.Removido;
                item.DataDaSituacao = DateTime.Now;
                ParticipanteDeLigaRepository.Update(item);
            }
            return true;
        }


        [HttpGet("{id}")]
        public ParticipanteDeLigaDto[] Get(long id)
        {
            var liga = LigaRepository.Get(id, true);

            var result = ParticipanteDeLigaRepository.GetAll()
                .Where(i => i.Liga.Id == liga.Id)
                .Select(i => ParticipanteDeLigaDto.Build(i))
                .ToArray();

            return result;
        }

        [ActionName("ligas-para-participacao")]
        [EnableQuery]
        public IQueryable<LigaParaParticipacao> GetLigasParaParticipacao()
        {
            var jogador = GetJogador();
            var result = LigaParaParticipacaoRepository.GetAll()
                .Where(i => i.IdDoJogador == jogador.Id);
            return result;
        }

        [ActionName("jogadores-para-liga/{id}")]
        [EnableQuery]
        public IQueryable<JogadorParaLiga> GetJogadoresPara([FromRoute] long id)
        {
            var liga = LigaRepository.Get(id, true);
            var result = JogadoresParaLigaRepository.GetAll()
                .Where(i => i.IdDaLiga == liga.Id);
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

    public class SolicitacaoDeParticipacaoEmLiga
    {
        public long IdDaLiga { get; set; }
    }

    public class SolicitacaoDeSairDaLiga
    {
        public long IdDaLiga { get; set; }
    }

    public class SolicitacaoDeInclusaoDeJogadorNaLiga
    {
        public long IdDaLiga { get; set; }
        public long IdDoJogador { get; set; }
    }

    public class SolicitacaoDeRecusaDeJogadorNaLiga
    {
        public long IdDaLiga { get; set; }
        public long IdDoJogador { get; set; }
    }

    public class SolicitacaoDeAceiteDeJogadorNaLiga
    {
        public long IdDaLiga { get; set; }
        public long IdDoJogador { get; set; }
    }

    public class SolicitacaoDeRemocaoDeJogadorDaLiga
    {
        public long IdDaLiga { get; set; }
        public long IdDoJogador { get; set; }
    }

    public class ParticipanteDeLigaDto
    {
        public LigaDto Liga { get; set; }
        public JogadorSimplesDto Jogador { get; set; }
        public Tipo<SituacaoDeParticipacaoEmLiga> Situacao { get; set; }
        public DateTime DataDaSituacao { get; set; }

        public static ParticipanteDeLigaDto Build(ParticipanteDeLiga item)
        {
            if (item == null)
            {
                return null;
            }
            var result = new ParticipanteDeLigaDto()
            {
                Liga = LigaDto.Build(item.Liga),
                Jogador = JogadorSimplesDto.Build(item.Jogador),
                Situacao = item.Situacao,
                DataDaSituacao = item.DataDaSituacao
            };
            return result;
        }
    }
}
