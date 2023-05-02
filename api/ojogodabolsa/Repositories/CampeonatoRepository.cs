using data;
using messages;
using System;
using System.Collections.Generic;
using System.Text;

namespace ojogodabolsa.Repositories
{
    public class CampeonatoRepository : Repository<Campeonato>
    {
        public CampeonatoRepository(IUnitOfWork<Campeonato> unitOfWork, IMessageControl messageControl) : 
            base(unitOfWork, messageControl)
        {
        }
    }
}
