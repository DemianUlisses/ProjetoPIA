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

namespace api.Controllers
{
    [ApiController]
    [Route("conta/[action]")]
    [Route("conta")]
    public class ContaController : CustomController
    {
        private readonly UsuarioRepository UsuarioRepository;
        private readonly Repository<Banco> BancoRepository;
        private readonly JogadorRepository JogadorRepository;

        public ContaController(Mensagens mensagens, EnvioDeEmail envioDeEmail,
            Cfg cfg, UsuarioRepository usuarioRepository,
            Repository<RotinaDoSistema> rotinaDoSistemaRepository,
            JogadorRepository jogadorRepository,
            Repository<Banco> bancoRepository,
            Repository<Pessoa> pessoaRepository) : base(mensagens, cfg)
        {
            UsuarioRepository = usuarioRepository;
            JogadorRepository = jogadorRepository;
            BancoRepository = bancoRepository;
        }

        [ActionName("combos")]
        public DadosParaDeAtualizacaoDeCadastro GetCombos()
        {
            var jogador = GetJogador();
            var result = new DadosParaDeAtualizacaoDeCadastro()
            {
                Jogador = JogadorSimplesComDadosBancariosDto.Build(jogador),
                Bancos = BancoRepository.GetAll().OrderBy(i => i.Nome).ToArray()
            };
            return result;
        }

        [HttpPut]
        public bool AtualizarCadastro([FromBody] SolicitacaoDeAtualizacaoDeCadastro request)
        {
            var usuario = base.GetUsuario(UsuarioRepository);
            if (usuario == null)
            {
                throw new Exception("Usuário não encontrado.");
            }

            var jogador = GetJogador();

            jogador.Cpf = string.IsNullOrWhiteSpace(request.Cpf) ? null : request.Cpf;
            jogador.NomeCompleto = request.NomeCompleto;
            jogador.Banco = request.Banco != null ? BancoRepository.Get(request.Banco, true) : null;
            jogador.AgenciaDaContaCorrente = request.AgenciaDaContaCorrente;
            jogador.NumeroDaContaCorrente = request.NumeroDaContaCorrente;
            jogador.DigitoDaContaCorrente = request.DigitoDaContaCorrente;
            jogador.TipoDeConta = request.TipoDeConta;
            jogador.Foto = request.Foto;

            JogadorRepository.Update(jogador);

            usuario.Nome = jogador.NomeCompleto;

            UsuarioRepository.Update(usuario, usuario);

            return true;
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

    public class SolicitacaoDeAtualizacaoDeCadastro
    {
        public string NomeCompleto { get; set; }
        public string Cpf { get; set; }
        public long? Banco { get; set; }
        public string AgenciaDaContaCorrente { get; set; }
        public string NumeroDaContaCorrente { get; set; }
        public string DigitoDaContaCorrente { get; set; }
        public Tipo<TipoDeContaBancaria> TipoDeConta { get; set; }
        public Arquivo Foto { get; set; }
    }

    public class DadosParaDeAtualizacaoDeCadastro
    {
        public Banco[] Bancos { get; set; }
        public JogadorSimplesComDadosBancariosDto Jogador { get; set; }
    }
}
