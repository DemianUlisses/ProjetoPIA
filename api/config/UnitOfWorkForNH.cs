﻿using data;
using NHibernate;
using Npgsql;
using System;
using System.Collections.Generic;
using System.Linq;

namespace config
{
    public class UnitOfWorkForHN<T> : IUnitOfWork<T> where T : IEntity
    {
        private readonly UnitOfWorkScope UnitOfWorkScope;

        public UnitOfWorkForHN(UnitOfWorkScope unitOfWorkScope)
        {
            UnitOfWorkScope = unitOfWorkScope;
        }

        public virtual void Insert(T entity)
        {
            GetCurrentSession().Save(entity);
            GetCurrentSession().Flush();
        }

        public virtual void Update(T entity)
        {
            T dirty = GetCurrentSession().Get<T>(entity.Id);
            GetCurrentSession().Evict(dirty);
            GetCurrentSession().Update(entity);
            GetCurrentSession().Flush();
        }

        public virtual void Delete(T entity)
        {
            try
            {
                GetCurrentSession().Delete(entity);
                GetCurrentSession().Flush();
            }
            catch (ADOException e)
            {
                var postgresException = e.InnerException as PostgresException;
                if ((postgresException != null) && (postgresException.SqlState == "23503"))
                {
                    throw new Exception(string.Format("{0}{1}{2}{3}{4}",
                        "Não é possível excluir ", entity.GeneroDaEntidade.IsMasculino() ? " o " : " a ",
                        !string.IsNullOrEmpty(entity.NomeDaEntidade) ? entity.NomeDaEntidade.ToLower() : entity.GetType().Name,
                        " pois existem outros dados relacionados a", entity.GeneroDaEntidade.IsMasculino() ? " ele." : " ela."

                    ), e);
                }
                else
                {
                    throw e;
                }
            }
            catch (Exception)
            {
                throw;
            }
        }

        public virtual T Get(object id)
        {
            return GetCurrentSession().Get<T>(id);
        }

        public IQueryable<T> GetAll()
        {
            return GetCurrentSession().Query<T>();
        }

        public void StartTransaction()
        {
            GetCurrentSession().Transaction.Begin();
        }

        public void Commit()
        {
            GetCurrentSession().Transaction.Commit();
        }

        public void Rollback()
        {
            GetCurrentSession().Transaction.Rollback();
        }

        protected ISession GetCurrentSession() 
        {
            var result = ((UnitOfWorkScopeForNH)UnitOfWorkScope).Session();
            return result;
        }
    }

    public class NHCommand: ISqlCommand
    {
        private readonly UnitOfWorkScope UnitOfWorkScope;

        public NHCommand(UnitOfWorkScope unitOfWorkScope)
        {
            UnitOfWorkScope = unitOfWorkScope;
        }

        public virtual void ExecuteNonQuery(CommandData command)
        {
            using (var cmd = GetCurrentSession().Connection.CreateCommand())
            {
                cmd.CommandText = command.Sql;
                foreach (var i in command.Parametters)
                {
                    var parameter = cmd.CreateParameter();
                    parameter.ParameterName = i.Key;
                    if (i.Value == null)
                    {
                        parameter.Value = DBNull.Value;
                    }
                    else
                    {
                        parameter.Value = i.Value;
                    }
                    cmd.Parameters.Add(parameter);
                }
                cmd.ExecuteNonQuery();
                cmd.Dispose();
            }
        }

        public virtual IEnumerable<IEnumerable<KeyValuePair<string, object>>> Execute(CommandData command)
        {
            var result = new List<List<KeyValuePair<string, object>>>();
            using (var cmd = GetCurrentSession().Connection.CreateCommand())
            {
                cmd.CommandText = command.Sql;
                foreach (var i in command.Parametters)
                {
                    var parameter = cmd.CreateParameter();
                    parameter.ParameterName = i.Key;
                    parameter.Value = i.Value;
                    cmd.Parameters.Add(parameter);
                }
                using (var dr = cmd.ExecuteReader()) {
                    while (dr.Read())
                    {
                        var fields = new List<KeyValuePair<string, object>>();
                        for (var i = 0; i < dr.FieldCount; i++) {
                            var column = dr.GetName(i);
                            var fieldValue = dr.GetValue(i);
                            var value = fieldValue == DBNull.Value ? null : fieldValue;
                            fields.Add(new KeyValuePair<string, object>(column, value));
                        }
                        result.Add(fields);
                    }
                    dr.Close();
                }
                cmd.Dispose();
            };
            return result;
        }

        protected ISession GetCurrentSession()
        {
            var result = ((UnitOfWorkScopeForNH)UnitOfWorkScope).Session();
            return result;
        }
    }
}
