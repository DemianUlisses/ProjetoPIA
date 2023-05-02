using framework;
using Microsoft.Extensions.Configuration;

namespace stockapi
{
    public class ConsultaDeAcaoIEXCloud : IConsultaDeAcao
    {
        private string _url = "https://cloud.iexapis.com/stable/stock/{0}/quote?token={1}";

        private string _token = null;

        public ConsultaDeAcaoIEXCloud(IConfiguration configuration)
        {
            _token = configuration.GetValue<string>("IEXCloudToken");
        }

        public virtual ValorAtualizado GetValorAtualizado(string simbolo)
        {
            var result = default(ValorAtualizado);

            var communicationParameters = new CommunicationParameters()
            {
                IgnoreCertificateErrors = true,
                ReceiveTimetout = 20000,
                SendTimeout = 20000,
                UseDefaultProxy = true,
            };
            var webRequestParams = new WebRequestParams()
            {
                Accept = "application/json",
                ContentType = "application/json",
                Method = "GET",
                Url = string.Format(_url, simbolo, _token)
            };

            WebRequestHelper.Execute(
                communicationParameters,
                webRequestParams,
                new WebRequestHeaders(),
                null,
                (response) =>
                {
                    var quote = Newtonsoft.Json.JsonConvert.DeserializeObject<Quote>(response);
                    result = new ValorAtualizado()
                    {
                        Valor = quote.latestPrice,
                    };
                }
            );

            return result;
        }
    }

    public class Quote
    {
        public string symbol { get; set; }
        public string companyName { get; set; }
        public string primaryExchange { get; set; }
        public string calculationPrice { get; set; }
        public decimal? open { get; set; }
        public long? openTime { get; set; }
        public string openSource { get; set; }
        public decimal? close { get; set; }
        public long? closeTime { get; set; }
        public string closeSource { get; set; }
        public decimal? high { get; set; }
        public long? highTime { get; set; }
        public string highSource { get; set; }
        public decimal? low { get; set; }
        public long? lowTime { get; set; }
        public string lowSource { get; set; }
        public decimal? latestPrice { get; set; }
        public string latestSource { get; set; }
        public string latestTime { get; set; }
        public long? latestUpdate { get; set; }
        public int? latestVolume { get; set; }
        public decimal? iexRealtimePrice { get; set; }
        public int? iexRealtimeSize { get; set; }
        public long? iexLastUpdated { get; set; }
        public decimal? delayedPrice { get; set; }
        public long? delayedPriceTime { get; set; }
        public decimal? oddLotDelayedPrice { get; set; }
        public long? oddLotDelayedPriceTime { get; set; }
        public decimal? extendedPrice { get; set; }
        public decimal? extendedChange { get; set; }
        public decimal? extendedChangePercent { get; set; }
        public long? extendedPriceTime { get; set; }
        public decimal? previousClose { get; set; }
        public int? previousVolume { get; set; }
        public decimal? change { get; set; }
        public decimal? changePercent { get; set; }
        public int? volume { get; set; }
        public decimal? iexMarketPercent { get; set; }
        public int? iexVolume { get; set; }
        public int? avgTotalVolume { get; set; }
        public int? iexBidPrice { get; set; }
        public int? iexBidSize { get; set; }
        public int? iexAskPrice { get; set; }
        public int? iexAskSize { get; set; }
        public decimal? iexOpen { get; set; }
        public long? iexOpenTime { get; set; }
        public decimal? iexClose { get; set; }
        public long? iexCloseTime { get; set; }
        public long? marketCap { get; set; }
        public decimal? peRatio { get; set; }
        public decimal? week52High { get; set; }
        public decimal? week52Low { get; set; }
        public decimal? ytdChange { get; set; }
        public long? lastTradeTime { get; set; }
        public bool? isUSMarketOpen { get; set; }
    }
}