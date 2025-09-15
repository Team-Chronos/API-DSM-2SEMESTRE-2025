async function carregarColaboradores() {
    try {
        const resposta = await fetch('/colaboradores');
        const colaboradores = await resposta.json();
        
        const container = document.getElementById('lista-colaboradores');
        container.innerHTML = '';

        colaboradores.forEach(colaborador => {
            const colaboradorDiv = document.createElement('div');
            colaboradorDiv.innerHTML = `
                <p><strong>ID:</strong> ${colaborador.ID_colaborador}</p>
                <p><strong>Nome:</strong> ${colaborador.Nome_Col}</p>
                <p><strong>Email:</strong> ${colaborador.Email}</p>
                <p><strong>CPF:</strong> ${colaborador.CPF}</p>
                <p><strong>Setor:</strong> ${colaborador.Setor}</p>
                
                <button onclick="excluirColaborador(${colaborador.ID_colaborador})">Excluir</button>
                <button onclick="editarColaborador(${colaborador.ID_colaborador})">Editar</button>
            `;
            container.appendChild(colaboradorDiv);
        });

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
        }

    } catch (error) {
        console.error("Erro ao salvar edição:", error);
        alert("Erro na conexão com o servidor!");
    }
}

function cancelarEdicao() {
    document.getElementById('form-edicao-colaborador').style.display = 'none';
}

document.getElementById('formEdicao').addEventListener('submit', salvarEdicao);

window.onload = carregarColaboradores;