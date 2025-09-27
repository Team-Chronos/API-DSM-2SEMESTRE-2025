console.log("admin.js carregado e inicializando...");

const tabelaContainer = document.getElementById('lista-colaboradores');
const formCadastro = document.getElementById('formCadastro');
const formEdicao = document.getElementById('formEdicao');
const campoPesquisa = document.getElementById('pesquisaAdm');
const filtroSetor = document.getElementById('filtro-setor');
const btnColaboradores = document.getElementById('btn-colaboradores');
const btnEventos = document.getElementById('btn-eventos');

const listaEventos = document.getElementById('lista-eventos');
const btnModalEvento = document.getElementById('btn-modal-evento');
const formEvento = document.getElementById('formEvento');
const visualizarEventoModal = new bootstrap.Modal(document.getElementById('visualizarEventoModal'));

const cadastroModal = new bootstrap.Modal(document.getElementById('cadastroModal'));
const edicaoModal = new bootstrap.Modal(document.getElementById('edicaoModal'));
const sucessoModal = new bootstrap.Modal(document.getElementById('sucessoModal'));

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

        if (correspondeSetor && (correspondeNome || correspondeEmail)){
            linha.style.display = ""; 
        } else {
            linha.style.display = "none"; 
        }
    }
};

const carregarColaboradores = async () => {
    try {
        const response = await fetch('/api/colaboradores');
        const colaboradores = await response.json();
        
        tabelaContainer.innerHTML = '';
        if (colaboradores.length === 0) {
            tabelaContainer.innerHTML = '<p class="text-center mt-3">Nenhum colaborador encontrado.</p>';
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


const carregarEventos = async () => {
    try {
        const token = localStorage.getItem('userToken');
        const response = await fetch('/api/eventos', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (!response.ok) throw new Error('Erro ao carregar eventos');
        
        const eventos = await response.json();
        
        listaEventos.innerHTML = `
            <div class="d-flex justify-content-between align-items-center mb-4">
                <h3>Eventos Agendados</h3>
                <span class="badge bg-primary">${eventos.length} evento(s)</span>
            </div>
            <div class="row">
                ${eventos.length === 0 ? 
                    '<div class="col-12"><p class="text-center text-muted">Nenhum evento agendado.</p></div>' : 
                    eventos.map(evento => `
                        <div class="col-md-6 col-lg-4 mb-4">
                            <div class="card h-100 evento-card" data-id="${evento.id}">
                                <div class="card-body">
                                    <h5 class="card-title">${evento.titulo}</h5>
                                    <p class="card-text text-muted">${evento.descricao.substring(0, 100)}...</p>
                                    <div class="evento-info">
                                        <small class="text-primary">
                                            <i class="bi bi-calendar-event"></i> 
                                            ${new Date(evento.data_evento).toLocaleDateString('pt-BR')}
                                        </small>
                                        <br>
                                        <small class="text-secondary">
                                            <i class="bi bi-geo-alt"></i> ${evento.local}
                                        </small>
                                    </div>
                                </div>
                                <div class="card-footer bg-transparent">
                                    <button class="btn btn-sm btn-outline-primary btn-visualizar-evento">
                                        Ver Detalhes
                                    </button>
                                </div>
                            </div>
                        </div>
                    `).join('')
                }
            </div>
        `;
        
        document.querySelectorAll('.btn-visualizar-evento').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const card = e.target.closest('.evento-card');
                const eventoId = card.getAttribute('data-id');
                visualizarEvento(eventoId);
            });
        });
        
    } catch (error) {
        console.error('Erro ao carregar eventos:', error);
        listaEventos.innerHTML = '<p class="text-center text-danger">Erro ao carregar eventos.</p>';
    }
};

