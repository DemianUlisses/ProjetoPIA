using framework;
using ojogodabolsa.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;

namespace api.Services
{
    public class WebApiUserValidator : IUserValidator
    {
        private readonly UsuarioRepository UsuarioRepository;
        private readonly ParametrosRepository ParametrosRepository;

        public WebApiUserValidator(UsuarioRepository usuarioRepository, 
            ParametrosRepository parametrosRepository)
        {
            UsuarioRepository = usuarioRepository;
            ParametrosRepository = parametrosRepository;
        }

        public bool IsValid(string userId, string password)
        {
            var item = UsuarioRepository.GetUsuarioByLoginESenha(userId, password);
            var result = item != null;
            return result;
        }

        public string NotFoundMessage()
        {
            var result = "Usuário não encontrado";
            return result;
        }

        public int GetExpireTimeInSeconds()
        {
            var horas = 1;
            var result = 60 * 60 * horas;
            var tempoDeSessaoEmMinutosSemAtividade = ParametrosRepository.GetInt("Autenticacao.TempoDeSessaoEmMinutosSemAtividade");
            if (tempoDeSessaoEmMinutosSemAtividade.HasValue)
            {
                result = tempoDeSessaoEmMinutosSemAtividade.Value * 60;
            }
            return result;
        }

        public bool HasAccessTo(string userId, string module, string action, out long? rotina)
        {
            var result = UsuarioRepository.TemAcesso(userId, module, action, out rotina);
            return result;
        }

        public bool MustAuthenticateTo(string module, string action)
        {
            module = ((module.Substring(module.Length - 1) == "/") ?
                module.Substring(0, module.Length - 1) : module).ToLower();
            action = action.ToUpper();
            var result = !FreeAccessModulos().Where(i => TemAcesso(i, action, module)).Any();
            return result;
        }

        private bool TemAcesso(ModuleAccessControl i, string action, string module)
        {
            var result = false;
            if ((i.Action == action) || (i.Action == "*"))
            {
                if ((i.ModuleName == module))
                {
                    result = true;
                }
                else
                if (
                    (i.ModuleName.EndsWith('*')) &&
                    (module.StartsWith(i.ModuleName.Substring(0, i.ModuleName.Length - 1)))
                   )
                {
                    result = true;
                }
                else
                {
                    var regex = new Regex(i.ModuleName);
                    result = regex.IsMatch(module);
                }
            }
            return result;
        }

        private IEnumerable<ModuleAccessControl> FreeAccessModulos()
        {
            var result = new List<ModuleAccessControl>
            {
                new ModuleAccessControl() { ModuleName = "/login/token", Action = "POST" },
                new ModuleAccessControl() { ModuleName = "/login/recover", Action = "POST" },
                new ModuleAccessControl() { ModuleName = "/jogador/cadastroweb", Action = "POST" },
                new ModuleAccessControl() { ModuleName = "/arquivo/*", Action = "GET" },
            };
            return result.ToArray();
        }

        public void SetLastValidToken(string userId, string tokenUid )
        {
            UsuarioRepository.SetLastValidToken(userId, tokenUid);
        }

        public string GetLastValidTokenUID(string userId)
        {
            var result = UsuarioRepository.GetLastValidTokenUID(userId);
            return result;
        }

        public void RefreshToken(string userId, int expireTimeInSeconds)
        {
            UsuarioRepository.RefreshToken(userId, expireTimeInSeconds);
        }
    }

    internal class ModuleAccessControl
    {
        private string moduleName;
        private string action;
        public string ModuleName { get { return this.moduleName; } set { this.moduleName = value.ToLower(); } }
        public string Action { get { return this.action; } set { this.action = value.ToUpper(); } }
    }
}