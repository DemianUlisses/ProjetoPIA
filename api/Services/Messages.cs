namespace api
{
    public class Mensagens
    {
        public Cfg Cfg { get; set; }

        public Mensagens(Cfg  cfg)
        {
            this.Cfg = cfg;
        }

        public string Get(messages.Message mensagem)
        {
            var result = Cfg.MessageControl.GetMessage(mensagem);
            return result;
        }
    }
}