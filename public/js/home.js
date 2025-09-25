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
        console.error('Token inválido:', e);
        localStorage.removeItem('userToken');
        window.location.href = '/login.html';
    }

    const localidadeModalEl = document.getElementById('localidadeModal');
    const localidadeModal = new bootstrap.Modal(localidadeModalEl);
    const formLocalidade = document.getElementById('formLocalidade');

    const verificarQuestionarioLocalidade = () => {
        const itemSalvoString = localStorage.getItem('localidadeRespondida');
        if (!itemSalvoString) {
            setTimeout(() => { localidadeModal.show(); }, 1500);
            return;
        }
        const itemSalvo = JSON.parse(itemSalvoString);
        const tempoAtual = new Date().getTime();
        const umDia = 24 * 60 * 60 * 1000;
        if ((tempoAtual - itemSalvo.timestamp) > umDia) {
            localStorage.removeItem('localidadeRespondida');
            setTimeout(() => { localidadeModal.show(); }, 1500);
        }
    };

    formLocalidade.addEventListener('submit', (e) => {
        e.preventDefault();
        const resposta = formLocalidade.querySelector('input[name="local"]:checked');
        if (!resposta) {
            alert("Por favor, selecione uma opção de localidade.");
            return;
        }
        const item = {
            valor: resposta.value,
            timestamp: new Date().getTime()
        };
        localStorage.setItem('localidadeRespondida', JSON.stringify(item));
        localidadeModal.hide();
        const sucessoModal = new bootstrap.Modal(document.getElementById('sucessoModal'));
        document.getElementById('sucessoMensagem').innerText = 'Obrigado por informar sua localidade!';
        sucessoModal.show();
    });

    localidadeModalEl.addEventListener('hide.bs.modal', () => {

        if (!localStorage.getItem('localidadeRespondida')) {
            console.log("Modal de localidade fechado sem resposta. Reabrindo em 3 segundos...");


            setTimeout(() => {
                localidadeModal.show();
            }, 3000);
        }
    });

    verificarQuestionarioLocalidade();
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

document.addEventListener('')