const visualizarEvento = async (id) => {
    try {
        const token = localStorage.getItem('userToken');
        const response = await fetch(`/api/eventos/${id}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (!response.ok) throw new Error('Erro ao carregar evento');
        
        const evento = await response.json();
        
        document.getElementById('detalhes-evento').innerHTML = `
            <h4>${evento.titulo}</h4>
            <p><strong>Descrição:</strong> ${evento.descricao}</p>
            <p><strong>Data:</strong> ${new Date(evento.data_evento).toLocaleString('pt-BR')}</p>
            <p><strong>Local:</strong> ${evento.local}</p>
            <p><strong>Criado em:</strong> ${new Date(evento.data_criacao).toLocaleDateString('pt-BR')}</p>
        `;
        
        // Configurar botão de excluir
        document.getElementById('btn-excluir-evento').onclick = () => excluirEvento(id);
        
        visualizarEventoModal.show();
        
    } catch (error) {
        console.error('Erro ao visualizar evento:', error);
        alert('Erro ao carregar detalhes do evento.');
    }
};

const excluirEvento = async (id) => {
    if (!confirm('Tem certeza que deseja excluir este evento?')) return;
    
    try {
        const token = localStorage.getItem('userToken');
        const response = await fetch(`/api/eventos/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (response.ok) {
            visualizarEventoModal.hide();
            carregarEventos();
            document.getElementById('sucessoMensagem').innerText = 'Evento excluído com sucesso!';
            sucessoModal.show();
        } else {
            throw new Error('Erro ao excluir evento');
        }
    } catch (error) {
        console.error('Erro ao excluir evento:', error);
        alert('Erro ao excluir evento.');
    }
};

const criarEvento = async () => {
    const titulo = document.getElementById('evento-titulo').value;
    const descricao = document.getElementById('evento-descricao').value;
    const dataEvento = document.getElementById('evento-data').value;
    const local = document.getElementById('evento-local').value;
    
    const setoresNotificar = [];
    if (!document.getElementById('notificar-todos').checked) {
        if (document.getElementById('setor-admin').checked) setoresNotificar.push(1);
        if (document.getElementById('setor-comercial').checked) setoresNotificar.push(2);
        if (document.getElementById('setor-operacional').checked) setoresNotificar.push(3);
    }
    
    if (!titulo || !descricao || !dataEvento || !local) {
        alert('Preencha todos os campos obrigatórios!');
        return;
    }
    
    try {
        const token = localStorage.getItem('userToken');
        const response = await fetch('/api/eventos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                titulo,
                descricao,
                data_evento: dataEvento,
                local,
                setores_notificar: setoresNotificar.length > 0 ? setoresNotificar : null
            })
        });
        
        const result = await response.json();
        
        if (response.ok) {
            document.getElementById('eventoModal').querySelector('.btn-close').click();
            formEvento.reset();
            carregarEventos();
            document.getElementById('sucessoMensagem').innerText = result.mensagem;
            sucessoModal.show();
        } else {
            alert(result.mensagem);
        }
    } catch (error) {
        console.error('Erro ao criar evento:', error);
        alert('Erro ao criar evento.');
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
        cadastroModal.hide();
        document.getElementById('sucessoMensagem').innerText = result.mensagem;
        sucessoModal.show();
        formCadastro.reset();
        carregarColaboradores();
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
    } else {
        alert(result.mensagem);
    }
});

// Event listeners para navegação entre abas
btnColaboradores.addEventListener('click', () => {
    btnColaboradores.classList.add('ativo');
    btnEventos.classList.remove('ativo');
    tabelaContainer.style.display = 'block';
    listaEventos.style.display = 'none';
    document.getElementById('filtro-container').style.display = 'flex';
    btnModalEvento.style.display = 'none';
    document.getElementById('btn-modal-cad').style.display = 'block';
    carregarColaboradores();
});

btnEventos.addEventListener('click', () => {
    btnEventos.classList.add('ativo');
    btnColaboradores.classList.remove('ativo');
    tabelaContainer.style.display = 'none';
    listaEventos.style.display = 'block';
    document.getElementById('filtro-container').style.display = 'none';
    btnModalEvento.style.display = 'block';
    document.getElementById('btn-modal-cad').style.display = 'none';
    carregarEventos();
});

document.getElementById('btn-criar-evento').addEventListener('click', criarEvento);

document.getElementById('notificar-todos').addEventListener('change', function() {
    const checkboxes = document.querySelectorAll('input[type="checkbox"][value]');
    checkboxes.forEach(checkbox => {
        checkbox.disabled = this.checked;
        if (this.checked) checkbox.checked = false;
    });
});

tabelaContainer.addEventListener('click', (e) => {
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

campoPesquisa.addEventListener('input', filtrarTabela);
filtroSetor.addEventListener('change', filtrarTabela);

carregarColaboradores();