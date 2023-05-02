using data;
using messages;
using System;
using System.Collections.Generic;
using System.Text;

namespace ojogodabolsa.Repositories
{
    public class PalpiteRepository : Repository<Palpite>
    {
        public PalpiteRepository(IUnitOfWork<Palpite> unitOfWork, IMessageControl messageControl) : 
            base(unitOfWork, messageControl)
        {
        }
    }
}
