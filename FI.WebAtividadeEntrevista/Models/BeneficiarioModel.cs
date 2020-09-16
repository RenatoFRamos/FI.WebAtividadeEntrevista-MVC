using System.ComponentModel.DataAnnotations;

namespace WebAtividadeEntrevista.Models
{
    public class BeneficiarioModel
    {
        [MaxLength(14)]
        [Required(ErrorMessage = "CPF obrigatório")]
        [CustomValidationCPF(ErrorMessage = "CPF inválido")]
        public string CPF { get; set; }

        [Required(ErrorMessage = "Nome obrigatório")]
        public string Nome { get; set; }
        public long IdCliente { get; set; }
    }
}