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

    document.querySelectorAll('#barra-lateral > nav > ul > li').forEach((li) => {
        if (li.id !== 'btn-logout') {
            li.addEventListener('click', () => {
                carregarConteudo(li.id)
            })
        }
    })
});

async function carregarConteudo(conteudo) {
    console.log(conteudo)
    if (!main) return;

    main.innerHTML = ''
    removerScript('script-dinamico')

    switch (conteudo) {
        case 'inicio':
            response = await fetch('/adm/inicio.html');
            main.innerHTML = await response.text();
            adicionarScript('/js/admin.js', 'script-dinamico');
            break;

        case 'notificacoes':
           
            main.innerHTML ='';
            adicionarScript('/js/notificacao.js', 'script-dinamico');
            break;
    }
}

function removerScript(id) {
    const old = document.getElementById(id);
    if (old) old.remove();
}

function adicionarScript(src, id) {
    // Se já existe um script com esse id, não adiciona de novo
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