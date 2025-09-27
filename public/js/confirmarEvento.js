// Seleciona os elementos relevantes
const formEvento = document.getElementById('form-evento');
const resultado = document.getElementById('resultado');
const campoJustificativa = document.getElementById('campo-justificativa');
const textareaJustificativa = document.getElementById('justificativa');
const radios = document.querySelectorAll('input[name="decisao_evento"]');

// --- Lógica para mostrar/esconder a justificativa ---
// Itera sobre cada botão de rádio
radios.forEach(radio => {
    // Adiciona um evento que dispara toda vez que a seleção muda
    radio.addEventListener('change', (e) => {
        if (e.target.value === 'recusado') {
            // Se "recusar" foi selecionado, mostra o campo
            campoJustificativa.style.display = 'block';
        } else {
            // Caso contrário (se "aceitar" foi selecionado), esconde
            campoJustificativa.style.display = 'none';
        }
    });
});


// --- Lógica para ENVIAR os dados ao clicar no botão ---
formEvento.addEventListener('submit', async (e) => {
    // Previne o comportamento padrão de recarregar a página
    e.preventDefault();

    // 1. Encontra qual botão de rádio está selecionado
    const radioSelecionado = document.querySelector('input[name="decisao_evento"]:checked');
    
    // Se nenhum rádio for selecionado (pouco provável com 'checked' no HTML), não faz nada.
    if (!radioSelecionado) {
        resultado.innerText = 'Por favor, selecione uma opção.';
        return;
    }

    const respostaUsuario = radioSelecionado.value; // 'aceito' ou 'recusado'
    const justificativaUsuario = textareaJustificativa.value;

    // Lógica para exibir o status na tela
    if (respostaUsuario === 'aceito') {
        resultado.innerText = 'Presença confirmada!';
    } else { // Se for 'recusado'
        if (justificativaUsuario.trim().length === 0) {
            resultado.innerText = 'Recusado. Por favor, preencha a justificativa.';
            // Opcional: Impedir o envio se a justificativa for obrigatória
            return; 
        } else {
            resultado.innerText = 'Ausência justificada e registrada.';
        }
    }
    
    // 2. Envia os dados corretos para o servidor
    try {
        const response = await fetch('http://localhost:3000/confirmarEvento', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                // Envia o valor do rádio selecionado e o texto da justificativa
                resposta: respostaUsuario,
                justificativa: justificativaUsuario
            })
        });

        if (response.ok) {
            console.log('Resposta enviada com sucesso!');
            // Você pode adicionar mais alguma lógica aqui, como limpar o formulário.
        } else {
            console.error('Falha ao enviar a resposta.');
            resultado.innerText = 'Ocorreu um erro ao enviar. Tente novamente.';
        }

    } catch (error) {
        console.error('Erro de conexão:', error);
        resultado.innerText = 'Não foi possível conectar ao servidor.';
    }
});