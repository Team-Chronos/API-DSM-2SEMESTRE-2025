document.getElementById("formCadastro").addEventListener("submit", async (e) => {
    e.preventDefault();

    const nome = document.getElementById("nome").value;
    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;
    let cpf = document.getElementById("cpf").value;

    cpf = cpf.replace(/[.-]/g, '');

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

const cpfInput = document.getElementById('cpf');

cpfInput.addEventListener('input', () => {
  let value = cpfInput.value.replace(/\D/g, '');
  value = value.slice(0, 11);

  if (value.length > 9) {
    value = value.replace(/(\d{3})(\d{3})(\d{3})(\d{0,2})/, '$1.$2.$3-$4');
  } else if (value.length > 6) {
    value = value.replace(/(\d{3})(\d{3})(\d{0,3})/, '$1.$2.$3');
  } else if (value.length > 3) {
    value = value.replace(/(\d{3})(\d{0,3})/, '$1.$2');
  }

  cpfInput.value = value;
});