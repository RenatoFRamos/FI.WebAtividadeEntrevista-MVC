using System;
using FI.AtividadeEntrevista.DAL.Beneficiarios;
using System.Collections.Generic;
using System.Linq;
using FI.AtividadeEntrevista.DML;

namespace FI.AtividadeEntrevista.BLL
{
    public class BoCliente
    {
       /// <summary>
       /// 
       /// </summary>
       /// <param name="cliente"></param>
       /// <returns>Retorna "OK" para sucesso</returns>
        public string Incluir(DML.Cliente cliente)
        {
            string regras = RegraIncluir(cliente.CPF);

            if (!regras.Equals("OK"))
                return regras;

            DAL.DaoCliente cli = new DAL.DaoCliente();
            long id = cli.Incluir(cliente);

            if (cliente.Beneficiarios.Any())
            {
                cliente.Beneficiarios.ForEach(i => i.IdCliente = id);
            }
            IncluirBeneficiarios(cliente.Beneficiarios);

            return "OK";
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="cliente"></param>
        /// <returns>Retorna "OK" para sucesso</returns>
        public string Alterar(DML.Cliente cliente)
        {
            string regras = RegraAlterar(cliente.Id, cliente.CPF);
            if (!regras.Equals("OK"))
                return regras;

            DAL.DaoCliente cli = new DAL.DaoCliente();
            cli.Alterar(cliente);

            if (cliente.Beneficiarios.Count() > 0)
            {
                cliente.Beneficiarios.ForEach(i => i.IdCliente = cliente.Id);
                IncluirBeneficiarios(cliente.Beneficiarios);
            }

            return "OK";
        }

        /// <summary>
        /// Consulta o cliente pelo id
        /// </summary>
        /// <param name="id">id do cliente</param>
        /// <returns></returns>
        public DML.Cliente Consultar(long id)
        {
            DAL.DaoCliente cli = new DAL.DaoCliente();
            DaoBeneficiario daoBeneficiario = new DaoBeneficiario();
            Cliente c = cli.Consultar(id);

            c.Beneficiarios = daoBeneficiario.Consultar(c.Id);

            return c;
        }

        /// <summary>
        /// Excluir o cliente pelo id
        /// </summary>
        /// <param name="id">id do cliente</param>
        /// <returns></returns>
        public void Excluir(long id)
        {
            DAL.DaoCliente cli = new DAL.DaoCliente();
            cli.Excluir(id);
        }

        /// <summary>
        /// Lista os clientes
        /// </summary>
        public List<DML.Cliente> Listar()
        {
            DAL.DaoCliente cli = new DAL.DaoCliente();
            return cli.Listar();
        }

        /// <summary>
        /// Lista os clientes
        /// </summary>
        public List<DML.Cliente> Pesquisa(int iniciarEm, int quantidade, string campoOrdenacao, bool crescente, out int qtd)
        {
            DAL.DaoCliente cli = new DAL.DaoCliente();
            return cli.Pesquisa(iniciarEm, quantidade, campoOrdenacao, crescente, out qtd);
        }

        /// <summary>
        /// VerificaExistencia
        /// </summary>
        /// <param name="CPF"></param>
        /// <returns></returns>
        public bool VerificarExistencia(string CPF)
        {
            DAL.DaoCliente cli = new DAL.DaoCliente();
            return cli.VerificarExistencia(CPF);
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="id"></param>
        /// <param name="CPF"></param>
        /// <returns>Retorna FALSE caso encontre o CPF em um ID diferente do seu próprio ID</returns>
        public bool VerificarExistencia(long id, string CPF)
        {
            DML.Cliente cliente = Consultar(id);

            if (CPF == cliente.CPF)
                return false;
            else
            {
                DAL.DaoCliente cli = new DAL.DaoCliente();
                return cli.VerificarExistencia(CPF);
            }
        }

        private string RegraIncluir(string CPF)
        {
            if (VerificarExistencia(CPF))
                return "Este CPF já está sendo usado!";

            return "OK";
        }

        private string RegraAlterar(long id, string CPF)
        {
            if (VerificarExistencia(id, CPF))
                return "Este CPF já está sendo usado!";

            return "OK";
        }

        private void IncluirBeneficiarios(List<Beneficiario> beneficiarios)
        {
            DaoBeneficiario daoBe = new DaoBeneficiario();

            daoBe.Excluir(beneficiarios.FirstOrDefault().IdCliente);

            foreach (Beneficiario be in beneficiarios)
            {
                daoBe.Incluir(be);
            }
        }
    }
}
