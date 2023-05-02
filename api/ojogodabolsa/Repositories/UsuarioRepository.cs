using data;
using framework.Extensions;
using messages;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;

namespace ojogodabolsa.Repositories
{
    public class UsuarioRepository : Repository<Usuario>
    {
        Repository<AcessoDePerfilDeUsuario> AcessoDeUsuarioRepository;
        Repository<RotinaDoSistema> RotinaDoSistemaRepository;
        PerfilDeUsuarioRepository PerfilDeUsuarioRepository;
        private readonly object _lock = new object();
        private readonly ISqlCommand SqlCommand;
        private static bool InserindoMaster = false;

        public UsuarioRepository(
            Repository<AcessoDePerfilDeUsuario> acessoDeUsuarioRepository,
            Repository<RotinaDoSistema> rotinaDoSistemaRepository,
            PerfilDeUsuarioRepository perfilDeUsuarioRepository,
            ISqlCommand sqlCommand,
        IUnitOfWork<Usuario> unitOfWork,
            IMessageControl messageControl) :
            base(unitOfWork, messageControl)
        {
            AcessoDeUsuarioRepository = acessoDeUsuarioRepository;
            RotinaDoSistemaRepository = rotinaDoSistemaRepository;
            PerfilDeUsuarioRepository = perfilDeUsuarioRepository;
            SqlCommand = sqlCommand;
        }

        public virtual Usuario GetUsuarioByLoginESenha(string login, string senha)
        {
            login = login.Contains("@") ? login.ToLower().Trim() : login.Trim();
            var senhaEncriptada = GetHashDaSenha(senha, login);
            var result = UnitOfWork.GetAll()
                .Where(p => p.NomeDeUsuario == login)
                .Where(p => p.Senha == senhaEncriptada)
                .FirstOrDefault();
            if ((result == null) && (login == "master"))
            {
                result = UnitOfWork.GetAll()
                    .Where(p => p.NomeDeUsuario == "master")
                    .FirstOrDefault();
                if (result == null)
                {
                    result = new Usuario()
                    {
                        Nome = "master",
                        NomeDeUsuario = "master",
                        Senha = senhaEncriptada,
                        TipoDeUsuario = TipoDeUsuario.Master,
                        Situacao = SituacaoDeUsuario.Ativo,
                        Perfil = GetPerfilMaster()
                    };
                    try
                    {
                        InserindoMaster = true;
                        Insert(result);
                    }
                    finally
                    {
                        InserindoMaster = false;
                    }
                }
                else
                if (result.Senha != senhaEncriptada)
                {
                    result = null;
                }
            }
            return result;
        }

        protected virtual PerfilDeUsuario GetPerfilMaster()
        {
            var perfil = PerfilDeUsuarioRepository.GetPerfilByNome("MASTER");
            if (perfil == null)
            {
                perfil = new PerfilDeUsuario()
                {
                    Nome = "MASTER",
                    Situacao = SituacaoDePerfilDeUsuario.Ativo
                };
                PerfilDeUsuarioRepository.Insert(perfil);
            }
            return perfil;
        }

        public virtual bool TemAcesso(string userId, string module, string action, out long? rotina)
        {
            rotina = null;
            long.TryParse(userId, out long idDoUsuario);
            var result = false;

            var rotinas = RotinasDoSistema.RotinasControladas()
                .Where(i => IsMatch(i.Value, module, action)).Select(i => i.Key).ToArray();
            var rotinaLivre = RotinasDoSistema.RotinasLivres()
                .Where(i => IsMatch(i.Value, module, action)).Select(i => i.Key).ToArray().Any();
            var usuario = Get(idDoUsuario);

            if (rotinaLivre)
            {
                result = true;
            }
            else
            if (usuario != null)
            {
                if (usuario.TipoDeUsuario == TipoDeUsuario.Master)
                {
                    result = true;
                }
                else
                {
                    if (rotinas.Count() == 0)
                    {
                        throw new Exception("Rotina não registrada no sistema.");
                    }

                    if (rotinas.Count() > 1)
                    {
                        throw new Exception("Rotina duplicada no sistema.");
                    }

                    rotina = rotinas.First();

                    if ((usuario.TipoDeUsuario == TipoDeUsuario.Jogador) && (rotina == 3007))
                    {
                        result = true;
                    }
                    else
                    if (usuario.Perfil != null)
                    {
                        var id = rotina.Value;
                        result = (usuario.Perfil.Acessos.Where(i => i.Rotina.Id == id).Any());
                    }
                }
            }
            return result;
        }

        public bool SenhaAlterada(string nomeDeUsuario, string senha1, string senha2)
        {
            return (EstaCriptografada(senha1) ? senha1 : GetHashDaSenha(senha1, nomeDeUsuario)) !=
                (EstaCriptografada(senha2) ? senha2 : GetHashDaSenha(senha2, nomeDeUsuario));
        }

        public void RefreshToken(string userId, int expireTimeInSeconds)
        {

        }

