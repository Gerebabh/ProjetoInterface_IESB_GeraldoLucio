<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require __DIR__ . '/../vendor/autoload.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $token = $_POST['recaptcha_token'] ?? '';
    if (!$token) {
        echo json_encode(['status' => 'erro', 'mensagem' => 'reCAPTCHA não enviado.']);
        exit;
    }

    $secretKeyyy = 'REMOVIDO';
    $response = file_get_contents("https://www.google.com/recaptcha/api/siteverify?secret={$secretKey}&response={$token}");
    $data = json_decode($response, true);

    if (!$data['success'] || $data['score'] < 0.5) {
        echo json_encode(['status' => 'erro', 'mensagem' => 'Verificação reCAPTCHA falhou.']);
        exit;
    }

    $nome = $_POST['nome'] ?? '';
    $email = $_POST['email'] ?? '';
    $telefone = $_POST['telefone'] ?? '';
    $titulo = $_POST['titulo'] ?? '';
    $motivo = $_POST['motivoContato'] ?? '';
    $mensagem = $_POST['mensagem'] ?? '';

    $mail = new PHPMailer(true);
    try {
        $mail->isSMTP();
        $mail->Host = 'email-ssl.com.br';
        $mail->SMTPAuth = true;
        $mail->Username = 'REMOVIDO';
        $mail->Password = 'REMOVIDO';
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
        $mail->Port = 465;
        $mail->CharSet = 'UTF-8';

        $mail->setFrom('site@fpemg.com.br', 'FPEMG - Contato Site');
        $mail->addAddress('contato@fpemg.com.br');
        
        $mail->isHTML(true);
        $mail->Subject = $titulo ?: 'Contato pelo site FPEMG';
        $mail->Body = "<strong>Nome:</strong> {$nome}<br><strong>Email:</strong> {$email}<br><strong>Telefone:</strong> {$telefone}<br><strong>Motivo:</strong> {$motivo}<br><strong>Mensagem:</strong><br>" . nl2br(htmlspecialchars($mensagem));
        $mail->AltBody = "Nome: {$nome}\nEmail: {$email}\nTelefone: {$telefone}\nMotivo: {$motivo}\nMensagem:\n{$mensagem}";

        $mail->send();
        echo json_encode(['status' => 'ok', 'mensagem' => 'Mensagem enviada com sucesso.']);
    } catch (Exception $e) {
        echo json_encode(['status' => 'erro', 'mensagem' => "Erro ao enviar e-mail: {$mail->ErrorInfo}"]);
    }
} else {
    http_response_code(403);
    echo json_encode(['status' => 'erro', 'mensagem' => 'Acesso inválido']);
}
