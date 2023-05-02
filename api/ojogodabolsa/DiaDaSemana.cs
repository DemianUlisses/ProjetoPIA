﻿using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Text;

namespace ojogodabolsa
{
    public enum DiaDaSemana
    {
        [Description("")]
        NaoInformado = 0,
        [Description("Domingo")]
        Domingo = 1,        
        [Description("Segunda-feira")]
        Segunda = 2,        
        [Description("Terça-feira")]
        Terca = 3,        
        [Description("Quarta-feira")]
        Quarta = 4,
        [Description("Quinta-feira")]
        Quinta = 5,
        [Description("Sexta-feira")]
        Sexta = 6,
        [Description("Sábado")]
        Sabado = 7
    }
}