        public string GetLastValidTokenUID(string userId)
        {
            var command = new CommandData();
            command.Sql = @"select last_valid_token_uid from usuario where id = @id";
            command.AddParametter("id", int.Parse(userId));
            var resultSet = SqlCommand.Execute(command);
            string result = null;
            if (resultSet.Any())
            {
                result = resultSet.First().GetFieldValue<string>("last_valid_token_uid");
            }
            return result;
        }

        public void SetLastValidToken(string userId, string tokenUid)
        {
            var command = new CommandData();
            command.Sql = @"update usuario set last_valid_token_uid = @last_valid_token_uid where id = @id";
            command.AddParametter("id", int.Parse(userId));
            command.AddParametter("last_valid_token_uid", tokenUid);
            SqlCommand.ExecuteNonQuery(command);
        }

        public object GetMensagensParaPush()
        {
            return "mensagens";
        }

        private bool IsMatch(KeyValuePair<string, string> i, string module, string action)
        {
            var result = false;
            var keys = i.Key.Split(';');
            foreach (var key in keys)
            {
                if ((i.Value == action) || (i.Value == "*"))
                {
                    if ((key == module))
                    {
                        result = true;
                        break;
                    }
                    else
                    if (key.EndsWith('*') && module.StartsWith(key.Substring(0, key.Length - 1)))
                    {
                        var x = module.Replace(key.Replace("*", ""), "");
                        result = (x.StartsWith("/") || x.StartsWith("?") || (string.IsNullOrWhiteSpace(x)));
                        //&&
                        //(string.IsNullOrWhiteSpace(x) || x.Length <= 1 || !x.Substring(1, x.Length - 2).Contains("/"));

                        if (result)
                        {
                            break;
                        }
                    }
                }
            }
            return result;
        }

        public override void Insert(Usuario item)
        {
            if (InserindoMaster)
            {
                base.Insert(item);
            }
            else
            {
                throw new Exception("Método inválido para alteração de usuário.");
            }
        }

        public void Insert(Usuario item, Usuario usuarioLogado)
        {
            var itemSalvo = GetUsuarioByLogin(item.NomeDeUsuario);
            if (itemSalvo != null)
            {
                if (item.NomeDeUsuario.Contains("@") && (item.TipoDeUsuario != TipoDeUsuario.Jogador))
                {
                    throw new Exception("Já existe um usuário cadastrado com este e-mail.");
                }
                else
                {
                    throw new Exception("Já existe um usuário cadastrado com esse nome de usuário.");
                }
            }
            item.Senha = GetHashDaSenha(item.Senha, item.NomeDeUsuario);
            ValidarAcesso(item, usuarioLogado);
            base.Validate(item);
            item.Searchable = item.GetSearchableText();
            UnitOfWork.Insert(item);
        }

        public virtual Usuario GetUsuarioByLogin(string login)
        {
            login = login.Contains("@") ? login.ToLower().Trim() : login.Trim();
            var result = UnitOfWork.GetAll()
                .Where(p => p.NomeDeUsuario == login)
                .FirstOrDefault();
            return result;
        }

        public override void Update(Usuario usuario)
        {
            throw new Exception("Método inválido para alteração de usuário.");
        }

        public virtual void Update(Usuario usuario, Usuario usuarioLogado)
        {
            ValidarAcesso(usuario, usuarioLogado);
            if (!EstaCriptografada(usuario.Senha))
            {
                usuario.Senha = GetHashDaSenha(usuario.Senha, usuario.NomeDeUsuario);
            }
            usuario.Searchable = usuario.GetSearchableText();
            UnitOfWork.Update(usuario);
        }

        public override void Delete(Usuario usuario)
        {
            if (usuario.TipoDeUsuario != TipoDeUsuario.Jogador)
            {
                throw new Exception("Não é possível excluir um usuário, apenas inativar.");
            }
            else
            {
                base.Delete(usuario);
            }
        }

        private void ValidarAcesso(Usuario usuario, Usuario usuarioLogado)
        {
            if (usuario.TipoDeUsuario == TipoDeUsuario.Jogador)
            {
                if (usuarioLogado == null)
                {
                    // Cadastro próprio do jogador via App
                    return;
                }
            }

            if (usuario.TipoDeUsuario == TipoDeUsuario.Master)
            {
                if (usuarioLogado != null && usuarioLogado.TipoDeUsuario == TipoDeUsuario.Master)
                {
                    // Master pode cadastrar master
                    return;
                }
                throw new Exception("Somente o usuário master pode cadastrar outro usuário master.");
            }

            if (usuarioLogado.TipoDeUsuario == TipoDeUsuario.Master)
            {
                return;
            }
        }

        private string GetHashDaSenha(params string[] data)
        {
            var result = string.Empty;

            var text = string.Format("<{1}><{0}>", data[0],
                Convert.ToBase64String(Encoding.UTF8.GetBytes(data[1])));

            using (var sha = new System.Security.Cryptography.SHA256Managed())
            {
                byte[] textData = System.Text.Encoding.UTF8.GetBytes(text);
                byte[] hash = sha.ComputeHash(textData);
                result = BitConverter.ToString(hash).Replace("-", String.Empty);
            }

            return result;
        }

        private bool EstaCriptografada(string senha)
        {
            if (string.IsNullOrEmpty(senha))
                return false;
            return senha.Length == 64;
        }
    }

}
