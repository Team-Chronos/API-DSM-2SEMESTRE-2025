document.addEventListener("DOMContentLoaded", () => {

    window.notificarOrganizadorEvento = async (idEvento, idColaborador, resposta, motivo = "") => {
        try {
            const token = localStorage.getItem('userToken');
            const dadosNotificacao = {
                idEvento: idEvento,
                idColaborador: idColaborador,
                resposta: resposta,
                motivo: motivo
            };

            const respostaServidor = await fetch('/api/notificar-evento', {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(dadosNotificacao)
            });

            const resultado = await respostaServidor.json();
            
            if (respostaServidor.ok) {
                console.log("Organizador notificado com sucesso:", resultado.mensagem);
                return true;
            } else {
                console.error("Erro ao notificar organizador:", resultado.mensagem);
                return false;
            }
        } catch (error) {
            console.error("Erro na conexão com o servidor:", error);
            return false;
        }
    };

    const formOriginal = document.getElementById('form-evento');
    const resultadoOriginal = document.getElementById('resultado');

    formOriginal.addEventListener('submit', async (e) => {
        e.preventDefault();

        const radioSelecionado = document.querySelector('input[name="decisao_evento"]:checked');
        if (!radioSelecionado) {
            resultadoOriginal.innerText = 'Por favor, selecione uma opção.';
            return;
        }

        const respostaUsuario = radioSelecionado.value;
        const justificativaUsuario = document.getElementById('justificativa').value;

        if (respostaUsuario === 'recusado' && justificativaUsuario.trim().length === 0) {
            resultadoOriginal.innerText = 'Recusado. Por favor, preencha a justificativa.';
            return;
        }

        try {
            const idEvento = obterIdEventoDaURL();
            const idColaborador = obterIdColaboradorDoToken();

            const notificacaoEnviada = await notificarOrganizadorEvento(
                idEvento || 1,
                idColaborador || 1,
                respostaUsuario, 
                justificativaUsuario
            );

            if (notificacaoEnviada) {
                document.getElementById('sucessoMensagem').textContent = 
                    respostaUsuario === 'aceito' 
                        ? 'Presença confirmada! Organizador notificado.' 
                        : 'Ausência justificada! Organizador notificado.';
                
                const sucessoModal = new bootstrap.Modal(document.getElementById('sucessoModal'));
                sucessoModal.show();
                
                resultadoOriginal.innerText = '';
            } else {
                document.getElementById('erroMensagem').textContent = 
                    'Resposta registrada, mas houve problema ao notificar organizador.';
                
                const erroModal = new bootstrap.Modal(document.getElementById('erroModal'));
                erroModal.show();
            }

        } catch (error) {
            console.error('Erro ao processar resposta:', error);
            resultadoOriginal.innerText = 'Erro ao processar resposta.';
        }
    });

    function obterIdEventoDaURL() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('eventoId');
    }

    function obterIdColaboradorDoToken() {
        try {
            const token = localStorage.getItem('userToken');
            if (token) {
                const payload = JSON.parse(atob(token.split('.')[1]));
                return payload.id;
            }
        } catch (e) {
            console.error('Erro ao obter ID do colaborador:', e);
        }
        return null;
    }
});
