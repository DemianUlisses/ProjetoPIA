using System;
using System.Text;
using System.Security.Cryptography;
using System.IO;
using System.Security;
using System.Runtime.InteropServices;

namespace framework
{
    public class Authentication
    {
        public string UserId { get; set; }
        public DateTime Date { get; set; }
        public string RequestToken { get; set; }
        public string TokenUID { get; set; }
    }

    public enum TokenValidationStatus
    {
        InvalidUser,
        Expired,
        Valid,
        Overwiten,
    }

    public enum AuthenticationStatus
    {
        InvalidUser,
        AuthenticationNotRequired,
        Authenticated,
        TokenExpired,
        TokenOverwiten
    }

    public enum AccessValidationStatus
    {
        AccessDenied,
        AccessGranted,
    }

    public interface IUserValidator
    {
        bool IsValid(string userId, string password);
        string NotFoundMessage();
        int GetExpireTimeInSeconds();
        bool HasAccessTo(string userId, string module, string action, out long? rotina);
        bool MustAuthenticateTo(string module, string action);
        void SetLastValidToken(string userId, string tokenUid);
        string GetLastValidTokenUID(string userId);
        void RefreshToken(string userId, int expireTimeInSeconds);
    }

    public interface IKeyProvider
    {
        SecureString GetKey();
        SecureString GetIV();
    }

    public class NotAuthenticatedException : Exception
    {
        public NotAuthenticatedException(string message)
            : base(message)
        {

        }
    }

    public class AccessDeniedException : Exception
    {
        public AccessDeniedException(string message)
            : base(message)
        {

        }
    }

    public class AccessControl
    {
        public IUserValidator UserValidator { get; set; }
        public IKeyProvider KeyProvider { get; set; }

        public AccessControl(IUserValidator userValidator, IKeyProvider keyProvider)
        {
            UserValidator = userValidator;
            KeyProvider = keyProvider;
        }

        public string GenerateToken(string userId)
        {
            using (RijndaelManaged myRijndael = new RijndaelManaged())
            {
                var token = Convert.ToBase64String(myRijndael.Key);

                var item = new Authentication()
                {
                    UserId = userId,
                    Date = DateTime.UtcNow,
                    RequestToken = token,
                    TokenUID = Guid.NewGuid().ToString(),
                };

                string key = null;
                var bstrKey = Marshal.SecureStringToBSTR(KeyProvider.GetKey());
                try
                {
                    key = Marshal.PtrToStringBSTR(bstrKey);
                }
                finally
                {
                    Marshal.FreeBSTR(bstrKey);
                }

                string iv = null;
                var bstrIV = Marshal.SecureStringToBSTR(KeyProvider.GetIV());
                try
                {
                    iv = Marshal.PtrToStringBSTR(bstrIV);
                }
                finally
                {
                    Marshal.FreeBSTR(bstrIV);
                }

                byte[] Key = UTF8Encoding.UTF8.GetBytes(key);
                byte[] IV = UTF8Encoding.UTF8.GetBytes(iv);

                var text = Newtonsoft.Json.JsonConvert.SerializeObject(item);
                var data = EncryptString(text, Key, IV);

                UserValidator.SetLastValidToken(userId, item.TokenUID);

                return Convert.ToBase64String(data); ;
            }
        }

        public TokenValidationStatus RefreshToken(string userId, ref string token)
        {
            var tokenStatus = IsValidToken(userId, token);

            if (tokenStatus.Equals(TokenValidationStatus.Valid))
            {
                token = GenerateToken(userId);
            }

            return tokenStatus;
        }

        public bool ValidateCredentials(string userId, string password)
        {
            var isValid = UserValidator.IsValid(userId, password);
            return isValid;
        }

        public AuthenticationStatus Authenticate(string userId, string token, string module, string action, bool raiseErros)
        {
            var accessValidation = AuthenticationStatus.InvalidUser;
            if (!UserValidator.MustAuthenticateTo(module, action))
            {
                accessValidation = AuthenticationStatus.AuthenticationNotRequired;
                return accessValidation;
            }

            userId = (string.IsNullOrEmpty(userId) ? "" : userId);
            token = (string.IsNullOrEmpty(token) ? "" : token);

            if ((string.IsNullOrEmpty(userId)) || (string.IsNullOrEmpty(token)))
            {
                accessValidation = AuthenticationStatus.InvalidUser;
                return accessValidation;
            }

            var tokenStatus = IsValidToken(userId, token);

            switch (tokenStatus)
            {
                case TokenValidationStatus.Valid:
                    {
                        accessValidation = AuthenticationStatus.Authenticated;
                    }
                    break;
                case TokenValidationStatus.Expired:
                    {
                        accessValidation = AuthenticationStatus.TokenExpired;
                    }
                    break;
                case TokenValidationStatus.InvalidUser:
                    {
                        accessValidation = AuthenticationStatus.InvalidUser;
                    }
                    break;
                case TokenValidationStatus.Overwiten:
                    {
                        accessValidation = AuthenticationStatus.TokenOverwiten;
                    }
                    break;
            }

            return accessValidation;
        }

