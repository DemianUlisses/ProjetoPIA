using data;
using framework.Extensions;
using messages;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace ojogodabolsa.Repositories
{
    public class JogadorRepository : Repository<Jogador>
    {
        private Repository<TelefoneDePessoa> TelefoneRepository;
        private UsuarioRepository UsuarioRepository;
        private Repository<EnderecoDePessoa> EnderecoDePessoaRepository;

        public JogadorRepository(IUnitOfWork<Jogador> unitOfWork,
            Repository<TelefoneDePessoa> telefoneRepository,
            UsuarioRepository usuarioRepository,
            Repository<EnderecoDePessoa> enderecoDePessoaRepository,
            IMessageControl messageControl) :
            base(unitOfWork, messageControl)
        {
            TelefoneRepository = telefoneRepository;
            UsuarioRepository = usuarioRepository;
            EnderecoDePessoaRepository = enderecoDePessoaRepository;
        }

        public override void Insert(Jogador entity)
        {
            ValidarDuplicidade(entity);

            if (entity.Telefones != null)
            {
                foreach (var i in entity.Telefones)
                {
                    i.Pessoa = entity;
                }
            }

            if (entity.Enderecos != null)
            {
                foreach (var i in entity.Enderecos)
                {
                    i.Pessoa = entity;
                }
            }

            entity.Nome = Builders.NomeDePessoaBuilder.Build(entity.NomeCompleto);
            entity.DataDeCadastro = DateTime.Now;
            entity.TipoDeConta = TipoDeContaBancaria.ContaCorrente;
            entity.Apelido = entity.Nome.PrimeiroNome;
            base.Insert(entity);            
        }

        public override void Update(Jogador entity)
        {
            ValidarDuplicidade(entity);

            var oldEntity = Get(entity.Id);
            entity.Nome = Builders.NomeDePessoaBuilder.Build(entity.NomeCompleto);
            entity.Apelido = entity.Nome.PrimeiroNome;

            var usuario = oldEntity.Usuario;
            if ((usuario == null) && (!string.IsNullOrWhiteSpace(entity.Email)))
            {
                usuario = UsuarioRepository.GetUsuarioByLogin(entity.Email);
            }
            if (entity.Telefones != null)
            {
                foreach (var i in entity.Telefones)
                {
                    i.Pessoa = entity;
                }
            }
            if (entity.Enderecos != null)
            {
                foreach (var i in entity.Enderecos)
                {
                    i.Pessoa = entity;
                }
            }            

            var telefoneComparer = new TelefoneEqualityComparer();
            var enderecoComparer = new EnderecoDePessoaEqualityComparer();

            var telefonesADeletar = oldEntity.Telefones.Except(entity.Telefones, telefoneComparer).ToArray();
            var enderecosADeletar = oldEntity.Enderecos.Except(entity.Enderecos, enderecoComparer).ToArray();
            
            entity.Nome = Builders.NomeDePessoaBuilder.Build(entity.NomeCompleto);
            base.Update(entity);   

            foreach (var telefone in telefonesADeletar)
            {
                oldEntity.Telefones.ToList().Remove(telefone);
                TelefoneRepository.Delete(telefone);
            }

            foreach (var endereco in enderecosADeletar)
            {
                oldEntity.Enderecos.ToList().Remove(endereco);
                EnderecoDePessoaRepository.Delete(endereco);
            }           

            if ((usuario != null) &&
                ((string.IsNullOrEmpty(oldEntity.Email) || (oldEntity.Email != entity.Email)) ||
                (entity.Usuario == null)))
            {
                if (!((entity.Usuario != null) && (entity.Usuario.Id == usuario.Id)))
                {
                    UsuarioRepository.Delete(usuario);
                }
            }
            if (entity.Usuario != null)
            {
                usuario.Nome = entity.NomeCompleto;
                UsuarioRepository.Update(usuario, usuario);
            }
        }

        public virtual void ValidarDuplicidade(Jogador entity)
        {
            if (!string.IsNullOrWhiteSpace(entity.Cpf))
            {
                var duplicado = GetAll()
                    .Where(i => i.Id != entity.Id)
                    .Where(i => i.Cpf == entity.Cpf)
                    .Any();
                if (duplicado)
                {
                    throw new Exception("Já existe uma pessoa cadastrada com esse CPF.");
                }
            }
        }

        public override void Delete(Jogador entity)
        {
            var usuario = entity.Usuario;
            base.Delete(entity);
            if (usuario != null)
            {
                UsuarioRepository.Delete(usuario);
            }
        }
    }

}
