using System;
using System.Collections.Generic;
using System.IO;
using System.Net;
using System.Text;

namespace framework
{
    public class WebRequestHelper
    {
        public static void Execute (CommunicationParameters communicationParameters,
            WebRequestParams webRequestParams, WebRequestHeaders headers,
            string content, Action<string> handler)
        {
            var response = default(WebResponse);
            var httpRequest = CreateWebRequest(communicationParameters, webRequestParams, headers);
            if (!string.IsNullOrEmpty(content))
            {
                InsertContentInWebRequest(httpRequest, content);
            }
            response = httpRequest.GetResponse();
            var responseText = GetResponseStreamAsText(response);
            handler(responseText);
        }

        private static string GetResponseStreamAsText(WebResponse response)
        {
            using(var reader = new StreamReader(response.GetResponseStream()))
            {
                var result = reader.ReadToEnd();
                return result;
            }
        }

        private static void InsertContentInWebRequest(WebRequest httpRequest, string content)
        {
            using(var stream = httpRequest.GetRequestStream())
            {
                var contentStream = new MemoryStream(Encoding.UTF8.GetBytes(content));
                contentStream.WriteTo(stream);
            }
        }

        private static HttpWebRequest CreateWebRequest(
            CommunicationParameters communicationParameters,
            WebRequestParams webRequestParams,
            WebRequestHeaders headers)
        {
            if ((communicationParameters == null) || (communicationParameters.IgnoreCertificateErrors)){
                ServicePointManager.ServerCertificateValidationCallback = 
                    (s, c, chain, sslPolice) => true;
            }

            var webRequest = (HttpWebRequest)WebRequest.Create(webRequestParams.Url);
            webRequest.ContentType = webRequestParams.ContentType;
            webRequest.Accept = webRequestParams.Accept;
            webRequest.Method = webRequestParams.Method;

            if (communicationParameters != null)
            {
                webRequest.Timeout = communicationParameters.ReceiveTimetout;
                webRequest.ReadWriteTimeout = communicationParameters.SendTimeout;
            }

            if ((communicationParameters != null) && (communicationParameters.UseDefaultProxy))
            {
                webRequest.Proxy.Credentials = CredentialCache.DefaultCredentials;
            }

            if (headers != null)
            {
                foreach(var header in headers.Headers)
                {
                    webRequest.Headers.Add(header.Name, header.Value);
                }
            }

            return webRequest;
        }
    }

    public class CommunicationParameters
    {
        public bool IgnoreCertificateErrors { get;  set; }
        public int ReceiveTimetout { get;  set; }
        public int SendTimeout { get;  set; }
        public bool UseDefaultProxy { get; set; }
    }

    public class WebRequestParams
    {
        public string Url { get; set; }
        public string ContentType { get; set; }
        public string Accept { get; set; }
        public string Method { get; set; }
    }


    public class WebRequestHeaders
    {
        public WebRequestHeader[] Headers { get; set; }

        public WebRequestHeaders(params WebRequestHeader[] headers)
        {
            Headers = headers;
        }
    }

    public class WebRequestHeader
    {
        public string Name { get; set; }
        public string Value { get; set; }

        public WebRequestHeader(string name, string value)
        {
            this.Name = name;
            this.Value = value;
        }
    }
}
