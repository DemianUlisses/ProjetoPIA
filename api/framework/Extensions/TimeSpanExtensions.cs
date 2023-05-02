﻿using System; 
 
namespace framework.Extensions
{
    public static class TimeSpanExtensions
 
    {
        public static string ToHoraString(this TimeSpan value)
        {
            var result = value != null ? value.ToString("hh':'mm") : null;
            return result;
        }
    }
}