using ojogodabolsa;
using ojogodabolsa.Repositories;
using data;
using messages;
using Microsoft.AspNet.OData;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Linq;

namespace api.Controllers
{
    public abstract class CustomController : ODataController
    {
        public Mensagens Mensagens { get; set; }
        public Cfg Cfg { get; set; }

        public CustomController(Mensagens mensagens, Cfg cfg)
        {
            this.Mensagens = mensagens;
            this.Cfg = cfg;
        }

        private void VerificarSeUsuarioFoiInformado(Message mensagem)
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

    [ApiController]
    public class CustomController<T> : ControllerBase where T : IEntity
    {
        public Mensagens Mensagens { get; set; }
        public Cfg Cfg { get; set; }
        public Repository<T> Repository { get; set; }


        public CustomController(Repository<T> repository, Mensagens mensagens, Cfg cfg)
        {
            this.Repository = repository;
            this.Mensagens = mensagens;
            this.Cfg = cfg;
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

        [EnableQuery]
        [HttpGet]
        public virtual IQueryable<T> Get()
        {
            var result = Repository.GetAll();
            result = ApplyFilters(result);
            return result;
        }

        [HttpGet("{id}")]
        public virtual ActionResult<T> Get(long id)
        {
            var result = Repository.Get(id);
            if (result == null)
            {
                return new NotFoundResult();
            }
            return result;
        }

        [HttpPost]
        public virtual ActionResult<long> Post([FromBody]T item)
        {
            AntesDeInserir(item);
            Repository.Insert(item);
            return item.Id;
        }

        [HttpPut]
        public virtual ActionResult<bool> Put([FromBody]T item)
        {
            AntesDeAlterar(item);
            if (Repository.Get(item.Id) == null)
            {
                return new NotFoundResult();
            }
            Repository.Update(item);
            return true;
        }

        [HttpDelete("{id}")]
        public virtual ActionResult<bool> Delete(long id)
        {
            var item = Repository.Get(id);
            if (Repository.Get(id) == null)
            {
                return new NotFoundResult();
            }
            AntesDeExcluir(item);
            Repository.Delete(item);
            return true;
        }

        protected virtual void AntesDeInserir(T item)
        {

        }

        protected virtual void AntesDeAlterar(T item)
        {

        }

        protected virtual void AntesDeExcluir(T item)
        {

        }

        protected virtual IQueryable<T> ApplyFilters( IQueryable<T> result)
        {
            return result;
        }
    }
}