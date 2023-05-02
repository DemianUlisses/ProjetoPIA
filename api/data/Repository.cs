using framework.Validators;
using messages;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;

namespace data
{
    public class Repository<T> where T : IEntity
    {
        protected IUnitOfWork<T> UnitOfWork { get; set; }
        public IMessageControl MessageControl { get; set; }

        public Repository(IUnitOfWork<T> unitOfWork, IMessageControl messageControl)
        {
            UnitOfWork = unitOfWork;
            MessageControl = messageControl;
        }

        public virtual void Insert(T entity)
        {
            Validate(entity);
            if (entity is ISearchableEntity)
            {
                var searchableEntity = entity as ISearchableEntity;
                searchableEntity.Searchable = searchableEntity.GetSearchableText();
            }
            UnitOfWork.Insert(entity);
        }

        public virtual void Update(T entity)
        {
            Validate(entity);
            if (entity is ISearchableEntity)
            {
                var searchableEntity = entity as ISearchableEntity;
                searchableEntity.Searchable = searchableEntity.GetSearchableText();
                if (searchableEntity.Searchable.Length > 500)
                {
                    searchableEntity.Searchable = searchableEntity.Searchable.Substring(0, 500);
                }
            }
            UnitOfWork.Update(entity);
        }

        public virtual T Get(object id)
        {
            var result = UnitOfWork.Get(id);
            return result;
        }

        public virtual T Get(object id, bool raiseErrorIfNotFound)
        {
            var result = UnitOfWork.Get(id);
            if (result == null)
            {
                var entity = Activator.CreateInstance<T>();
                throw new Exception(string.Format("{0}{1}{2}{3}{4}",
                    entity.NomeDaEntidade, " ", id.ToString(), " não ",
                    entity.GeneroDaEntidade.IsMasculino() ? "encontrado." : "encontrada."));
            }
            return result;
        }

        public virtual void Delete(T entity)
        {
            UnitOfWork.Delete(entity);
        }

        public virtual IQueryable<T> GetAll()
        {
            return UnitOfWork.GetAll();
        }

        public virtual AggregateException Validate(T entity, bool raiseExceptions = true)
        {
            var result = PropertyValidator.ValidateProperties(entity);
            if (raiseExceptions && (result != null))
            {
                throw result.InnerExceptions.First();
            }
            return result;
        }
    }

    public static class IEnumerableExtensions
    {
        public static T GetFieldValue<T>(this IEnumerable<KeyValuePair<string, object>> record, string columnName)
        {
            var result = default(T);
            var field = record.Where(i => i.Key.ToLower() == columnName.ToLower()).FirstOrDefault();
            if (field.Value != null)
            {
                result = (T)Convert.ChangeType(field.Value, typeof(T));
            }
            return result;
        }
    }
}

