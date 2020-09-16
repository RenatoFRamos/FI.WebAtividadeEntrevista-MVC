
var beneficiarios = [];

$(document).ready(function() {
    beneficiarios = [];
    $('#formCadastro').submit(function(e) {
        e.preventDefault();
        $.ajax({
            url: urlPost,
            method: "POST",
            data: {
                "NOME": $(this).find("#Nome").val(),
                "CEP": $(this).find("#CEP").val(),
                "Email": $(this).find("#Email").val(),
                "Sobrenome": $(this).find("#Sobrenome").val(),
                "Nacionalidade": $(this).find("#Nacionalidade").val(),
                "Estado": $(this).find("#Estado").val(),
                "Cidade": $(this).find("#Cidade").val(),
                "Logradouro": $(this).find("#Logradouro").val(),
                "Telefone": $(this).find("#Telefone").val(),
                "CPF": $(this).find("#CPF").val(),
                "Beneficiarios": beneficiarios
            },
            error:
                function(r) {
                    if (r.status == 400)
                        ModalDialog("Ocorreu um erro", r.responseJSON);
                    else if (r.status == 500)
                        ModalDialog("Ocorreu um erro", "Ocorreu um erro interno no servidor.");
                },
            success:
                function(r) {
                    ModalDialog("Sucesso!", r);
                    $("#formCadastro")[0].reset();
                }
        });
    });
    $("#CPF").mask('000.000.000-00');

    $('#btn-beneficiarios').click(function(e) {
        e.preventDefault();


        $.post("Beneficiarios", "").done(function(res) {
            $('body').append(res);

            $('#benefi').modal('show');

            $('#btn-incluir-beneficiario').click(function(e) {
                e.preventDefault();
                if (($("#BeCPF").val() != "") && ($("#BeNome").val() != "")) {
                    if (validarCPF($("#BeCPF").val())) {
                        if (!beneficiariosAlt.some(item => item.CPF === $("#BeCPF").val())) {
                            beneficiariosAlt.push({ "CPF": $("#BeCPF").val(), "Nome": $("#BeNome").val() });
                            printGridBeneficiarios();
                            $("#BeCPF").val("");
                            $("#BeNome").val("");
                        } else
                            ModalDialog("CPF Repetido!", $("#BeCPF").val());
                    }
                    else
                        ModalDialog("CPF Inválido!", $("#BeCPF").val());
                }
            });

            $("#BeCPF").mask('000.000.000-00');
        });
    });
});

function validarCPF(cpf) {
    cpf = cpf.replace(/[^\d]+/g, '');
    if (cpf == '') return false;
    // Elimina CPFs invalidos conhecidos	
    if (cpf.length != 11 ||
        cpf == "00000000000" ||
        cpf == "11111111111" ||
        cpf == "22222222222" ||
        cpf == "33333333333" ||
        cpf == "44444444444" ||
        cpf == "55555555555" ||
        cpf == "66666666666" ||
        cpf == "77777777777" ||
        cpf == "88888888888" ||
        cpf == "99999999999")
        return false;
    // Valida 1o digito	
    add = 0;
    for (i = 0; i < 9; i++)
        add += parseInt(cpf.charAt(i)) * (10 - i);
    rev = 11 - (add % 11);
    if (rev == 10 || rev == 11)
        rev = 0;
    if (rev != parseInt(cpf.charAt(9)))
        return false;
    // Valida 2o digito	
    add = 0;
    for (i = 0; i < 10; i++)
        add += parseInt(cpf.charAt(i)) * (11 - i);
    rev = 11 - (add % 11);
    if (rev == 10 || rev == 11)
        rev = 0;
    if (rev != parseInt(cpf.charAt(10)))
        return false;
    return true;
}

function printGridBeneficiarios() {

    $("#gridBeneficiarios tbody").empty();
    beneficiarios.forEach(function (item, index) {
        $("#gridBeneficiarios tbody").append("<tr><td>" + item.CPF + "</td><td>" + item.Nome + "</td><td> <button type='button' onclick='editarBeneficiarios(\"" + item.CPF + "\", \"" + item.Nome + "\")'  class='btn btn-primary btn-sm'>Editar</button> <button type='button' onclick='deleteBeneficiarios(\"" + item.CPF + "\", \"" + item.Nome + "\")'  class='btn btn-primary btn-sm'>Remover</button></td><tr>");
    });
}

function deleteBeneficiarios(cpf, nome) {
    beneficiarios = beneficiarios.filter(function (value, index, arr) {
        return (value.CPF != cpf || value.Nome != nome);
    });
    printGridBeneficiarios();
}

function editarBeneficiarios(cpf, nome) {
    $("#BeCPF").val(cpf);
    $("#BeNome").val(nome);
    deleteBeneficiarios(cpf, nome);
}



function ModalDialog(titulo, texto) {
    var random = Math.random().toString().replace('.', '');
    var texto = '<div id="' + random + '" class="modal fade">                                                               ' +
        '        <div class="modal-dialog">                                                                                 ' +
        '            <div class="modal-content">                                                                            ' +
        '                <div class="modal-header">                                                                         ' +
        '                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>         ' +
        '                    <h4 class="modal-title">' + titulo + '</h4>                                                    ' +
        '                </div>                                                                                             ' +
        '                <div class="modal-body">                                                                           ' +
        '                    <p>' + texto + '</p>                                                                           ' +
        '                </div>                                                                                             ' +
        '                <div class="modal-footer">                                                                         ' +
        '                    <button type="button" class="btn btn-default" data-dismiss="modal">Fechar</button>             ' +
        '                                                                                                                   ' +
        '                </div>                                                                                             ' +
        '            </div><!-- /.modal-content -->                                                                         ' +
        '  </div><!-- /.modal-dialog -->                                                                                    ' +
        '</div> <!-- /.modal -->                                                                                        ';

    $('body').append(texto);
    $('#' + random).modal('show');
}
