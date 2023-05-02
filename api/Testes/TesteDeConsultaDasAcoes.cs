using Microsoft.VisualStudio.TestTools.UnitTesting;
using System;
using System.Collections.Generic;
using System.Text;
using stockapi;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Primitives;

namespace Testes
{
    [TestClass]
    public class TesteDeConsultaDasAcoes
    {
        [TestMethod]
        public void Testar()
        {
            var myConfiguration = new Dictionary<string, string>
            {
                { "IEXCloudToken", "pk_933f91fadb1d43e49863915eb48b849e" }
            };

            var configurationBuilder = new ConfigurationBuilder();
            IConfiguration configuration = configurationBuilder.AddInMemoryCollection(myConfiguration).Build();

            IConsultaDeAcao client = new ConsultaDeAcaoIEXCloud(configuration);
            var valorAtualizado = client.GetValorAtualizado("aapl");
        }
    }

    public class ConfigurationForTests : IConfiguration
    {
        public string this[string key] { 
            get => throw new NotImplementedException(); 
            set => throw new NotImplementedException(); 
        }

        public IEnumerable<IConfigurationSection> GetChildren()
        {
            throw new NotImplementedException();
        }

        public IChangeToken GetReloadToken()
        {
            throw new NotImplementedException();
        }

        public IConfigurationSection GetSection(string key)
        {
            throw new NotImplementedException();
        }
    }
}
