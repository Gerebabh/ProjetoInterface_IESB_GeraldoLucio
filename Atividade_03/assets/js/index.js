document.getElementById('telefone').addEventListener('input', function(e) {
    let input = e.target.value;
    
    // Remove todos os caracteres não numéricos
    input = input.replace(/\D/g, '');

    // Aplica a máscara para o telefone
    if (input.length > 10) {
        input = input.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    } else if (input.length > 6) {
        input = input.replace(/(\d{2})(\d{4})(\d+)/, '($1) $2-$3');
    } else if (input.length > 2) {
        input = input.replace(/(\d{2})(\d+)/, '($1) $2');
    }

    // Atualiza o valor do input
    e.target.value = input;
});


document.getElementById('cpf').addEventListener('input', function(e) {
    let input = e.target.value;

    // Remove todos os caracteres não numéricos
    input = input.replace(/\D/g, '');

    // Aplica a máscara para CPF
    input = input.replace(/(\d{3})(\d)/, '$1.$2') // Primeiro ponto
                 .replace(/(\d{3})(\d)/, '$1.$2') // Segundo ponto
                 .replace(/(\d{3})(\d{1,2})$/, '$1-$2'); // Traço

    // Atualiza o valor do input
    e.target.value = input;
});
