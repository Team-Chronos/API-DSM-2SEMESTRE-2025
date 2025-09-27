const formEvento = document.getElementById('form-evento');
const resultado = document.getElementById('resultado');
const campoJustificativa = document.getElementById('campo-justificativa');
const textareaJustificativa = document.getElementById('justificativa');
const radios = document.querySelectorAll('input[name="decisao_evento"]');

radios.forEach(radio => {
    radio.addEventListener('change', (e) => {
        campoJustificativa.style.display = e.target.value === 'recusado' ? 'block' : 'none';
    });
});

formEvento.addEventListener('submit', async (e) => {
    e.preventDefault();

    const radioSelecionado = document.querySelector('input[name="decisao_evento"]:checked');
    if (!radioSelecionado) {
        resultado.innerText = 'Por favor, selecione uma opção.';
        return;
    }

    const respostaUsuario = radioSelecionado.value;
    const justificativaUsuario = textareaJustificativa.value;

    if (respostaUsuario === 'aceito') {
        resultado.innerText = 'Presença confirmada!';
    } else {
        if (justificativaUsuario.trim().length === 0) {
            resultado.innerText = 'Recusado. Por favor, preencha a justificativa.';
            return;
        } else {
            resultado.innerText = 'Ausência justificada e registrada.';
        }
    }

    try {
        const response = await fetch('http://localhost:3000/confirmarEvento', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                resposta: respostaUsuario,
                justificativa: justificativaUsuario
            })
        });

        if (response.ok) {
            console.log('Resposta enviada com sucesso!');
        } else {
            console.error('Falha ao enviar a resposta.');
            resultado.innerText = 'Ocorreu um erro ao enviar. Tente novamente.';
        }

    } catch (error) {
        console.error('Erro de conexão:', error);
        resultado.innerText = 'Não foi possível conectar ao servidor.';
    }
});
formEvento.addEventListener('submit', async (e) => {
    e.preventDefault();

    const radioSelecionado = document.querySelector('input[name="decisao_evento"]:checked');
    if (!radioSelecionado) {
        resultado.innerText = 'Por favor, selecione uma opção.';
        return;
    }

    const respostaUsuario = radioSelecionado.value;
    const justificativaUsuario = document.getElementById('justificativa').value;

    // Obter ID do evento da URL
    const urlParams = new URLSearchParams(window.location.search);
    const eventoId = urlParams.get('eventoId') || 1;

    if (respostaUsuario === 'aceito') {
        resultado.innerText = 'Presença confirmada!';
    } else {
        if (justificativaUsuario.trim().length === 0) {
            resultado.innerText = 'Recusado. Por favor, preencha a justificativa.';
            return;
        } else {
            resultado.innerText = 'Ausência justificada e registrada.';
        }
    }

    try {
        const token = localStorage.getItem('userToken');
        const response = await fetch('/api/confirmar-presenca', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                eventoId: eventoId,
                resposta: respostaUsuario,
                justificativa: justificativaUsuario
            })
        });

        if (response.ok) {
            console.log('Resposta enviada com sucesso!');
            
            document.getElementById('sucessoMensagem').textContent = 
                respostaUsuario === 'aceito' 
                    ? 'Presença confirmada com sucesso!' 
                    : 'Ausência registrada com sucesso!';
            
            new bootstrap.Modal(document.getElementById('sucessoModal')).show();
            
        } else {
            console.error('Falha ao enviar a resposta.');
            resultado.innerText = 'Ocorreu um erro ao enviar. Tente novamente.';
        }

    } catch (error) {
        console.error('Erro de conexão:', error);
        resultado.innerText = 'Não foi possível conectar ao servidor.';
    }
});
