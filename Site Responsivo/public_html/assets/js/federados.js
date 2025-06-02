$(document).ready(function () {
    const tipoMapStatusFederacao = {
        0: 'Expirada',
        1: 'Ativa',
        2: 'Pendente'
    };

    let atletas = []; // Array para armazenar todos os atletas
    let atletasFiltrados = []; // Array para armazenar os atletas após o filtro de pesquisa
    let paginaAtual = 1;
    const registrosPorPagina = 7; // Defina quantos registros serão mostrados por página
    let orderAsc = true; // Variável para controlar a ordem de classificação

    // Função para carregar todos os atletas
    function carregarAtletas() {
        $.ajax({
            url: './includes/federados.php',
            type: 'GET',
            dataType: 'json',
            success: function (response) {
                atletas = response; // Armazena todos os atletas
                atletasFiltrados = atletas; // Inicialmente, todos os atletas são exibidos
                renderizarTabela();
                atualizarControles();
            },
            error: function (xhr, status, error) {
                Swal.fire({
                    title: 'Erro ao carregar dados dos atletas',
                    text: `Status: ${status}, Erro: ${error}`,
                    icon: 'error'
                });
            }
        });
    }

    // Função para renderizar a tabela com paginação
    function renderizarTabela() {
        const tabela = $('#tabela-atletas');
        tabela.empty(); // Limpa a tabela

        // Calcular os atletas da página atual
        const inicio = (paginaAtual - 1) * registrosPorPagina;
        const fim = Math.min(inicio + registrosPorPagina, atletasFiltrados.length);
        const atletasPaginaMostrar = atletasFiltrados.slice(inicio, fim); // Filtrar os atletas da página atual

        atletasPaginaMostrar.forEach(function (atleta) {
            let linha = `<tr data-id="${atleta.id}">
                <td class="col-nome">${atleta.nome_user.toUpperCase()}</td>
                <td class="col-apelido">${atleta.apelido_user ? atleta.apelido_user.toUpperCase() : ''}</td>
                <td class="col-numero-federado">${atleta.numero_federacao_user}</td>
                <td class="col-status">${tipoMapStatusFederacao[atleta.status_filiacao].toUpperCase()}</td>
                <td class="col-ultimo-vcto">${atleta.dt_fim_vigencia}</td>
            </tr>`;
            tabela.append(linha);
        });
    }

    // Função para atualizar os controles de paginação
    function atualizarControles() {
        const totalPaginas = Math.ceil(atletasFiltrados.length / registrosPorPagina);

        // Exibe ou oculta os botões de acordo com a quantidade de registros
        if (totalPaginas > 1) {
            $('#paginas-atletas').show(); // Mostra os botões se houver mais de uma página
        } else {
            $('#paginas-atletas').hide(); // Oculta os botões se não houver páginas
        }

        $('#btn-anterior-atletas').prop('disabled', paginaAtual === 1); // Desativa o botão "Anterior" se estiver na primeira página
        $('#btn-proximo-atletas').prop('disabled', paginaAtual === totalPaginas); // Desativa o botão "Próximo" se estiver na última página
        $('#numero-pagina-atletas').text(`${paginaAtual} de ${totalPaginas}`); // Atualiza o número da página
    }

    // Eventos de clique para paginação
    $('#btn-anterior-atletas').click(function () {
        if (paginaAtual > 1) {
            paginaAtual--;
            renderizarTabela();
            atualizarControles();
        }
    });

    $('#btn-proximo-atletas').click(function () {
        const totalPaginas = Math.ceil(atletasFiltrados.length / registrosPorPagina);
        if (paginaAtual < totalPaginas) {
            paginaAtual++;
            renderizarTabela();
            atualizarControles();
        }
    });

    // Função para pesquisar na tabela
    $('#campo-pesquisa').on('input', function () {
        const termoPesquisa = $(this).val().toLowerCase(); // Obtém o valor da pesquisa

        // Filtra os atletas com base no termo de pesquisa
        atletasFiltrados = atletas.filter(function (atleta) {
            return (
                atleta.nome_user.toLowerCase().includes(termoPesquisa) ||
                (atleta.apelido_user && atleta.apelido_user.toLowerCase().includes(termoPesquisa)) ||
                atleta.numero_federacao_user.toString().includes(termoPesquisa) ||
                tipoMapStatusFederacao[atleta.status_filiacao].toLowerCase().includes(termoPesquisa) ||
                atleta.dt_fim_vigencia.includes(termoPesquisa) // Adiciona a verificação por data formatada
            );
        });

        // Reinicia para a primeira página e renderiza a tabela novamente
        paginaAtual = 1;
        renderizarTabela();
        atualizarControles();
    });

    // Função para ordenar a tabela
    function sortTable(key) {
        atletasFiltrados.sort((a, b) => {
            let valorA = a[key];
            let valorB = b[key];

            // Converte para número se o campo for numérico
            if (key === 'numero_federacao_user' || key === 'status_filiacao') {
                valorA = Number(valorA);
                valorB = Number(valorB);
            }

            if (valorA < valorB) {
                return orderAsc ? -1 : 1; // Ordem crescente
            }
            if (valorA > valorB) {
                return orderAsc ? 1 : -1; // Ordem decrescente
            }
            return 0; // O mesmo valor
        });

        orderAsc = !orderAsc; // Inverte a ordem para a próxima vez
        renderizarTabela(); // Atualiza a tabela com os dados ordenados
    }

    // Adicionando eventos de clique nos cabeçalhos
    $('#header-nome').on('click', () => sortTable('nome_user'));
    $('#header-apelido').on('click', () => sortTable('apelido_user'));
    $('#header-id').on('click', () => sortTable('numero_federacao_user'));
    $('#header-status').on('click', () => sortTable('status_filiacao'));
    $('#header-vencimento').on('click', () => sortTable('dt_fim_vigencia'));

    // Inicializa o carregamento dos atletas
    carregarAtletas();

});
