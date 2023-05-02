using data;
using messages;
using System;
using System.Collections.Generic;
using System.Text;

namespace ojogodabolsa.Repositories
{
    public class LigaRepository : Repository<Liga>
    {
        public LigaRepository(IUnitOfWork<Liga> unitOfWork, IMessageControl messageControl) : 
            base(unitOfWork, messageControl)
        {
        }
    }
}
