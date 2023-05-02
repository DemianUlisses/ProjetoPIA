using ojogodabolsa;

namespace api.Dtos
{
    public class PaisDto
    {
        public long Id { get; set; }
        public string Nome { get; set; }

        public static PaisDto Build(Pais item)
        {
            if (item == null)
            {
                return null;
            }
            var result = new PaisDto()
            {
                Id = item.Id,
                Nome = item.Nome,
            };
            return result;
        }
    }
}
