document.addEventListener("DOMContentLoaded", () => {
    let eventoAtualId = null;
    let colaboradorAtualId = 1; 

    // Carregar eventos
    async function carregarEventos() {
        try {
            const resposta = await fetch('/eventos');
            const eventos = await resposta.json();
            
            const container = document.getElementById('lista-eventos');
            container.innerHTML = '';
            
            if (eventos.length === 0) {
                container.innerHTML = '<p>Nenhum evento cadastrado.</p>';
                return;
            }
            
            eventos.forEach(evento => {
                const card = document.createElement('div');
                card.className = 'card mb-3';
                card.innerHTML = `
                    <div class="card-body">
                        <h5 class="card-title">${evento.Nome_Evento}</h5>
                        <p class="card-text">${evento.Descricao || 'Sem descrição'}</p>
                        <p class="card-text"><small class="text-muted">
                            ${new Date(evento.Data_Evento).toLocaleDateString('pt-BR')} - 
                            ${evento.Local_Evento}
                        </small></p>
                        <button class="btn btn-primary btn-responder-evento" data-id="${evento.ID_Evento}">
                            Responder
                        </button>
                    </div>
                `;
                container.appendChild(card);
            });
            
            // Adicionar event listeners aos botões
            document.querySelectorAll('.btn-responder-evento').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    eventoAtualId = e.target.getAttribute('data-id');
                    document.getElementById('evento-pergunta').textContent = 
                        `Você confirma presença no evento "${e.target.parentElement.querySelector('.card-title').textContent}"?`;
                    document.getElementById('motivoRecusa').style.display = 'none';
                    document.querySelectorAll('input[name="respostaEvento"]').forEach(input => {
                        input.checked = false;
                    });
                    new bootstrap.Modal(document.getElementById('respostaEventoModal')).show();
                });
            });
            
        } catch (error) {
            console.error("Erro ao carregar eventos:", error);
            document.getElementById('lista-eventos').innerText = 'Não foi possível carregar os eventos.';
        }
    }
    
    document.querySelectorAll('input[name="respostaEvento"]').forEach(input => {
        input.addEventListener('change', (e) => {
            document.getElementById('motivoRecusa').style.display = 
                (e.target.value === 'recusado') ? 'block' : 'none';
        });
    });
    
    // Configurar botão de enviar resposta
    document.getElementById('enviarRespostaEvento').addEventListener('click', async () => {
        const respostaSelecionada = document.querySelector('input[name="respostaEvento"]:checked');
        
        if (!respostaSelecionada) {
            alert('Por favor, selecione uma resposta.');
            return;
        }
        
        const resposta = respostaSelecionada.value;
        const motivo = (resposta === 'recusado') ? document.getElementById('motivoTexto').value : '';
        
        try {
            const notificacaoEnviada = await notificarOrganizadorEvento(
                eventoAtualId, colaboradorAtualId, resposta, motivo
            );
            
            if (notificacaoEnviada) {
                alert('Resposta enviada com sucesso! O organizador foi notificado.');
            } else {
                alert('Resposta registrada, mas houve um problema ao notificar o organizador.');
            }
            
            bootstrap.Modal.getInstance(document.getElementById('respostaEventoModal')).hide();
            carregarEventos(); // Recarregar a lista de eventos
            
        } catch (error) {
            console.error('Erro ao enviar resposta:', error);
            alert('Erro ao enviar resposta. Tente novamente.');
        }
    });
    
    carregarEventos();
});