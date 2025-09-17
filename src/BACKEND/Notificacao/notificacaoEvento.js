document.addEventListener("DOMContentLoaded", () => {
    window.notificarOrganizadorEvento = async (idEvento, idColaborador, resposta, motivo = "") => {
        try {
            const dadosNotificacao = {
                idEvento: idEvento,
                idColaborador: idColaborador,
                resposta: resposta,
                motivo: motivo
            };

            const respostaServidor = await fetch('/notificar-evento', {
                method: "POST",
                headers: { "Content-Type": "application/json" },
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

});