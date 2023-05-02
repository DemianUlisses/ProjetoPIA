using System;

namespace framework.Validators
{
    [AttributeUsage(System.AttributeTargets.Property, AllowMultiple = false)]
    public class TelefoneCelularValidationAttribute : Attribute, IValidationAttribute
    {
        public bool IsValid(object value)
        {
            var result = value == null;
            if (!result)
            {
                result = TelefoneCelularValidator.IsValid(value.ToString());
            }
            return result;
        }

        public void Validate(object value)
        {
            var isValid = IsValid(value);
            if (!isValid)
            {
                throw new Exception(string.Format(
                    "\"{0}\" não é um número de celular válido. O número deve estar no formato (00)00000-0000.", value));
            }
        }
    }
}
