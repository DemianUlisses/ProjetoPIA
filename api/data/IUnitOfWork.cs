using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text.RegularExpressions;

namespace data
{
    public enum Genero
    {
        Masculino,
        Feminino
    }

    public interface IEntity
    {
        long Id { get; }
        Genero GeneroDaEntidade { get; }
        string NomeDaEntidade { get; }
    }

    public interface ISearchableEntity : IEntity
    {
        string Searchable { get; set; }
        string GetSearchableText();
    }

    public static class SearchableBuilder
    {
        public static string Build(string searchableText)
        {
            var result = default(string);
            if (searchableText == null)
            {
                return null;
            }
            result = Limpar(searchableText).ToUpperInvariant();
            return result;
        }

        public static string Limpar(string texto)
        {
            string comAcentos = "ÄÅÁÂÀÃäáâàãÉÊËÈéêëèÍÎÏÌíîïìÖÓÔÒÕöóôòõÜÚÛüúûùÇç";
            string semAcentos = "AAAAAAaaaaaEEEEeeeeIIIIiiiiOOOOOoooooUUUuuuuCc";

            for (int i = 0; i < comAcentos.Length; i++)
            {
                texto = texto.Replace(comAcentos[i].ToString(), semAcentos[i].ToString());
            }
            var charsToRemove = new string[] { "@", ",", ".", ";", "'", "\\", "/", "-", "_", "+" };
            foreach (var c in charsToRemove)
            {
                texto = texto.Replace(c, string.Empty);
            }

            return texto;
        }
    }

    public static class GeneroExtensions
    {
        public static bool IsMasculino(this Enum value)
        {
            return value.ToString() == Genero.Masculino.ToString();
        }
    }

    public interface IUnitOfWork<T> where T : IEntity
    {
        void Insert(T entity);
        void Update(T entity);
        T Get(object id);
        void Delete(T entity);
        IQueryable<T> GetAll();
    }

    public class CommandData
    {
        public string Sql { get; set; }
        public List<KeyValuePair<string, object>> Parametters { get; set; }

        public CommandData()
        {
            this.Parametters = new List<KeyValuePair<string, object>>();
        }

        public virtual void AddParametter(string name, object value)
        {
            this.Parametters.Add(new KeyValuePair<string, object>(name, value));
        }
    }

    public interface ISqlCommand
    {
        void ExecuteNonQuery(CommandData command);
        IEnumerable<IEnumerable<KeyValuePair<string, object>>> Execute(CommandData command);
    }

    public class EntityEqualityComparer : IEqualityComparer<IEntity>
    {
        public virtual bool Equals(IEntity entity1, IEntity entity2)
        {
            if (entity2 == null && entity1 == null)
                return true;
            else if (entity1 == null || entity2 == null)
                return false;
            else if (entity1.Id == entity2.Id)
                return true;
            else
                return false;
        }

        public virtual int GetHashCode(IEntity obj)
        {
            return obj == null ? 0 : obj.Id.GetHashCode();
        }

        public static EntityEqualityComparer Build()
        {
            return new EntityEqualityComparer();
        }
    }
}
