document.addEventListener("DOMContentLoaded", function () {
    const pathPrefix = location.pathname.includes("/pages/") ? ".." : ".";

    // Carregar footer
    const footer = document.getElementById("footer");
    if (footer) {
        fetch(`${pathPrefix}/pages/footer.html`)
            .then(response => {
                if (!response.ok) throw new Error("Erro ao carregar o footer.");
                return response.text();
            })
            .then(data => footer.innerHTML = data)
            .catch(error => console.error("Erro ao carregar o footer:", error));
    }

    // Carregar nav
    const nav = document.getElementById("menu");
    if (nav) {
        fetch(`${pathPrefix}/pages/menu.html`)
            .then(response => {
                if (!response.ok) throw new Error("Erro ao carregar o nav.");
                return response.text();
            })
            .then(data => {
                nav.innerHTML = data;

                // Corrigir os links do menu depois que ele foi carregado
                document.querySelectorAll("a[data-link]").forEach(link => {
                    const relativePath = link.getAttribute("data-link");
                    link.setAttribute("href", `${pathPrefix}/${relativePath}`);
                });

                // Corrigir o caminho da logo
                const logoImg = document.getElementById("logo-img");
                if (logoImg) {
                    logoImg.src = `${pathPrefix}/assets/img/logo.png`;
                }
            })
            .catch(error => console.error("Erro ao carregar o nav:", error));
    }
});
