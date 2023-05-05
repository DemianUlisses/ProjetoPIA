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

namespace api.Controllers
{
    [Route("login/[action]")]
    public class LoginController : CustomController
    {
        public UsuarioRepository UsuarioRepository { get; set; }
        public Repository<Pessoa> PessoaRepository { get; set; }
        public static int RequestCount = 0;
        private EnvioDeEmail EnvioDeEmail;
        private Repository<RotinaDoSistema> RotinaDoSistemaRepository;
        private readonly IServiceProvider ServiceProvider;

        public LoginController(Mensagens mensagens, EnvioDeEmail envioDeEmail,
            Cfg cfg, UsuarioRepository usuarioRepository,
            Repository<RotinaDoSistema> rotinaDoSistemaRepository,
            IServiceProvider serviceProvider,
            Repository<Pessoa> pessoaRepository) : base(mensagens, cfg)
        {
            UsuarioRepository = usuarioRepository;
            PessoaRepository = pessoaRepository;
            EnvioDeEmail = envioDeEmail;
            RotinaDoSistemaRepository = rotinaDoSistemaRepository;
            ServiceProvider = serviceProvider;
        }

        [HttpPost]
        [ActionName("token")]
        public DadosDeLogin Token([FromBody] LoginRequest request)
        {
            request.NomeDeUsuario = !string.IsNullOrWhiteSpace(request.NomeDeUsuario) ?
                request.NomeDeUsuario.Contains("@") ? request.NomeDeUsuario.Trim().ToLower() : request.NomeDeUsuario.Trim() : "";
            RequestCount++;
            var valid = Cfg.AccessControl.ValidateCredentials(request.NomeDeUsuario, request.Senha);

            if (!valid)
            {
                throw new Exception("Usuário ou senha incorretos.");
            }

            var item = UsuarioRepository.GetUsuarioByLogin(request.NomeDeUsuario);

            //if (string.IsNullOrEmpty(item.Searchable))
            //{
            //    var type = typeof(ISearchableEntity);
            //    var types = typeof(Pessoa).Assembly.GetTypes()
            //        .Where(p => type.IsAssignableFrom(p))
            //        .Where(p => p.IsClass);
            //    types.ForEach(entityType =>
            //   {
            //       var genericRepository = typeof(Repository<>);
            //       Type[] typeArgs = { entityType };
            //       var repositoryType = genericRepository.MakeGenericType(typeArgs);
            //       var repository = ServiceProvider.GetService(repositoryType);
            //       var all = repository.GetType().GetMethod("GetAll").Invoke(repository, null) as IEnumerable<IEntity>;
            //       all.ForEach(entity =>
            //       {
            //           var a = new object[] { entity  };
            //           var update = repository.GetType().GetMethod("Update").Invoke(repository, a);
            //       });
            //   });
            //}

            var token = Cfg.AccessControl.GenerateToken(item.Id.ToString());
            var result = DadosDeLogin.FromModel(item, token);
            result.RotinasAcessiveis = item.TipoDeUsuario == ojogodabolsa.TipoDeUsuario.Master ?
                RotinaDoSistemaRepository.GetAll()
                .Select(i => new RotinaAcessivel()
                {
                    Id = i.Id,
                    Descricao = i.Descricao,
                })
                :
                item.Perfil.Acessos
                    .Select(i => new RotinaAcessivel()
                    {
                        Id = i.Rotina.Id,
                        Descricao = i.Rotina.Descricao,
                    });
            var pessoa = PessoaRepository.GetAll().Where(i => i.Usuario.Id == result.IdDoUsuario)
                .OrderByDescending(i => i.Id).ToArray().FirstOrDefault();

            if (pessoa != null)
            {
                result.IdDaPessoa = pessoa.Id;
                result.Foto = pessoa.Foto != null ? pessoa.Foto.Nome : null;
                result.PrimeiroNome = pessoa.Nome.PrimeiroNome;
                result.NomeDoMeio = pessoa.Nome.NomeDoMeio;
                result.UltimoNome = pessoa.Nome.UltimoNome;
                result.NomeCompleto = pessoa.NomeCompleto;
            }
            return result;
        }

        [HttpPost]
        [ActionName("refresh_token")]
        public string RefreshToken([FromBody] RefreshTokenRequest request)
        {
            if (string.IsNullOrEmpty(request.IdDoUsuario))
            {
                throw new Exception("Usuário não inválido.");
            }

            if (string.IsNullOrEmpty(request.Token))
            {
                throw new Exception("Token inválido.");
            }

            var valido = Cfg.AccessControl.IsValidToken(request.IdDoUsuario, request.Token);

            if (valido.Equals(TokenValidationStatus.InvalidUser))
            {
                throw new Exception("Token inválido.");
            }
            else if (valido.Equals(TokenValidationStatus.Expired))
            {
                throw new Exception("Token expirado.");
            }
            else if (!valido.Equals(TokenValidationStatus.Valid))
            {
                throw new Exception("Token inválido.");
            }

            var token = request.Token;
            valido = Cfg.AccessControl.RefreshToken(request.IdDoUsuario, ref token);

            if (!valido.Equals(TokenValidationStatus.Valid))
            {
                throw new Exception("Token inválido.");
            }

            return token;
        }


