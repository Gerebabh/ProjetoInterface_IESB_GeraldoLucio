
<?php
// Configuração do banco de dados
$base_dir = __DIR__;
require $base_dir . '/config.php';
$sql = "SELECT id, pergunta, resposta FROM cad_duvida WHERE status = '1' ORDER BY ordem ASC";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    echo "<div class='accordion' id='accordionExample'>";
    
    while($row = $result->fetch_assoc()) {
        
        $resposta = $row["resposta"]; // se o conteúdo já está em HTML vindo do TinyMCE

        echo "<div class='accordion-item'>
                <h3 class='accordion-header'>
                    <button class='accordion-button' type='button' data-bs-toggle='collapse' data-bs-target='#collapse" . $row["id"] . "' aria-expanded='false' aria-controls='collapse" . $row["id"] . "'>" . $row["pergunta"] . "</button>
                </h3>
                <div id='collapse" . $row["id"] . "' class='accordion-collapse collapse' data-bs-parent='#accordionExample'>
                    <div class='accordion-body'>" . $resposta. "</div>
                </div>
            </div>";
    }
    
    echo "</div>";
} else {
    echo "<p>Nenhuma resposta ativa encontrada.</p>";
}

$conn->close();
?>