        public AccessValidationStatus ValidateAccess(string userId, string token, string module, 
            string action, bool raiseErros, out long? rotina)
        {
            var result = AccessValidationStatus.AccessDenied;
            rotina = default(long?);
            if (!UserValidator.HasAccessTo(userId, module, action, out rotina))
            {
                if (raiseErros)
                {
                    throw new AccessDeniedException(
                        rotina.HasValue ? $"Você não tem acesso a essa rotina [{rotina.Value.ToString("0000")}]." :
                        "Você não tem acesso a essa rotina."
                        );
                }
            }
            else { 
                result = AccessValidationStatus.AccessGranted;
            }
            return result;
        }

        public TokenValidationStatus IsValidToken(string userId, string token)
        {
            string key = null;
            var bstrKey = Marshal.SecureStringToBSTR(KeyProvider.GetKey());
            try
            {
                key = Marshal.PtrToStringBSTR(bstrKey);
            }
            finally
            {
                Marshal.FreeBSTR(bstrKey);
            }

            string iv = null;
            var bstrIV = Marshal.SecureStringToBSTR(KeyProvider.GetIV());
            try
            {
                iv = Marshal.PtrToStringBSTR(bstrIV);
            }
            finally
            {
                Marshal.FreeBSTR(bstrIV);
            }

            byte[] Key = UTF8Encoding.UTF8.GetBytes(key);
            byte[] IV = UTF8Encoding.UTF8.GetBytes(iv);

            var data = DecryptString(token, Key, IV);
            TokenValidationStatus result;
            try
            {
                var tokenTimeout = UserValidator.GetExpireTimeInSeconds();
                var authentication = Newtonsoft.Json.JsonConvert.DeserializeObject<Authentication>(data);
                if (!userId.Equals(authentication.UserId))
                {
                    result = TokenValidationStatus.InvalidUser;
                }
                else
                if (tokenTimeout > 0 && DateTime.UtcNow >= authentication.Date.AddSeconds(tokenTimeout))
                {
                    result = TokenValidationStatus.Expired;
                }
                else
                {
                    result = TokenValidationStatus.Valid;
                }
                var lastValidTokenUID = UserValidator.GetLastValidTokenUID(userId);
                if (string.IsNullOrWhiteSpace(lastValidTokenUID))
                {
                    result = TokenValidationStatus.Expired;
                } 
                else
                if (authentication.TokenUID != lastValidTokenUID)
                {
                    result = TokenValidationStatus.Overwiten;
                }
                if (result == TokenValidationStatus.Valid)
                {
                    UserValidator.RefreshToken(userId, UserValidator.GetExpireTimeInSeconds());
                }
            }
            catch (Exception)
            {
                throw new NotAuthenticatedException("Invalid authorization data.");
            }
            return result;
        }

        private byte[] EncryptString(string plainText, byte[] Key, byte[] IV)
        {
            // Check arguments.
            if (plainText == null || plainText.Length <= 0)
                throw new ArgumentNullException("plainText");
            if (Key == null || Key.Length <= 0)
                throw new ArgumentNullException("Key");
            if (IV == null || IV.Length <= 0)
                throw new ArgumentNullException("IV");
            byte[] encrypted;
            // Create an RijndaelManaged object
            // with the specified key and IV.
            using (RijndaelManaged rijAlg = new RijndaelManaged())
            {
                rijAlg.Key = Key;
                rijAlg.IV = IV;

                // Create a decrytor to perform the stream transform.
                ICryptoTransform encryptor = rijAlg.CreateEncryptor(rijAlg.Key, rijAlg.IV);

                // Create the streams used for encryption.
                using (MemoryStream msEncrypt = new MemoryStream())
                {
                    using (CryptoStream csEncrypt = new CryptoStream(msEncrypt, encryptor, CryptoStreamMode.Write))
                    {
                        using (StreamWriter swEncrypt = new StreamWriter(csEncrypt))
                        {

                            //Write all data to the stream.
                            swEncrypt.Write(plainText);
                        }
                        encrypted = msEncrypt.ToArray();
                    }
                }
            }

            // Return the encrypted bytes from the memory stream.
            return encrypted;
        }

        private string DecryptString(string text, byte[] Key, byte[] IV)
        {
            var cipherText = Convert.FromBase64String(text);
            // Check arguments.
            if (cipherText == null || cipherText.Length <= 0)
                throw new ArgumentNullException("cipherText");
            if (Key == null || Key.Length <= 0)
                throw new ArgumentNullException("Key");
            if (IV == null || IV.Length <= 0)
                throw new ArgumentNullException("IV");

            // Declare the string used to hold
            // the decrypted text.
            string plaintext = null;

            // Create an RijndaelManaged object
            // with the specified key and IV.
            using (RijndaelManaged rijAlg = new RijndaelManaged())
            {
                rijAlg.Key = Key;
                rijAlg.IV = IV;

                // Create a decrytor to perform the stream transform.
                ICryptoTransform decryptor = rijAlg.CreateDecryptor(rijAlg.Key, rijAlg.IV);

                // Create the streams used for decryption.
                using (MemoryStream msDecrypt = new MemoryStream(cipherText))
                {
                    using (CryptoStream csDecrypt = new CryptoStream(msDecrypt, decryptor, CryptoStreamMode.Read))
                    {
                        using (StreamReader srDecrypt = new StreamReader(csDecrypt))
                        {
                            // Read the decrypted bytes from the decrypting stream
                            // and place them in a string.
                            plaintext = srDecrypt.ReadToEnd();
                        }
                    }
                }
            }
            return plaintext;
        }
    }
}