        [HttpPost]
        [ActionName("recover")]
        public bool RecoverPassword([FromBody] RecoverPasswordRequest request)
        {
            if (request.NomeDeUsuario == null)
            {
                throw new Exception("Usuário não encontrado.");
            }

            var usuario = UsuarioRepository.GetUsuarioByLogin(request.NomeDeUsuario);

            if (usuario == null)
            {
                throw new Exception("Usuário não encontrado.");
            }

            if (usuario.TipoDeUsuario == TipoDeUsuario.Jogador)
            {
                var pessoa = PessoaRepository.GetAll().Where(i => i.Usuario.Id == usuario.Id).FirstOrDefault();

                if (pessoa == null)
                {
                    throw new Exception("Usuário não encontrado.");
                }

                if (pessoa.Email == null)
                {
                    throw new Exception("E-mail não cadastrado.");
                }

                var senha = CreatePassword(6);

                usuario.Senha = senha;

                try
                {
                    EnvioDeEmail.EnviarAsync("Recuperação de senha", pessoa.Email,
                        $"Olá!<br/></br>Essa é sua nova senha: {senha}");
                }
                catch (Exception e)
                {
                    throw new Exception($"Não conseguimos completar o envio do e-mail. {e.Message}");
                }
                UsuarioRepository.Update(usuario, usuario);
            }
            else
            {
                throw new Exception("A recuperação de senha só está disponível para profissionais e jogadores.");
            }

            return true;
        }

        [HttpPost]
        [ActionName("pushtoken")]
        public bool PushToken([FromBody] SetPushTokenRequest pushToken)
        {
            var usuario = base.GetUsuario(UsuarioRepository);
            if (usuario != null)
            {
                usuario.PushToken = pushToken.Token;
                UsuarioRepository.Update(usuario);
            }
            return true;
        }

        [HttpPost]
        [ActionName("log")]
        public bool log([FromBody] LogRequest LogRequest)
        {
            Console.WriteLine(LogRequest.Texto);
            return true;
        }

        private string CreatePassword(int length)
        {
            var valid = "abcdefghijkmnpqrstuvwxyz123456789";
            var res = new System.Text.StringBuilder();
            var rnd = new Random();
            while (0 < length--)
            {
                res.Append(valid[rnd.Next(valid.Length)]);
            }
            return res.ToString();
        }
    }

    public class DadosDeLogin
    {
        public long IdDoUsuario { get; set; }
        public string Token { get; set; }
        public string NomeDeUsuario { get; set; }
        public Tipo<TipoDeUsuario> TipoDeUsuario { get; set; }
        public long IdDaPessoa { get; set; }
        public IEnumerable<RotinaAcessivel> RotinasAcessiveis { get; set; }
        public string PrimeiroNome { get; set; }
        public string NomeDoMeio { get; set; }
        public string UltimoNome { get; set; }
        public string NomeCompleto { get; set; }
        public bool EhJogadar { get { return this.TipoDeUsuario == ojogodabolsa.TipoDeUsuario.Operador; } }
        public string Foto { get; set; }
        public string PushToken { get; set; }

        public static DadosDeLogin FromModel(Usuario item, string token)
        {
            if (item == null)
            {
                return null;
            }

            var nome = NomeDePessoaBuilder.Build(item.Nome);
            var result = new DadosDeLogin()
            {
                IdDoUsuario = item.Id,
                Token = token,
                NomeDeUsuario = item.NomeDeUsuario,
                TipoDeUsuario = item.TipoDeUsuario,
                PrimeiroNome = nome.PrimeiroNome,
                NomeDoMeio = nome.NomeDoMeio,
                UltimoNome = nome.UltimoNome,
                NomeCompleto = item.Nome,
                PushToken = item.PushToken,
            };
            return result;
        }
    }

    public class LoginRequest
    {
        public string NomeDeUsuario { get; set; }
        public string Senha { get; set; }
    }

    public class SetPushTokenRequest
    {
        public string Token { get; set; }
    }

    public class RefreshTokenRequest
    {
        public string IdDoUsuario { get; set; }
        public string Token { get; set; }
    }

    public class RecoverPasswordRequest
    {
        public string NomeDeUsuario { get; set; }
    }

    public class RotinaAcessivel
    {
        public long Id { get; set; }
        public string Descricao { get; set; }
    }

    public class LogRequest
    {
        public string Texto { get; set; }
    }
}