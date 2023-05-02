using api.Dtos;
using ojogodabolsa;
using ojogodabolsa.Builders;
using ojogodabolsa.Repositories;
using data;
using Microsoft.AspNet.OData;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using framework.Validators;

namespace api.Controllers
{
    [Route("jogador/[action]")]
    [Route("jogador")]
    public class JogadorController : CustomController<Jogador>
    {
        private readonly UsuarioRepository UsuarioRepository;
        private readonly Repository<Cidade> CidadeRepository;
        private readonly Repository<Arquivo> ArquivoRepository;
        private readonly JogadorRepository JogadorRepository;
        private readonly Repository<RotinaDoSistema> RotinaDoSistemaRepository;
        private readonly PerfilDeUsuarioRepository PerfilDeUsuarioRepository;
        private readonly Repository<Banco> BancoRepository;
        private readonly ParametrosRepository ParametrosRepository;
        private readonly EnvioDeEmail EnvioDeEmail;

        public JogadorController(JogadorRepository repository,
            UsuarioRepository usuarioRepository,
            Repository<Cidade> cidadeRepository,
            Repository<Arquivo> arquivoRepository,
            JogadorRepository jogadorRepository,
            Repository<RotinaDoSistema> rotinaDoSistemaRepository,
            PerfilDeUsuarioRepository perfilDeUsuarioRepository,
            Repository<Banco> bancoRepository,
            ParametrosRepository parametrosRepository,
            EnvioDeEmail envioDeEmail,
            Mensagens mensagens, Cfg cfg) :
            base(repository, mensagens, cfg)
        {
            UsuarioRepository = usuarioRepository;
            CidadeRepository = cidadeRepository;
            JogadorRepository = jogadorRepository;
            ArquivoRepository = arquivoRepository;
            RotinaDoSistemaRepository = rotinaDoSistemaRepository;
            PerfilDeUsuarioRepository = perfilDeUsuarioRepository;
            BancoRepository = bancoRepository;
            ParametrosRepository = parametrosRepository;
            EnvioDeEmail = envioDeEmail;
        }

        [ActionName("combousuarios")]
        public IQueryable<Usuario> GetComboUsuarios(Usuario usuario)
        {
            var result = UsuarioRepository.GetAll()
                .Where(i => i.TipoDeUsuario == TipoDeUsuario.Jogador)
                .OrderBy(i => i.NomeDeUsuario);
            return result;
        }

        [ActionName("combosparacadastro")]
        public CombosParaCadastroDeJogador GetCombosParaCadastro()
        {
            var usuario = GetUsuario(UsuarioRepository);
            var result = new CombosParaCadastroDeJogador()
            {
                Usuarios = GetComboUsuarios(usuario)
                    .Select(i => UsuarioSimplesDto.Build(i)),
                Bancos = BancoRepository.GetAll().OrderBy(i => i.Nome).ToArray()
            };
            return result;
        }

        [ActionName("combocidades")]
        [EnableQuery]
        public IQueryable<Cidade> GetCidades()
        {
            return CidadeRepository.GetAll()
                .OrderBy(i => i.Nome);
        }

