document.addEventListener("DOMContentLoaded", () => {
  const formCadastro = document.getElementById("formCadastro");
  
  // Obtenha as instâncias dos modais do Bootstrap
  const cadastroModal = new bootstrap.Modal(document.getElementById('cadastroModal'));
  const sucessoModal = new bootstrap.Modal(document.getElementById('sucessoModal'));

  if (formCadastro) {
      formCadastro.addEventListener("submit", async (e) => {
          e.preventDefault();

          // Pega os valores dos campos
          const nome = document.getElementById("nome").value;
          const email = document.getElementById("email").value;
          const senha = document.getElementById("senha").value;
          let cpf = document.getElementById("cpf").value;
          const setor = document.getElementById("setor").value;
          
          // Remove a formatação do CPF para enviar apenas os números
          cpf = cpf.replace(/[.-]/g, '');

          try {
              const resposta = await fetch("/cadastro", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ nome, email, senha, cpf, setor })
              });

              const resultado = await resposta.json();

              if (resposta.ok) { // Verifica se a resposta do servidor foi bem-sucedida (status 200-299)
                  // 1. Feche o modal de cadastro
                  cadastroModal.hide();

                  // 2. Limpe o formulário
                  formCadastro.reset();

                  // 3. Exiba a mensagem de sucesso no novo modal e mostre-o
                  document.getElementById("sucessoMensagem").innerText = resultado.mensagem;
                  sucessoModal.show();
                  
              } else {
                  // Se houver erro, exiba a mensagem no modal de cadastro
                  document.getElementById("mensagem").innerText = resultado.mensagem;
              }

          } catch (error) {
              console.error("Erro:", error);
              document.getElementById("mensagem").innerText = "Erro na conexão com o servidor!";
          }
      });

      // Lógica de formatação de CPF
      const cpfInput = document.getElementById('cpf');
      if (cpfInput) {
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
      }
  }
});