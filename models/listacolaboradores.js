// Função que busca os colaboradores e renderiza a lista na tela
async function carregarColaboradores() {
    try {
        const resposta = await fetch('/colaboradores');
        const colaboradores = await resposta.json();

        const container = document.getElementById('lista-colaboradores');
        container.innerHTML = ''; // Limpa o conteúdo da lista antes de carregar

        colaboradores.forEach(colaborador => {
            const colaboradorDiv = document.createElement('div');
            colaboradorDiv.innerHTML = `
          <p><strong>ID:</strong> ${colaborador.ID_colaborador}</p>
          <p><strong>Nome:</strong> ${colaborador.Nome_Col}</p>
          <p><strong>Email:</strong> ${colaborador.Email}</p>
          
          <button onclick="excluirColaborador(${colaborador.ID_colaborador})">Excluir</button>
        `;
            container.appendChild(colaboradorDiv);
        });

    } catch (error) {
        console.error("Erro ao carregar colaboradores:", error);
        document.getElementById('lista-colaboradores').innerText = 'Não foi possível carregar os dados.';
    }
}

//exclusão
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

window.onload = carregarColaboradores;