        [ActionName("cadastroweb")]
        public bool CadastrarJogadorMobile([FromBody] SolicitacaoDeCadastroJogadorMobile request)
        {
            request.Validar();

            var perfil = PerfilDeUsuarioRepository.GetAll()
                .Where(i => i.PerfilPadraoParaCadastroDeJogador)
                .OrderBy(i => i.Id)
                .ToArray()
                .LastOrDefault();

            if (perfil == null)
            {
                throw new Exception("O perfil padrão para novos jogadores não foi definido.");
            }

            var usuario = new Usuario()
            {
                Nome = request.Nome.Trim(),
                NomeDeUsuario = request.Email.ToLower().Trim(),
                Senha = request.Senha,
                Situacao = SituacaoDeUsuario.Ativo,
                TipoDeUsuario = TipoDeUsuario.Jogador,
                Perfil = perfil
            };
            UsuarioRepository.Insert(usuario, null);

            var jogador = new Jogador()
            {
                Usuario = usuario,
                Nome = NomeDePessoaBuilder.Build(request.Nome),
                NomeCompleto = request.Nome,
                Email = request.Email,
                Sexo = Sexo.NaoInformado,
                TipoDePessoa = TipoDePessoa.NaoInformado,
            };


            if (!TelefoneCelularValidator.IsValid(request.Celular))
            {
                throw new Exception("O número de telefone inválido.");
            }

            var celular = new Telefone(request.Celular);

            var telefone = new TelefoneDePessoa()
            {
                DDD = celular.DDD,
                Numero = celular.Numero,
                TemWhatsApp = celular.TemWhatsApp,
            };

            jogador.Telefones = new TelefoneDePessoa[]
            {
                telefone
            };

            JogadorRepository.Insert(jogador);

            var mensagem = ParametrosRepository.GetEmailDeBoasVindas();

            if (string.IsNullOrEmpty(mensagem))
            {
                mensagem = $"Olá [Apelido]!<br/><br/>Seja bem vindo ao Jogo da Bolsa!";
            }

            mensagem = jogador.ProcessarTemplate(mensagem);
            EnvioDeEmail.EnviarAsync("Seja bem vindo ao Jogo da Bolsa!", jogador.Email, mensagem);
            return true;
        }

        [ActionName("alterardadosmobile")]
        public DadosDeLogin AlterarDadosDeJogadorMobile(SolicitacaoDeAlteracaoDeDadosDeJogadorMobile request)
        {
            request.Validar();
            var usuario = base.GetUsuario(UsuarioRepository);
            var jogador = JogadorRepository.Get(request.Id);
            if (usuario.Id != jogador.Usuario.Id)
            {
                throw new Exception("Acesso negado.");
            }

            if (request.AlterarSenha)
            {
                var usuarioValido = UsuarioRepository.GetUsuarioByLoginESenha(usuario.NomeDeUsuario, request.SenhaAtual);
                if (usuarioValido == null)
                {
                    throw new Exception("A senha atual está errada.");
                }
                usuario.Senha = request.NovaSenha;
            }

            if (!string.IsNullOrWhiteSpace(request.NomeCompleto))
            {
                var nome = NomeDePessoaBuilder.Build(request.NomeCompleto);
                jogador.Nome = nome;
                usuario.Nome = jogador.NomeCompleto;
                UsuarioRepository.Update(usuario);
            }

            if (request.IdDaFoto.HasValue)
            {
                jogador.Foto = ArquivoRepository.Get(request.IdDaFoto.Value);
            }
            else
            {
                jogador.Foto = null;
            }

            JogadorRepository.Update(jogador);

            var token = Cfg.AccessControl.GenerateToken(usuario.Id.ToString());
            var result = DadosDeLogin.FromModel(usuario, token);
            result.RotinasAcessiveis = usuario.TipoDeUsuario == ojogodabolsa.TipoDeUsuario.Master ?
                RotinaDoSistemaRepository.GetAll()
                .Select(i => new RotinaAcessivel()
                {
                    Id = i.Id,
                    Descricao = i.Descricao,
                })
                :
                usuario.Perfil.Acessos
                    .Select(i => new RotinaAcessivel()
                    {
                        Id = i.Rotina.Id,
                        Descricao = i.Rotina.Descricao,
                    });
            result.IdDaPessoa = jogador.Id;
            result.Foto = jogador.Foto != null ? jogador.Foto.Nome : null;
            result.PrimeiroNome = jogador.Nome.PrimeiroNome;
            result.NomeDoMeio = jogador.Nome.NomeDoMeio;
            result.UltimoNome = jogador.Nome.UltimoNome;
            result.NomeCompleto = jogador.NomeCompleto;

            return result;
        }

        [ActionName("porusuario")]
        public virtual Jogador GetPorUsuario(long id)
        {
            var result = base.Repository.GetAll()
                .Where(i => i.Usuario.Id == id)
                .FirstOrDefault();
            return result;
        }

