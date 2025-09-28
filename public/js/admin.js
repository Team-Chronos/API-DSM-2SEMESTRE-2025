function inicializarAdmin() 
{
    console.log("admin.js carregado e inicializando...");

const tabelaContainer = document.getElementById('lista-colaboradores');
const formCadastro = document.getElementById('formCadastro');
const formEdicao = document.getElementById('formEdicao');
const formEvento = document.getElementById('formEvento');
const formEdicaoEvento = document.getElementById('formEdicaoEvento'); 
const campoPesquisa = document.getElementById('pesquisaAdm');
const filtroSetor = document.getElementById('filtro-setor');
const btnColaboradores = document.getElementById('btn-colaboradores');
const btnEventos = document.getElementById('btn-eventos');
const btnAdicionar = document.getElementById('btn-modal-cad');

const cadColabMod = new bootstrap.Modal(document.getElementById('cadColabMod'));
const edicaoModal = new bootstrap.Modal(document.getElementById('edicaoModal'));
const sucessoModal = new bootstrap.Modal(document.getElementById('sucessoModal'));
const cadEventMod = new bootstrap.Modal(document.getElementById('cadEventMod'));
const edicaoEventoModal = new bootstrap.Modal(document.getElementById('edicaoEventoModal'));

const cpfInputCadastro = document.getElementById('cpf');
const telInputCadastro = document.getElementById('telefone');
const telInputEdicao = document.getElementById('edit-telefone');

const colEventoPesquisa = document.getElementById('pesquisaColEvento')

const getNomeSetor = (setorId) => {
    switch (setorId) {
        case 1: return 'Administrativo';
        case 2: return 'Comercial';
        case 3: return 'Operacional';
        default: return 'Desconhecido';
    }
};

const formatarStringTelefone = (telefoneString) => {
    if (!telefoneString) return 'N/A';
    const digitsOnly = telefoneString.replace(/\D/g, '');
    if (digitsOnly.length !== 11) return telefoneString;
    return `(${digitsOnly.substring(0, 2)}) ${digitsOnly.substring(2, 7)}-${digitsOnly.substring(7)}`;
};

const formatarInputTelefone = (inputElement) => {
    let value = inputElement.value.replace(/\D/g, '');
    value = value.slice(0, 11);
    value = value.replace(/^(\d{2})(\d)/g, '($1) $2');
    value = value.replace(/(\d{5})(\d)/, '$1-$2');
    inputElement.value = value;
};

const filtrarTabela = () => {
    const textoPesquisa = campoPesquisa.value.toLowerCase();
    const setorSelecionado = filtroSetor.value;
    const corpoTabela = document.querySelector("#lista-colaboradores tbody");
    if (!corpoTabela) return;
    const linhas = corpoTabela.getElementsByTagName('tr');
    for (const linha of linhas) {
        const nomeNaLinha = linha.cells[1].textContent.toLowerCase();
        const emailNaLinha = linha.cells[2].textContent.toLowerCase();
        const setorNaLinha = linha.cells[3].textContent;
        const correspondeNome = nomeNaLinha.includes(textoPesquisa);
        const correspondeEmail = emailNaLinha.includes(textoPesquisa);
        const correspondeSetor = (setorSelecionado === "" || setorNaLinha === setorSelecionado);
        if (correspondeSetor && (correspondeNome || correspondeEmail)) {
            linha.style.display = "";
        } else {
            linha.style.display = "none";
        }
    }
};

cpfInputCadastro.addEventListener('input', () => {
    let value = cpfInputCadastro.value.replace(/\D/g, '');
    value = value.slice(0, 11);
    value = value.replace(/(\d{3})(\d)/, '$1.$2');
    value = value.replace(/(\d{3})(\d)/, '$1.$2');
    value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    cpfInputCadastro.value = value;
});

telInputCadastro.addEventListener('input', () => formatarInputTelefone(telInputCadastro));
telInputEdicao.addEventListener('input', () => formatarInputTelefone(telInputEdicao));

const carregarColaboradores = async () => {
    try {
        const response = await fetch('/api/colaboradores');
        const colaboradores = await response.json();
        tabelaContainer.innerHTML = '';
        if (colaboradores.length === 0) {
            tabelaContainer.innerHTML = '<p class="text-center mt-3">Nenhum colaborador cadastrado.</p>';
            return;
        }
        const tabela = document.createElement('table');
        tabela.className = 'table table-hover align-middle';
        tabela.innerHTML = `
            <thead class="table-light">
                <tr><th>ID</th><th>Nome</th><th>Email</th><th>Setor</th><th>Telefone</th><th>Ações</th></tr>
            </thead>
            <tbody>
                ${colaboradores.map(colab => `
                    <tr>
                        <td>${colab.ID_colaborador}</td>
                        <td>${colab.Nome_Col}</td>
                        <td>${colab.Email}</td>
                        <td>${getNomeSetor(colab.Setor)}</td>
                        <td>${formatarStringTelefone(colab.Telefone)}</td>
                        <td>
                            <span class="btn-tabela-editar" data-id="${colab.ID_colaborador}" style="cursor: pointer;">Editar</span>
                            <span class="btn-tabela-excluir" data-id="${colab.ID_colaborador}" style="cursor: pointer;">Excluir</span>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        `;
        tabelaContainer.appendChild(tabela);
    } catch (error) {
        console.error("Erro ao carregar colaboradores:", error);
        tabelaContainer.innerHTML = '<p class="text-center text-danger mt-3">Falha ao carregar dados dos colaboradores.</p>';
    }
};
const carregarEventos = async () => {
    try {
        const response = await fetch('/api/eventos');
        const eventos = await response.json();

        tabelaContainer.innerHTML = '';
        
        if (eventos.length === 0) {
            tabelaContainer.innerHTML = '<p class="text-center mt-3">Nenhum evento cadastrado.</p>';
            return;
        }

        const tabela = document.createElement('table');
        tabela.className = 'table table-hover align-middle';
        tabela.innerHTML = `
            <thead class="table-light">
                <tr>
                    <th>ID</th>
                    <th>Nome do Evento</th>
                    <th>Data e Hora</th>
                    <th>Ações</th>
                </tr>
            </thead>
            <tbody>
                ${eventos.map(evento => {
                    const dataFormatada = new Date(evento.Data_Evento).toLocaleString('pt-BR', {
                        day: '2-digit', month: '2-digit', year: 'numeric',
                        hour: '2-digit', minute: '2-digit'
                    });

                    return `
                        <tr>
                            <td>${evento.ID_Evento}</td>
                            <td>${evento.Nome_Evento}</td>
                            <td>${dataFormatada}</td>
                            <td>
                                <button class="btn btn-sm btn-primary" data-id="${evento.ID_Evento}">Editar</button>
                                <button class="btn btn-sm btn-danger" data-id="${evento.ID_Evento}">Excluir</button>
                            </td>
                        </tr>
                    `;
                }).join('')}
            </tbody>
        `;
        tabelaContainer.appendChild(tabela);
    } catch (error) {
        console.error("Erro ao carregar eventos:", error);
        tabelaContainer.innerHTML = '<p class="text-center text-danger mt-3">Falha ao carregar dados dos eventos.</p>';
    }
};

const abrirModalEdicao = async (id) => {
    try {
        const response = await fetch(`/api/colaboradores/${id}`);
        const colab = await response.json();
        document.getElementById('edit-id').value = colab.ID_colaborador;
        document.getElementById('edit-nome').value = colab.Nome_Col;
        document.getElementById('edit-email').value = colab.Email;
        document.getElementById('edit-telefone').value = colab.Telefone || '';
        document.getElementById('edit-cpf').value = colab.CPF;
        document.getElementById('edit-setor').value = colab.Setor;
        formatarInputTelefone(document.getElementById('edit-telefone'));
        edicaoModal.show();
    } catch (error) {
        alert('Não foi possível carregar os dados para edição.');
    }
};
const abrirModalEdicaoEvento = async (id) => {
    try {
        const response = await fetch(`/api/eventos/${id}`);
        const evento = await response.json();
        
        const eventoDate = new Date(evento.Data_Evento);

        const year = eventoDate.getFullYear();
        const month = String(eventoDate.getMonth() + 1).padStart(2, '0');
        const day = String(eventoDate.getDate()).padStart(2, '0');
        const hours = String(eventoDate.getHours()).padStart(2, '0');
        const minutes = String(eventoDate.getMinutes()).padStart(2, '0');

        const dataParaInput = `${year}-${month}-${day}T${hours}:${minutes}`;

        console.log(dataParaInput);


        document.getElementById('edit-evento-id').value = evento.ID_Evento;
        document.getElementById('edit-nome_evento').value = evento.Nome_Evento;
        document.getElementById('edit-data_evento').value = dataParaInput;
        document.getElementById('edit-local_evento').value = evento.Local_Evento;
        document.getElementById('edit-descricao_evento').value = evento.Descricao;

        edicaoEventoModal.show();
    } catch (error) {
        alert('Não foi possível carregar os dados do evento para edição.');
    }
};

formCadastro.addEventListener('submit', async (e) => {
    e.preventDefault();
    const dados = {
        nome: document.getElementById('nome').value,
        email: document.getElementById('email').value,
        senha: document.getElementById('senha').value,
        telefone: document.getElementById('telefone').value.replace(/\D/g, ''),
        cpf: document.getElementById('cpf').value.replace(/\D/g, ''),
        setor: document.getElementById('setor').value,
    };
    const response = await fetch('/api/colaboradores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dados)
    });
    const result = await response.json();
    if (response.ok) {
        cadColabMod.hide();
        document.getElementById('sucessoMensagem').innerText = result.mensagem;
        sucessoModal.show();
        formCadastro.reset();
        carregarColaboradores();
        recarregar()
    } else {
        alert(result.mensagem);
    }
});
formEdicaoEvento.addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('edit-evento-id').value;
    const dados = {
        nome_evento: document.getElementById('edit-nome_evento').value,
        data_evento: document.getElementById('edit-data_evento').value,
        local_evento: document.getElementById('edit-local_evento').value,
        descricao_evento: document.getElementById('edit-descricao_evento').value
    };

    const response = await fetch(`/api/eventos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dados)
    });
    const result = await response.json();
    if (response.ok) {
        edicaoEventoModal.hide();
        sucessoModal.show();
        document.getElementById('sucessoMensagem').innerText = result.mensagem;
        carregarEventos();
    } else {
        alert(result.mensagem);
    }
});

