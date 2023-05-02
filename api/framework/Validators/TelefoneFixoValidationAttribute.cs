using System;

namespace framework.Validators
{
    [AttributeUsage(System.AttributeTargets.Property, AllowMultiple = false)]
    public class TelefoneFixoValidationAttribute: Attribute, IValidationAttribute
    {
        public bool IsValid(object value)
        {
            var result = value == null;
            if (!result)
            {
                result = TelefoneFixoValidator.IsValid(value.ToString());
            }
            return result;
        }

        public void Validate(object value)
        {
            var isValid = IsValid(value);
            if (!isValid)
            {
                throw new Exception(string.Format(
                    "\"{0}\" não é um número de telefone válido. O número deve estar no formato (00)0000-0000.", value));
            }
        }
    }
}
