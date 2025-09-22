document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('userToken');
    if (!token) {
        window.location.href = '/login.html';
        return;
    }
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        document.getElementById('colab-nome').textContent = payload.nome;
        const nomesSetores = { 1: 'Administrativo', 2: 'Comercial', 3: 'Operacional' };
        document.getElementById('modulo').textContent = nomesSetores[payload.setor] || 'Setor';

        carregarConteudoPrincipal(payload.setor);

    } catch (e) {

    }
});

async function carregarConteudoPrincipal(setor) {
    const mainContent = document.querySelector('main');
    if (!mainContent) return;

    switch (setor) {
        case 1:

            const response = await fetch('/adm/inicio.html');
            mainContent.innerHTML = await response.text();


            const scriptAdmin = document.createElement('script');
            scriptAdmin.src = '/js/admin.js';
            document.body.appendChild(scriptAdmin);
            break;
        default:
            mainContent.innerHTML = `<div class="p-5"><h1>Bem-vindo!</h1></div>`;
            break;
    }
}
document.addEventListener('DOMContentLoaded', () => {

    const botaoLogout = document.getElementById('btn-logout');

    if (botaoLogout) {

        botaoLogout.addEventListener('click', (e) => {
            e.preventDefault();


            if (confirm('Tem certeza que deseja encerrar a sessão?')) {


                localStorage.removeItem('userToken');


                window.location.href = '/login.html';
            }
        });
    }
});