using api.Dtos;
using ojogodabolsa;
using ojogodabolsa.Repositories;
using data;
using framework;
using framework.Extensions;
using messages;
using Microsoft.AspNet.OData;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;

namespace api.Controllers
{
    [Route("usuario/[action]")]
    [Route("usuario")]
    [ApiController]
    public class UsuarioControler
    {
        public Mensagens Mensagens { get; set; }
        public Cfg Cfg { get; set; }

        private UsuarioRepository UsuarioRepository;
        private PerfilDeUsuarioRepository PerfilDeUsuarioRepository;

        public UsuarioControler(UsuarioRepository repository,
            PerfilDeUsuarioRepository perfilDeUsuarioRepository,
            Mensagens mensagens, Cfg cfg)
        {
            Mensagens = mensagens;
            Cfg = cfg;
            UsuarioRepository = repository;
            PerfilDeUsuarioRepository = perfilDeUsuarioRepository;
        }

        [EnableQuery]
        [HttpGet]
        public virtual IQueryable<UsuarioDto> Get()
        {

            IQueryable<UsuarioDto> result = null;
            var usuario = GetUsuario(UsuarioRepository);
            result = UsuarioRepository
                .GetAll()
                .Select(i => UsuarioDto.Build(i))
                .ToArray()
                .AsQueryable();
            return result;
        }

        [HttpGet("{id}")]
        public virtual ActionResult<UsuarioDto> Get(long id)
        {
            var result = UsuarioRepository.Get(id);
            if (result == null)
            {
                return new NotFoundResult();
            }
            return UsuarioDto.Build(result);
        }

        [HttpPost]
        public virtual ActionResult<long> Post([FromBody] SolicitacaoDeInclusaoDeUsuario item)
        {
            var usuarioLogado = GetUsuario(UsuarioRepository);
            var usuario = new Usuario()
            {
                Nome = item.Nome,
                NomeDeUsuario = item.NomeDeUsuario,
                Perfil = item.Perfil != null ? PerfilDeUsuarioRepository.Get(item.Perfil.Id) : null,
                PushToken = item.PushToken,
                Senha = item.Senha,
                Situacao = item.Situacao,
                TipoDeUsuario = item.TipoDeUsuario,
            };
            UsuarioRepository.Insert(usuario, usuarioLogado);
            return usuario.Id;
        }

        [HttpPut]
        public virtual ActionResult<bool> Put([FromBody] SolicitacaoDeAlteracaoDeUsuario item)
        {
            var usuarioLogado = GetUsuario(UsuarioRepository);
            var itemSalvo = UsuarioRepository.Get(item.Id);
            if (itemSalvo == null)
            {
                return new NotFoundResult();
            }

            if (!string.IsNullOrEmpty(item.Senha) && (UsuarioRepository.SenhaAlterada(itemSalvo.NomeDeUsuario, itemSalvo.Senha, item.Senha) ||
                (itemSalvo.Situacao.IsNot(SituacaoDeUsuario.Ativo))))
            {
                UsuarioRepository.SetLastValidToken(itemSalvo.Id.ToString(), null);
                itemSalvo.LastValiTokenUID = null;
            }

            itemSalvo.Nome = item.Nome;
            itemSalvo.NomeDeUsuario = item.NomeDeUsuario;
            itemSalvo.Perfil = item.Perfil != null ? PerfilDeUsuarioRepository.Get(item.Perfil.Id) : null;
            itemSalvo.PushToken = item.PushToken;
            itemSalvo.Senha = !string.IsNullOrEmpty(item.Senha) ? item.Senha : itemSalvo.Senha;
            itemSalvo.Situacao = item.Situacao;
            itemSalvo.TipoDeUsuario = item.TipoDeUsuario;

            UsuarioRepository.Update(itemSalvo, usuarioLogado);
            return true;
        }

        [HttpDelete("{id}")]
        public virtual ActionResult<bool> Delete(long id)
        {
            var item = UsuarioRepository.Get(id);
            if (UsuarioRepository.Get(id) == null)
            {
                return new NotFoundResult();
            }
            UsuarioRepository.Delete(item);
            return true;
        }

        [ActionName("combosparacadastro")]
        public CombosParaCadastroDeUsuario GetCombosParaCadastro()
        {
            var usuario = GetUsuario(UsuarioRepository);
            var result = new CombosParaCadastroDeUsuario()
            {
                Perfis =
                    usuario.TipoDeUsuario == TipoDeUsuario.Master ?
                    PerfilDeUsuarioRepository.GetAll().Select(i => PerfilDeUsuarioDto.Build(i)).ToArray()
                    :
                    PerfilDeUsuarioRepository.GetAll()
                    .Where(i => i.Nome.ToLower() != "master")
                    .Select(i => PerfilDeUsuarioDto.Build(i)).ToArray(),
            };
            return result;
        }

        private void VerificarSePessoaFoiInformada(Message mensagem)
        {
            if (!Cfg.IdDoUsuario.HasValue)
            {
                throw new Exception(Mensagens.Get(mensagem));
            }
        }

        protected virtual void VerificarSeUsuarioFoiInformado(Message mensagem)
        {
            if (!Cfg.IdDoUsuario.HasValue)
            {
                throw new Exception(Mensagens.Get(mensagem));
            }
        }

        protected virtual Usuario GetUsuario(UsuarioRepository usuarioRepository)
        {
            VerificarSeUsuarioFoiInformado(Message.UsuarioNaoIdentificado);
            var result = usuarioRepository.Get(Cfg.IdDoUsuario);
            return result;
        }

    }

    public class CombosParaCadastroDeUsuario
    {
        public PerfilDeUsuarioDto[] Perfis { get; set; }
    }

    public class SolicitacaoDeInclusaoDeUsuario
    {
        public long Id { get; set; }
        public string Nome { get; set; }
        public string NomeDeUsuario { get; set; }
        public string Senha { get; set; }
        public Tipo<TipoDeUsuario> TipoDeUsuario { get; set; }
        public PerfilDeUsuarioDto Perfil { get; set; }
        public Tipo<SituacaoDeUsuario> Situacao { get; set; }
        public string PushToken { get; set; }
    }

    public class SolicitacaoDeAlteracaoDeUsuario
    {
        public long Id { get; set; }
        public string Nome { get; set; }
        public string NomeDeUsuario { get; set; }
        public string Senha { get; set; }
        public Tipo<TipoDeUsuario> TipoDeUsuario { get; set; }
        public PerfilDeUsuarioDto Perfil { get; set; }
        public Tipo<SituacaoDeUsuario> Situacao { get; set; }
        public string PushToken { get; set; }
    }
}