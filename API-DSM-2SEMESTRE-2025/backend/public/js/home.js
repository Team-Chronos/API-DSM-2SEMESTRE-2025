var token;
var payload;

const main = document.querySelector('main');

function decodeJwt(token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
        atob(base64)
            .split('')
            .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
            .join('')
    );
    return JSON.parse(jsonPayload);
}

document.addEventListener('DOMContentLoaded', () => {
    token = localStorage.getItem('userToken');
    if (!token) {
        window.location.href = '/login.html';
        return;
    }
    try {
        payload = decodeJwt(token);
        document.getElementById('colab-nome').textContent = payload.nome;
        const nomesSetores = { 1: 'Administrativo', 2: 'Comercial', 3: 'Operacional' };
        document.getElementById('modulo').textContent = nomesSetores[payload.setor] || 'Setor';

        carregarConteudoSetor(payload.setor);

    } catch (e) {

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

    document.querySelectorAll('#barra-lateral > nav > ul > li').forEach((li) => {
        if (li.id !== 'btn-logout') {
            li.addEventListener('click', () => {
                carregarConteudo(li.id)
            })
        }
    })
});

async function carregarConteudo(conteudo) {
    if (!main) return;

    main.innerHTML = ''
    removerScript('script-dinamico')

    switch (conteudo) {
        case 'inicio':
            carregarConteudoSetor(payload.setor);
        break;

        case 'notificacoes':
            main.innerHTML = '';
            adicionarScript('/js/notificacao.js', 'script-dinamico');
        break;

        case 'certificados':
            main.innerHTML = '';
            adicionarScript('/js/certificado.js', 'script-dinamico');
        break;
    }
}

function removerScript(id) {
    const old = document.getElementById(id);
    if (old) old.remove();
}

function adicionarScript(src, id) {

    if (document.getElementById(id)) return;

    const script = document.createElement('script');
    script.src = src;
    script.id = id;
    document.body.appendChild(script);
}
async function carregarConteudoSetor(setor) {
    if (!main) return;

    switch (setor) {
        case 1:
            const response = await fetch('/adm/inicio.html');
            main.innerHTML = await response.text();

            adicionarScript('/js/admin.js', 'script-dinamico');
            break;
        default:
            main.innerHTML = `<div class="p-5"><h1>Bem-vindo!</h1></div>`;
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