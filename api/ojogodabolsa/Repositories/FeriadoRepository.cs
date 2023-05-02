using data;
using messages;
using System;
using System.Collections.Generic;
using System.Text;

namespace ojogodabolsa.Repositories
{
    public class FeriadoRepository : Repository<Feriado>
    {
        public FeriadoRepository(IUnitOfWork<Feriado> unitOfWork, IMessageControl messageControl) : base(unitOfWork, messageControl)
        {
        }

        public virtual bool IsDiaUtil(DateTime data)
        {
            var result = FeriadoHelper.IsDiaUtil(data, this);
            return result;
        }
    }
}
