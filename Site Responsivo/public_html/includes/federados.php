<?php
// Configuração do banco de dados
$base_dir = __DIR__;
require $base_dir . '/config.php';

// Configurar o cabeçalho para JSON
header('Content-Type: application/json');

// Verificar o método da requisição
$method = $_SERVER['REQUEST_METHOD'];

// Função para enviar resposta em JSON
function sendResponse($status, $data) {
    http_response_code($status);
    echo json_encode($data);
    exit;
}


switch ($method) { 
    case 'GET': 
        if (isset($_GET['id'])) { 
            $atleta_id = $_GET['id'];

            // Prepara e executa a consulta
            $stmt = $conn->prepare("SELECT * FROM cad_equipes WHERE id = ?");
            $stmt->bind_param("s", $atleta_id);
            $stmt->execute();
            $result = $stmt->get_result();

            if ($result->num_rows > 0) {
                $atleta = $result->fetch_assoc();
                sendResponse(200, ["success" => true, "data" => $atleta]);
            } else {
                sendResponse(404, ["success" => false, "message" => "Equipe não encontrada."]);
            }

            $stmt->close();
        } else {
            $query = "SELECT
                    cu.id,
                    cu.nome_user,
                    cu.apelido_user,
                    cu.numero_federacao_user,
                    fu.status_filiacao,
                    fu.dt_fim_vigencia,
                CASE 
                    WHEN fu.status_filiacao = 0 THEN 'INATIVO'
                    WHEN fu.status_filiacao = 1 THEN 'ATIVO'
                    WHEN fu.status_filiacao = 2 THEN 'PENDENTE'
                END AS STATUS_FILIACAO
                FROM
                    cad_user cu
                JOIN
                    filiacao_user fu ON fu.id_user = cu.id
                ORDER BY cu.numero_federacao_user ASC";  
            $result = $conn->query($query);
            if ($result) {
                $atletas = $result->fetch_all(MYSQLI_ASSOC);

            // Função para formatar a data, se existir e for válida
            function formatarData($data) {
                if (!empty($data) && strtotime($data)) {
                    return date("d/m/Y", strtotime($data)); // 'Y' para 4 dígitos no ano
                } else {
                    return '*';
                }
            }

            // Formatar a data de validade
            foreach ($atletas as &$atleta) {
                $atleta['dt_fim_vigencia'] = formatarData($atleta['dt_fim_vigencia']);
            }

                sendResponse(200, $atletas);
            } else {
                sendResponse(500, ["message" => "Erro ao executar consulta."]);
            }
        }
        break;
};

