document.getElementById("formCadastro").addEventListener("submit", async (e) => {
    e.preventDefault();

    const nome = document.getElementById("nome").value;
    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;
    const cpf = document.getElementById("cpf").value;
    const setor = document.getElementById("setor").value;

    try {
        const resposta = await fetch("/cadastro", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nome, email, senha, cpf, setor })
        });

        const resultado = await resposta.json();
        document.getElementById("mensagem").innerText = resultado.mensagem;
    } catch (error) {
        console.error("Erro:", error);
        document.getElementById("mensagem").innerText = "Erro na conexão com o servidor!";
    }
});