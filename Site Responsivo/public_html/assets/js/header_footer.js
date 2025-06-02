// Versão simplificada
document.addEventListener("DOMContentLoaded", () => {
    const loadComponent = async (id, path) => {
        try {
            const response = await fetch(path);
            if (!response.ok) throw new Error(`Componente ${id} não encontrado`);
            document.getElementById(id).innerHTML = await response.text();
        } catch (error) {
            console.error(`Erro ao carregar ${id}:`, error);
            // Fallback opcional
            document.getElementById(id).innerHTML = `<p>Erro ao carregar ${id}</p>`;
        }
    };

    // Caminhos relativos corrigidos ▼
    loadComponent('header', './assets/components/header.html');
    loadComponent('footer', './assets/components/footer.html');
});