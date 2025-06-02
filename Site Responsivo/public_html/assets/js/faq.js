document.addEventListener("DOMContentLoaded", function () {
    fetch("./includes/faq.php")
        .then(response => response.text())
        .then(data => {
            document.getElementById("faq-content").innerHTML = data;
        })
        .catch(error => {
            console.error("Erro ao carregar o FAQ:", error);
            document.getElementById("faq-content").innerHTML = "<p>Erro ao carregar as perguntas. Tente novamente mais tarde.</p>";
        });
});
