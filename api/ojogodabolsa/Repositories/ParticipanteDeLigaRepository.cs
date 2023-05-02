using data;
using messages;
using System;
using System.Collections.Generic;
using System.Text;

namespace ojogodabolsa.Repositories
{
    public class ParticipanteDeLigaRepository : Repository<ParticipanteDeLiga>
    {
        public ParticipanteDeLigaRepository(IUnitOfWork<ParticipanteDeLiga> unitOfWork, IMessageControl messageControl) : 
            base(unitOfWork, messageControl)
        {
        }
    }
}
