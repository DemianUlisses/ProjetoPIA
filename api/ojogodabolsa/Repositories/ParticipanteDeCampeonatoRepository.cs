using data;
using messages;
using System;
using System.Collections.Generic;
using System.Text;

namespace ojogodabolsa.Repositories
{
    public class ParticipanteDeCampeonatoRepository : Repository<ParticipanteDeCampeonato>
    {
        public ParticipanteDeCampeonatoRepository(IUnitOfWork<ParticipanteDeCampeonato> unitOfWork, IMessageControl messageControl) : 
            base(unitOfWork, messageControl)
        {
        }
    }
}
