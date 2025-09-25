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
    const sucessoModal = new bootstrap.Modal(document.getElementById('sucessoModal'));

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

    formLocalidade.addEventListener('submit', async (e) => {
        e.preventDefault();
        const resposta = formLocalidade.querySelector('input[name="local"]:checked');
        if (!resposta) {
            alert("Por favor, selecione uma opção de localidade.");
            return;
        }
        const token = localStorage.getItem('userToken');
        const payload = JSON.parse(atob(token.split('.')[1]));
        const colaboradorId = payload.id;
        const dados = {
            localidade: resposta.value,
            colaboradorId: colaboradorId
        };
        try {
            const response = await fetch('/api/colaboradores/localidade', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dados)
            });
            const result = await response.json();
            if (response.ok) {
                const item = {
                    valor: resposta.value,
                    timestamp: new Date().getTime()
                };
                localStorage.setItem('localidadeRespondida', JSON.stringify(item));
                localidadeModal.hide();
                document.getElementById('sucessoMensagem').innerText = result.mensagem;
                sucessoModal.show();
            } else {
                alert(result.mensagem);
            }
        } catch (error) {
            console.error("Erro na requisição:", error);
            alert("Falha na conexão com o servidor.");
        }
    });

    localidadeModalEl.addEventListener('hide.bs.modal', () => {
        if (!localStorage.getItem('localidadeRespondida')) {
            setTimeout(() => {
                localidadeModal.show();
            }, 3000);
        }
    });

    verificarQuestionarioLocalidade();

    const botaoLogout = document.getElementById('btn-logout');
    if (botaoLogout) {
        botaoLogout.addEventListener('click', (e) => {
            e.preventDefault();
            if (confirm('Tem certeza que deseja encerrar a sessão?')) {
                localStorage.removeItem('userToken');
                localStorage.removeItem('localidadeRespondida');
                window.location.href = '/login.html';
            }
        });
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
            mainContent.innerHTML = `<div class="p-5"><h1>Bem-vindo!</h1><p>Aproveite a plataforma.</p></div>`;
            break;
    }
}