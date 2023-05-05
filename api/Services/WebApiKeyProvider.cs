using framework;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security;
using System.Web;

namespace api.Services
{
    public class WebApiKeyProvider : IKeyProvider
    {
        public SecureString GetKey()
        {
            var result = new SecureString();
            result.AppendChar('0');
            result.AppendChar('3');
            result.AppendChar('b');
            result.AppendChar('7');
            result.AppendChar('3');
            result.AppendChar('4');
            result.AppendChar('7');
            result.AppendChar('a');
            result.AppendChar('5');
            result.AppendChar('b');
            result.AppendChar('1');
            result.AppendChar('6');
            result.AppendChar('0');
            result.AppendChar('c');
            result.AppendChar('3');
            result.AppendChar('8');
            result.AppendChar('5');
            result.AppendChar('c');
            result.AppendChar('3');
            result.AppendChar('4');
            result.AppendChar('c');
            result.AppendChar('4');
            result.AppendChar('7');
            result.AppendChar('e');
            result.AppendChar('8');
            result.AppendChar('f');
            result.AppendChar('f');
            result.AppendChar('f');
            result.AppendChar('8');
            result.AppendChar('c');
            result.AppendChar('d');
            result.AppendChar('3');
            return result;
        }

        public SecureString GetIV()
        {
            var result = new SecureString();
            result.AppendChar('0');
            result.AppendChar('3');
            result.AppendChar('b');
            result.AppendChar('7');
            result.AppendChar('3');
            result.AppendChar('4');
            result.AppendChar('7');
            result.AppendChar('a');
            result.AppendChar('5');
            result.AppendChar('b');
            result.AppendChar('1');
            result.AppendChar('6');
            result.AppendChar('0');
            result.AppendChar('c');
            result.AppendChar('3');
            result.AppendChar('8');
            return result;
        }
    }
}