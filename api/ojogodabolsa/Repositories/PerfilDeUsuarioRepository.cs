using data;
using messages;
using System;
using System.Linq;

namespace ojogodabolsa.Repositories
{
    public class PerfilDeUsuarioRepository : Repository<PerfilDeUsuario>
    {
        private Repository<AcessoDePerfilDeUsuario> AcessoDePerfilDeUsuarioRepository;

        public PerfilDeUsuarioRepository(IUnitOfWork<PerfilDeUsuario> unitOfWork,
            Repository<AcessoDePerfilDeUsuario> acessoDePerfilDeUsuarioRepository,
            IMessageControl messageControl) : base(unitOfWork, messageControl)
        {
            AcessoDePerfilDeUsuarioRepository = acessoDePerfilDeUsuarioRepository;
        }

        public virtual PerfilDeUsuario GetPerfilByNome(string nome)
        {
            var result = UnitOfWork.GetAll()
                .Where(i => i.Nome.ToLower().Trim() == nome.ToLower().Trim())
                .FirstOrDefault();
            return result;
        }

        public override void Insert(PerfilDeUsuario entity)
        {
            if (entity.Acessos != null)
            {
                foreach (var i in entity.Acessos)
                {
                    i.PerfilDeUsuario = entity;
                }
            }
            Validate(entity);
            ValidarDuplicidade(entity);
            base.Insert(entity);
        }

        public override void Update(PerfilDeUsuario entity)
        {
            var itemSalvo = Get(entity.Id);
            if ((itemSalvo != null) && (itemSalvo.Nome.ToLower().Trim() == "master"))
            {
                throw new System.Exception("O perfil MASTER não pode ser alterado.");
            }
            foreach (var i in entity.Acessos)
            {
                i.PerfilDeUsuario = entity;
            }
            
            var oldEntity = Get(entity.Id);

            var acessosComparer = new AcessoDePerfilDeUsuarioEqualityComparer();

            var acessosADeletar = oldEntity.Acessos.Except(entity.Acessos, acessosComparer).ToArray();

            Validate(entity);
            ValidarDuplicidade(entity);
            base.Update(entity);

            foreach (var acesso in acessosADeletar)
            {
                oldEntity.Acessos.ToList().Remove(acesso);
                AcessoDePerfilDeUsuarioRepository.Delete(acesso);
            }
        }

        private void ValidarDuplicidade(PerfilDeUsuario entity)
        {
            var duplicado = GetAll()
                .Where(i => i.Id != entity.Id)
                .Where(i => i.Nome.ToLower() == entity.Nome.ToLower())
                .Where(i => i.Situacao == SituacaoDePerfilDeUsuario.Ativo)
                .Any();
            if (duplicado)
            {
                throw new Exception("Já existe um perfil ativo cadastrado com esse nome.");
            }
        }
    }
}
