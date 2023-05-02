using ojogodabolsa;
using data;
using Microsoft.AspNetCore.Mvc;
using System;
using System.IO;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;

namespace api.Controllers
{
    [ApiController]
    [Route("arquivo")]
    public class ArquivoController : ControllerBase
    {
        private Repository<Arquivo> ArquivoRepository;

        public ArquivoController(Repository<Arquivo> arquivoRepository)
        {
            ArquivoRepository = arquivoRepository;
        }

        [HttpPost]
        public virtual Arquivo Post(UploadDeArquivo uploadFileRequest)
        {
            var arquivo = new Arquivo()
            {
                Nome = "",
                Tipo = uploadFileRequest.Tipo,
            };

            ArquivoRepository.Insert(arquivo);

            string fileName = MontarNomeDoArquivo(arquivo);
            var index = uploadFileRequest.Base64.Substring(0, 50).IndexOf(",");
            var startIndex = 0;
            if (index > -1)
            {
                startIndex = index + 1;
            }
            var length = uploadFileRequest.Base64.Length - startIndex;

            System.IO.File.WriteAllBytes(
                fileName,
                Convert.FromBase64String(uploadFileRequest.Base64.Substring(startIndex, length))
            );

            ArquivoRepository.Update(arquivo);

            var baseUrl = new Uri(Cfg.Url);
            var url = new Uri(baseUrl, string.Format("{0}/{1}", "arquivo", arquivo.Nome));
            
            return arquivo;
        }

        [HttpGet("{nome}")]
        public virtual Stream Get(string nome)
        {
            var id = long.Parse(Path.GetFileNameWithoutExtension(nome));
            var arquivo = ArquivoRepository.Get(id);
            var caminhoDoArquivo = MontarNomeDoArquivo(arquivo);
            var nomeDoArquivo = string.Format("{0}.{1}", arquivo.Id, GetExtensao(arquivo.Tipo));
            var bytes = System.IO.File.ReadAllBytes(caminhoDoArquivo);
            var stream = new FileStream(caminhoDoArquivo, FileMode.Open);
            stream.Seek(0, SeekOrigin.Begin);        
            return stream;
        }

        protected virtual string MontarNomeDoArquivo(Arquivo arquivo)
        {
            arquivo.Nome = string.Format("{0}.{1}", arquivo.Id, GetExtensao( arquivo.Tipo));
            var fileName = Path.Combine(Cfg.DiretorioParaArmazenamentoDeArquivos, arquivo.Nome);
            return fileName;
        }

        protected virtual string GetExtensao(string tipo)
        {
            var result = ".unknown";
            if (!string.IsNullOrWhiteSpace(tipo))
            {
                var str = tipo.Split("/");
                if (str.Length > 1)
                {
                    result = str[1];
                }
                else
                {
                    result = str[1];
                }
            }
            return result;
        }
    }

    public class UploadDeArquivo
    {
        public string Tipo { get; set; }
        public string Base64 { get; set; }
    }
}
