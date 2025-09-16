async function carregarColaboradores() {
    try {
        const resposta = await fetch('/colaboradores');
        const colaboradores = await resposta.json();
        
        const container = document.getElementById('lista-colaboradores');
        container.innerHTML = '';

        if (colaboradores.length === 0) {
            container.innerHTML = '<p>Nenhum colaborador cadastrado.</p>';
            return;
        }

        const tabela = document.createElement('table');
        tabela.className = 'tabela-colaboradores'; 
        
        tabela.innerHTML = `
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Nome</th>
                    <th>CPF</th>
                    <th>Email</th>
                    <th>Ações</th>
                </tr>
            </thead>
            <tbody></tbody>
        `;

        const corpoTabela = tabela.querySelector('tbody');

        colaboradores.forEach(colaborador => {
            const linha = document.createElement('tr');
            linha.innerHTML = `
                <td>ID: ${colaborador.ID_colaborador}</td>
                <td>${colaborador.Nome_Col}</td>
                <td>${colaborador.CPF}</td> <td>${colaborador.Email}</td>
                <td class="botoes-tabela">
                    <button class="btn-tabela-excluir" onclick="excluirColaborador('${colaborador.ID_colaborador}')">Excluir</button>
                    <button class="btn-tabela-editar" onclick="editarColaborador('${colaborador.ID_colaborador}')">Editar</button>
                </td>
            `;
            corpoTabela.appendChild(linha);
        });
        
        container.appendChild(tabela);

    } catch (error) {
        console.error("Erro ao carregar colaboradores:", error);
        document.getElementById('lista-colaboradores').innerText = 'Não foi possível carregar os dados.';
    }
}

async function excluirColaborador(id) {
    if (!confirm("Tem certeza que deseja excluir este colaborador?")) {
        return;
    }

    try {
        const resposta = await fetch(`/colaboradores/${id}`, {
            method: "DELETE",
        });

        const resultado = await resposta.json();
        alert(resultado.mensagem);

        if (resposta.ok) {
            carregarColaboradores();
        }

    } catch (error) {
        console.error("Erro na requisição:", error);
        alert("Erro na conexão com o servidor!");
    }
}

async function editarColaborador(id) {
    try {
        const resposta = await fetch(`/colaboradores/${id}`);
        const colaborador = await resposta.json();

        document.getElementById('lista-colaboradores').style.display = 'none';
        document.getElementById('form-edicao-colaborador').style.display = 'block';

        document.getElementById('edit-id').value = colaborador.ID_colaborador;
        document.getElementById('edit-nome').value = colaborador.Nome_Col;
        document.getElementById('edit-email').value = colaborador.Email;
        document.getElementById('edit-cpf').value = colaborador.CPF;
        document.getElementById('edit-setor').value = colaborador.Setor;

    } catch (error) {
        console.error("Erro ao carregar dados para edição:", error);
        alert("Não foi possível carregar os dados do colaborador para edição.");
    }
}

async function salvarEdicao(event) {
    event.preventDefault();

    const id = document.getElementById('edit-id').value;
    const novoNome = document.getElementById('edit-nome').value;
    const novoEmail = document.getElementById('edit-email').value;
    const novoCpf = document.getElementById('edit-cpf').value;
    const novoSetor = document.getElementById('edit-setor').value;

    try {
        const resposta = await fetch(`/colaboradores/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                nome: novoNome,
                email: novoEmail,
                cpf: novoCpf,
                setor: novoSetor
            })
        });

        const resultado = await resposta.json();
        alert(resultado.mensagem);

        if (resposta.ok) {
            carregarColaboradores();
            document.getElementById('form-edicao-colaborador').style.display = 'none';
            document.getElementById('lista-colaboradores').style.display = 'block'; 
        }

    } catch (error) {
        console.error("Erro ao salvar edição:", error);
        alert("Erro na conexão com o servidor!");
    }
}

function cancelarEdicao() {
    document.getElementById('form-edicao-colaborador').style.display = 'none';
    document.getElementById('lista-colaboradores').style.display = 'block'; 
}

document.getElementById('formEdicao').addEventListener('submit', salvarEdicao);
window.onload = carregarColaboradores;