        protected override void AntesDeInserir(Jogador item)
        {
            item.Nome = ojogodabolsa.Builders.NomeDePessoaBuilder.Build(item.NomeCompleto);
            if ((item.Usuario != null) && (!string.IsNullOrEmpty(item.Usuario.Senha)) && (!string.IsNullOrEmpty(item.Email)))
            {
                var perfil = PerfilDeUsuarioRepository.GetAll()
                    .Where(i => i.PerfilPadraoParaCadastroDeJogador)
                    .OrderBy(i => i.Id)
                    .ToArray()
                    .LastOrDefault();

                if (perfil == null)
                {
                    throw new Exception("O perfil padrão para novos jogadores não foi definido.");
                }

                Usuario usuario = UsuarioRepository.GetUsuarioByLogin(item.Email.ToLower().Trim());
                if (usuario != null)
                {
                    usuario.Senha = item.Usuario.Senha;
                    UsuarioRepository.Update(usuario, null);
                    item.Usuario = usuario;
                }
                else
                {
                    usuario = new Usuario()
                    {
                        Nome = item.NomeCompleto.Trim(),
                        NomeDeUsuario = item.Email.ToLower().Trim(),
                        Senha = item.Usuario.Senha,
                        Situacao = SituacaoDeUsuario.Ativo,
                        TipoDeUsuario = TipoDeUsuario.Jogador,
                        Perfil = perfil
                    };
                    UsuarioRepository.Insert(usuario, null);
                    item.Usuario = usuario;
                }
            }
            else
            {
                item.Usuario = null;
            }
        }

        protected override void AntesDeAlterar(Jogador item)
        {
            item.Nome = ojogodabolsa.Builders.NomeDePessoaBuilder.Build(item.NomeCompleto);
            if ((item.Usuario != null) && (!string.IsNullOrEmpty(item.Usuario.Senha)) && (!string.IsNullOrEmpty(item.Email)))
            {
                var perfil = PerfilDeUsuarioRepository.GetAll()
                    .Where(i => i.PerfilPadraoParaCadastroDeJogador)
                    .OrderBy(i => i.Id)
                    .ToArray()
                    .LastOrDefault();

                if (perfil == null)
                {
                    throw new Exception("O perfil de usuário padrão para novos jogadores não foi definido.");
                }

                Usuario usuario = UsuarioRepository.GetUsuarioByLogin(item.Email.ToLower().Trim());
                if (usuario != null)
                {
                    usuario.Senha = item.Usuario.Senha;
                    UsuarioRepository.Update(usuario, usuario);
                    item.Usuario = usuario;
                }
                else
                {
                    usuario = new Usuario()
                    {
                        Nome = item.NomeCompleto.Trim(),
                        NomeDeUsuario = item.Email.ToLower().Trim(),
                        Senha = item.Usuario.Senha,
                        Situacao = SituacaoDeUsuario.Ativo,
                        TipoDeUsuario = TipoDeUsuario.Jogador,
                        Perfil = perfil
                    };
                    UsuarioRepository.Insert(usuario, null);
                    item.Usuario = usuario;
                }
            }
            else
            {
                item.Usuario = null;
            }
        }
    }

    public class SolicitacaoDeCadastroJogadorMobile
    {
        public string Nome { get; set; }
        public string Email { get; set; }
        public string Senha { get; set; }
        public string Celular { get; set; }

        public virtual void Validar()
        {
            if (string.IsNullOrWhiteSpace(Nome))
            {
                throw new Exception("Informe seu nome.");
            }

            if (string.IsNullOrWhiteSpace(Email))
            {
                throw new Exception("Informe seu e-mail.");
            }

            if (string.IsNullOrWhiteSpace(Senha))
            {
                throw new Exception("Informe uma senha.");
            }
        }
    }

    public class SolicitacaoDeAlteracaoDeDadosDeJogadorMobile
    {
        public long Id { get; set; }
        public string NomeCompleto { get; set; }
        public long? IdDaFoto { get; set; }
        public bool AlterarSenha { get; set; }
        public string SenhaAtual { get; set; }
        public string NovaSenha { get; set; }

        internal void Validar()
        {

        }
    }

    public class CombosParaCadastroDeJogador
    {
        public IEnumerable<UsuarioSimplesDto> Usuarios { get; set; }
        public Banco[] Bancos { get; set; }
    }
}