formEdicao.addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('edit-id').value;
    const dados = {
        nome: document.getElementById('edit-nome').value,
        email: document.getElementById('edit-email').value,
        telefone: document.getElementById('edit-telefone').value.replace(/\D/g, ''),
        cpf: document.getElementById('edit-cpf').value.replace(/\D/g, ''),
        setor: document.getElementById('edit-setor').value
    };
    const response = await fetch(`/api/colaboradores/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dados)
    });
    const result = await response.json();
    if (response.ok) {
        edicaoModal.hide();
        document.getElementById('sucessoMensagem').innerText = result.mensagem;
        sucessoModal.show();
        carregarColaboradores();
        recarregar()
    } else {
        alert(result.mensagem);
    }
});

formEvento.addEventListener('submit', async (e) => {
    e.preventDefault();
    const dados = {
        nome_evento: document.getElementById('nome_evento').value,
        data_evento: document.getElementById('data_evento').value,
        local_evento: document.getElementById('local_evento').value,
        descricao_evento: document.getElementById('descricao_evento').value,
        participantes: Array.from(document.querySelectorAll('input[name="colaboradores[]"]:checked')).map(cb => cb.value)
    };
    try {
        const response = await fetch('/api/eventos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dados)
        });
        const result = await response.json();
        if (response.ok) {
            cadEventMod.hide();
            document.getElementById('sucessoMensagem').innerText = result.mensagem;
            sucessoModal.show();
            formEvento.reset();
            carregarEventos();
        } else {
            alert(result.mensagem);
        }
    } catch (error) {
        console.error("Erro ao cadastrar evento:", error);
        alert("Falha na conexão com o servidor.");
    }
});

tabelaContainer.addEventListener('click', (e) => {
    const id = e.target.dataset.id;
    if (!id) return;

    if (btnColaboradores.classList.contains('ativo')) {
        if (e.target.classList.contains('btn-tabela-editar') || e.target.textContent === 'Editar') {
            abrirModalEdicao(id);
        }
        if (e.target.classList.contains('btn-tabela-excluir') || e.target.textContent === 'Excluir') {
            if (confirm('Tem certeza que deseja excluir este colaborador?')) {
                fetch(`/api/colaboradores/${id}`, { method: 'DELETE' })
                    .then(res => res.json()).then(result => {
                        alert(result.mensagem);
                        carregarColaboradores();
                        recarregar()
                    });
            }
        }
    } else if (btnEventos.classList.contains('ativo')) {
        if (e.target.textContent === 'Editar') {
            abrirModalEdicaoEvento(id);
        }
        if (e.target.textContent === 'Excluir') {
            if (confirm('Tem certeza que deseja excluir este evento?')) {
                fetch(`/api/eventos/${id}`, { method: 'DELETE' })
                    .then(res => res.json()).then(result => {
                        alert(result.mensagem);
                        carregarEventos();
                    });
            }
        }
    }
});


btnColaboradores.addEventListener('click', () => {
    btnColaboradores.classList.add('ativo');
    btnEventos.classList.remove('ativo');
    carregarColaboradores();
    btnAdicionar.setAttribute('data-bs-target', '#cadColabMod');
    btnAdicionar.innerText = 'Adicionar Colaborador';
});

btnEventos.addEventListener('click', () => {
    btnEventos.classList.add('ativo');
    btnColaboradores.classList.remove('ativo');
    tabelaContainer.innerHTML = '<h3 class="text-center mt-5">Área de Eventos em Construção!</h3>';
    btnAdicionar.setAttribute('data-bs-target', '#cadEventMod');
    btnAdicionar.innerText = 'Adicionar Evento';
    carregarEventos();
});

campoPesquisa.addEventListener('input', filtrarTabela);
filtroSetor.addEventListener('change', filtrarTabela);

const colEvento = document.querySelector('#colEvento')

async function colEventos (){
    const response = await fetch(`/api/colaboradores`);
    const colab = await response.json();

    colEvento.innerHTML = ''
    colab.forEach((col) => {
        const formCheck = document.createElement('div')
        formCheck.className = 'form-check my-2 text-large'

        formCheck.innerHTML = `
            <input class="form-check-input" id="${col.ID_colaborador}" type="checkbox" value="${col.ID_colaborador}" name="colaboradores[]">
            <label class="form-check-label" for="${col.ID_colaborador}">${col.Nome_Col}</label>
        `

        colEvento.appendChild(formCheck)
    })
}

colEventoPesquisa.addEventListener('input', function(){
    let filtro = this.value.toLowerCase();
    let colaboradores = document.querySelectorAll("#colEvento .form-check");

    colaboradores.forEach(function (col) {
        let nome = col.querySelector("label").textContent.toLowerCase();
        if (nome.includes(filtro)) {
            col.style.display = "inline-block";
        } else {
            col.style.display = "none";
        }
    });
})

function recarregar(){
    colEventos()
}

carregarColaboradores();
setTimeout(colEventos, 1000)}

inicializarAdmin();