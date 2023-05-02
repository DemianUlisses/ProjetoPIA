using System;

namespace framework.Validators
{
    [System.AttributeUsage(System.AttributeTargets.Property, AllowMultiple = false)]
    public class CNSValidationAttribute : Attribute, IValidationAttribute
    {
        public bool IsValid(object value)
        {
            var result = value == null;
            if (!result)
            {
                result = CNSValidator.chkNumeroCNS(value.ToString());
            }
            return result;
        }

        public void Validate(object value)
        {
            var isValid = value == null;
            if (!isValid)
            {
                isValid = CNSValidator.chkNumeroCNS(value.ToString());
                if (!isValid)
                {
                    throw new Exception(string.Format("{0} não é um CNS válido.", value));
                }
            }
        }
    }
}