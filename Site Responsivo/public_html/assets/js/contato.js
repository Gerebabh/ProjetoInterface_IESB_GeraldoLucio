document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("formulario-contato");

    form.addEventListener("submit", function (e) {
        e.preventDefault();

        grecaptcha.ready(function () {
            grecaptcha.execute("6LfjnTcrAAAAAIF6j8sw0eplbjhcai-0F7tNgCMA", { action: "contato" }).then(function (token) {
                const formData = new FormData(form);
                formData.append("recaptcha_token", token);

                fetch(form.action, {
                    method: "POST",
                    body: formData
                })
                .then(response => response.json())
                .then(data => {
                    Swal.fire(data.status === "ok" ? "Sucesso" : "Erro", data.mensagem, data.status === "ok" ? "success" : "error");
                    if (data.status === "ok") form.reset();
                })
                .catch(() => {
                    Swal.fire("Erro", "Erro na conexão com o servidor.", "error");
                });
            });
        });     
    });

    // Ajuste do tabindex
    function setTabIndex() {
        const order = window.innerWidth <= 992 
            ? [
                'nome', 'email', 'titulo', 'telefone', 'motivoContato', 'mensagem', 'captcha', 'btn-enviar-email'
            ] 
            : [
                'nome', 'telefone', 'email', 'motivoContato', 'titulo', 'mensagem', 'captcha', 'btn-enviar-email'
            ];

        order.forEach((id, index) => {
            const element = document.getElementById(id);
            if (element) {
                element.setAttribute('tabindex', (index + 1).toString());
            } else {
                console.warn(`Elemento com ID '${id}' não encontrado.`);
            }
        });
    }

    // Chama a função ao carregar a página
    setTabIndex();

    // Adiciona o evento de redimensionamento
    window.addEventListener('resize', setTabIndex);

    const telefone = document.getElementById('telefone');

    telefone.addEventListener('input', function(e) {
        let numero = e.target.value.replace(/\D/g, '');  // Remove tudo que não é dígito

        // Apenas aplica a máscara se a quantidade de dígitos permitir
        if (numero.length <= 11) {
            const regex = /^(\d{2})(\d{4,5})(\d{4})$/; // Regex para capturar o formato

            if (regex.test(numero)) {
                // Aplica a máscara no valor formatado
                e.target.value = `(${numero.replace(regex, '$1')}) ${numero.replace(regex, '$2')}-${numero.replace(regex, '$3')}`;
            } else {
                // Para entradas parciais
                e.target.value = `(${numero.slice(0, 2)}) ${numero.slice(2, 7).padEnd(5, '')}-${numero.slice(7, 11).padEnd(4, '')}`;
            }
        } else {
            // Limita o valor se o número tiver mais de 11 dígitos
            e.target.value = numero.substring(0, 11);
        }
    });
});
