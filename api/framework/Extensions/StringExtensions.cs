﻿using System;
 
using System.Collections.Generic;
 
using System.Linq;
 
using System.Text;
 

 
namespace framework.Extensions
 
{
 
    public static class StringExtensions
 
    {
 
        public static bool ContainsAny(this string sentence, string searchSentence)
 
        {
 
            return StringUtils.ContainsAny(sentence, searchSentence);
 
        }
 

 
    }
 

 
    public static class StringUtils
 
    {
 
        private static bool ContainsAnyInternal(string sentence, string searchSentence)
 
        {
 
            if (string.IsNullOrEmpty(sentence))
 
            {
 
                return false;
 
            }
 
            sentence = sentence.ToUpper();
 
            searchSentence = searchSentence.ToUpper();
 
            var words = sentence.Split(' ');
 
            var result = false;
 
            var keyWords = searchSentence.Split(' ');
 
            foreach (var keyWord in keyWords)
 
            {
 
                result = words.Where(word => word.Contains(keyWord)).Any();
 
                if (result)
 
                {
 
                    break;
 
                }
 
            }
 
            return result;
 
        }
 

 
        public static bool ContainsAny(string sentence, string searchSentence)
 
        {
 
            return ContainsAnyInternal(sentence, searchSentence);
 
        }
 
    }
 
}