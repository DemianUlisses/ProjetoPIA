using System;

namespace framework.Validators
{
    [System.AttributeUsage(System.AttributeTargets.Property, AllowMultiple = false)]
    public class CPFValidationAttribute: Attribute, IValidationAttribute
    {
        public bool IsValid(object value)
        {
            var result = value == null;
            if (!result)
            {
                result = CPFValidator.IsValid(value.ToString());
            }
            return result;
        }

        public void Validate(object value)
        {
            var isValid = value == null;
            if (!isValid)
            {
                isValid = CPFValidator.IsValid(value.ToString());
                if (!isValid)
                {
                    throw new Exception(string.Format("{0} não é um CPF válido.", value));
                }
            }
        }
    }
}
