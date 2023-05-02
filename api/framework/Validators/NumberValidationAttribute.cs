using System;

namespace framework.Validators
{
    [System.AttributeUsage(System.AttributeTargets.Property, AllowMultiple = false)]
    public class NumberValidationAttribute : Attribute, IValidationAttribute
    {
        public double MaxValue { get; set; }
        public double MinValue { get; set; }
        public string MinValueMessage { get; set; }
        public string MaxValueMessage { get; set; }

        public virtual bool IsValid(object value)
        {
            var result = string.IsNullOrWhiteSpace(GetErrorMessage(value));
            return result;
        }

        protected virtual string GetErrorMessage(object value)
        {
            var result = string.Empty;
            var propValue = default(double?);

            if (value != null)
            {
                if (double.TryParse(value.ToString(), out double outValue))
                {
                    propValue = outValue;
                }
            }

            if (propValue.HasValue)
            {
                if ((MinValue > 0) && (propValue.Value < MinValue))
                {
                    result = MinValueMessage;
                }

                if ((MaxValue > 0) && (propValue.Value > MaxValue))
                {
                    result = MaxValueMessage;
                }
            }
            return result;
        }

        public void Validate(object value)
        {
            var message = GetErrorMessage(value);
            if (!string.IsNullOrWhiteSpace(message))
            {
                throw new Exception(message);
            }
        }
    }
}
