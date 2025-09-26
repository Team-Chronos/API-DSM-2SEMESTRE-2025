console.log("admin.js carregado e inicializando...");

const tabelaContainer = document.getElementById('lista-colaboradores');
const formCadastro = document.getElementById('formCadastro');
const formEdicao = document.getElementById('formEdicao');
const campoPesquisa = document.getElementById('pesquisaAdm');
const filtroSetor = document.getElementById('filtro-setor');
const filtroModalidade = document.getElementById('filtro-modalidade'); // CORREÇÃO
const btnAdicionar = document.getElementById('btn-modal-cad');
const btnColaboradores = document.getElementById('btn-colaboradores');
const btnEventos = document.getElementById('btn-eventos');

const cadColabMod = new bootstrap.Modal(document.getElementById('cadColabMod'));
const edicaoModal = new bootstrap.Modal(document.getElementById('edicaoModal'));
const sucessoModal = bootstrap.Modal.getOrCreateInstance(document.getElementById('sucessoModal'));

const cpfInputCadastro = document.getElementById('cpf');
const telInputCadastro = document.getElementById('telefone');
const telInputEdicao = document.getElementById('edit-telefone');

const getNomeSetor = (setorId) => {
    switch (setorId) {
        case 1: return 'Administrativo';
        case 2: return 'Comercial';
        case 3: return 'Operacional';
        default: return 'Desconhecido';
    }
};

const getNomeLocalidade = (localidadeChar) => {
    switch (localidadeChar) {
        case 'P': return 'Presencial';
        case 'R': return 'Remoto';
        case 'O': return 'Outro';
        default: return 'Não informado';
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
    const modalidadeSelecionada = filtroModalidade.value;

    const corpoTabela = document.querySelector("#lista-colaboradores tbody");
    if (!corpoTabela) return;

    const linhas = corpoTabela.getElementsByTagName('tr');

    for (const linha of linhas) {
        const nomeNaLinha = linha.cells[1].textContent.toLowerCase();
        const emailNaLinha = linha.cells[2].textContent.toLowerCase();
        const setorNaLinha = linha.cells[3].textContent;
        const modalidadeNaLinha = linha.cells[4].textContent;

        const correspondeNome = nomeNaLinha.includes(textoPesquisa);
        const correspondeEmail = emailNaLinha.includes(textoPesquisa);
        const correspondeSetor = (setorSelecionado === "" || setorNaLinha === setorSelecionado);
        const correspondeModalidade = (modalidadeSelecionada === "" || modalidadeNaLinha === modalidadeSelecionada);

        linha.style.display = (correspondeSetor && (correspondeNome || correspondeEmail) && correspondeModalidade)
            ? ""
            : "none";
    }
};

cpfInputCadastro?.addEventListener('input', () => {
    let value = cpfInputCadastro.value.replace(/\D/g, '');
    value = value.slice(0, 11);
    value = value.replace(/(\d{3})(\d)/, '$1.$2');
    value = value.replace(/(\d{3})(\d)/, '$1.$2');
    value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    cpfInputCadastro.value = value;
});

telInputCadastro?.addEventListener('input', () => formatarInputTelefone(telInputCadastro));
telInputEdicao?.addEventListener('input', () => formatarInputTelefone(telInputEdicao));

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
                <tr>
                    <th>ID</th>
                    <th>Nome</th>
                    <th>Email</th>
                    <th>Setor</th>
                    <th>Modalidade</th>
                    <th>Telefone</th>
                    <th class="d-flex justify-content-between align-items-center">
                        Ações
                        <button id="btn-refresh" class="ms-3 btn-refresh-header" title="Atualizar Lista">
                            <i class="bi bi-arrow-clockwise"></i>
                        </button>
                    </th>
                </tr>
            </thead>
            <tbody>
                ${colaboradores.map(colab => `
                    <tr>
                        <td>${colab.ID_colaborador}</td>
                        <td>${colab.Nome_Col}</td>
                        <td>${colab.Email}</td>
                        <td>${getNomeSetor(colab.Setor)}</td>
                        <td>${getNomeLocalidade(colab.Localidade)}</td>
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

formCadastro?.addEventListener('submit', async (e) => {
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
        cadColabMod.hide(); // CORREÇÃO
        document.getElementById('sucessoMensagem').innerText = result.mensagem;
        sucessoModal.show();
        formCadastro.reset();
        carregarColaboradores();
    } else {
        alert(result.mensagem);
    }
});

formEdicao?.addEventListener('submit', async (e) => {
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
    } else {
        alert(result.mensagem);
    }
});

tabelaContainer.addEventListener('click', (e) => {
    if (e.target.closest('#btn-refresh')) {
        console.log("Botão de atualizar clicado.");
        if (btnColaboradores.classList.contains('ativo')) {
            carregarColaboradores();
        } else if (btnEventos.classList.contains('ativo')) {
            carregarEventos?.();
        }
        return;
    }

    const id = e.target.dataset.id;
    if (!id) return;

    if (e.target.classList.contains('btn-tabela-editar')) {
        abrirModalEdicao(id);
    }
    if (e.target.classList.contains('btn-tabela-excluir')) {
        if (confirm('Tem certeza que deseja excluir este colaborador?')) {
            fetch(`/api/colaboradores/${id}`, { method: 'DELETE' })
                .then(res => res.json())
                .then(result => {
                    alert(result.mensagem);
                    carregarColaboradores();
                });
        }
    }
});

btnColaboradores?.addEventListener('click', () => {
    btnColaboradores.classList.add('ativo');
    btnEventos.classList.remove('ativo');
    btnAdicionar.setAttribute('data-bs-target', '#cadColabMod');
    btnAdicionar.innerText = 'Adicionar Colaborador';
    carregarColaboradores();
});

btnEventos?.addEventListener('click', () => {
    btnEventos.classList.add('ativo');
    btnColaboradores.classList.remove('ativo');
    tabelaContainer.innerHTML = '<h3 class="text-center mt-5">Área de Eventos em Construção!</h3>';
});

campoPesquisa?.addEventListener('input', filtrarTabela);
filtroSetor?.addEventListener('change', filtrarTabela);
filtroModalidade?.addEventListener('change', filtrarTabela);

carregarColaboradores();
