function inicarNotificacao() {
    // Declarar funções auxiliares primeiro
    const criarConcluir = (notification) => {
        const details = notification.querySelector(".details");
        const concluidoBtn = document.createElement("button");
        concluidoBtn.className = "concluido";
        concluidoBtn.innerHTML = 'CONCLUIR EVENTO  <i class="bi bi-check-circle"></i>';
        details.appendChild(concluidoBtn);
        concluidoBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            notification.classList.add("finished");
            concluidoBtn.disabled = true;
            concluidoBtn.innerHTML = 'CONCLUÍDO <i class="bi bi-check-circle"></i>';

            concluirEvento(notification.dataset.id);

            const concluidosDiv = document.querySelector("#concluidos");
            if (concluidosDiv) {
                concluidosDiv.appendChild(notification);
            }
        });
    };

    const recusa = async function(eventoid, justificativaValue) {
        const dados = {
            status: 3,
            justificativa_notificacao: justificativaValue
        };
        await atualizaPE(dados, eventoid);
    };

    const confirmarPresenca = async function(eventoid) {
        const dados = {
            status: 2,
            justificativa_notificacao: null
        };
        await atualizaPE(dados, eventoid);
    };

    const concluirEvento = async function(eventoid) {
        const dados = {
            status: 4,
            justificativa_notificacao: null
        };
        await atualizaPE(dados, eventoid);
    };

    const atualizaPE = async function(dados, eventoid) {
        try {
            const response = await fetch(`/api/participacaoEventos/${payload.id}/${eventoid}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dados)
            });
            const result = await response.json();
            return result;
        } catch (error) {
            console.error("Erro ao atualizar participação:", error);
        }
    };

    // Função principal
    const carregarNotificacoes = async () => {
        // Verificar se main existe
        const main = document.querySelector('main'); // ou o seletor correto do seu container
        if (!main) {
            console.error("Elemento main não encontrado");
            return;
        }

        let searchNotificacao = document.querySelector('#searchNotificacao');
        if (!searchNotificacao) {
            searchNotificacao = document.createElement('div');
            searchNotificacao.className = 'search-bar';
            searchNotificacao.innerHTML = `
                <input id="searchNotificacao" type="text" placeholder="Pesquisar...">
                <i class="bi bi-search"></i>
            `;
            
            // Adicionar ao main
            main.appendChild(searchNotificacao);

            setTimeout(() => {
                const input = document.querySelector('#searchNotificacao');
                if (input) {
                    input.addEventListener('input', () => {
                        const termo = input.value.toLowerCase();
                        const notificacoes = document.querySelectorAll('.notification');
                        notificacoes.forEach(notificacao => {
                            const strong = notificacao.querySelector('strong');
                            const texto = strong ? strong.textContent.toLowerCase() : '';
                            notificacao.style.display = texto.includes(termo) ? 'flex' : 'none';
                        });
                    });
                }
            }, 0);
        }

        let notificacoesDiv = document.querySelector('#notificacoesDiv');
        if (!notificacoesDiv) {
            notificacoesDiv = document.createElement('div');
            notificacoesDiv.id = 'notificacoesDiv';
            main.appendChild(notificacoesDiv);
        }

        try {
            const response = await fetch(`/api/participacaoEventos/${payload.id}`);
            const notificacoes = await response.json();
           
            notificacoesDiv.innerHTML = `
                <h3>Pendentes</h3>
                <div id="pendentes"></div>

                <h3>Confirmadas</h3>
                <div id="confirmadas"></div>

                <h3>Recusadas</h3>
                <div id="recusadas"></div>

                <h3>Concluídos</h3>
                <div id="concluidos"></div>
            `;

            if (!notificacoes || notificacoes.length === 0) {
                notificacoesDiv.innerHTML = '<p class="text-center mt-3">Nenhuma notificação encontrada.</p>';
                return;
            }

            notificacoes.forEach(not => {            
                const notDate = new Date(not.Data_Evento);

                const year = notDate.getFullYear();
                const month = String(notDate.getMonth() + 1).padStart(2, '0');
                const day = String(notDate.getDate()).padStart(2, '0');
                const hours = String(notDate.getHours()).padStart(2, '0');
                const minutes = String(notDate.getMinutes()).padStart(2, '0');

                const dataFormatada = `${day}/${month}/${year} ${hours}:${minutes}`;

                let notificacao = document.createElement('div');
                notificacao.className = 'notification flex-row';
                notificacao.dataset.id = not.ID_Evento;

                let texto = `
                <i class="bi bi-bell"></i>
                <div class="content">
                    <strong>${not.Nome_Evento} <br> Data: ${dataFormatada}</strong>
                    <div class="details flex-column">`;

                // Verificar se Local_Evento existe antes de usar includes
                if (not.Local_Evento && (not.Local_Evento.includes('https://') || not.Local_Evento.includes('http://'))) {
                    texto += `<a href="${not.Local_Evento}" target="_blank">${not.Local_Evento}</a>`;
                } else {
                    texto += `<div>${not.Local_Evento || 'Local não informado'}</div>`;
                }

                texto += `
                        <p>${not.Descricao || ''}</p>
                        <p>PARTICIPAR:</p>
                        <div class="buttons">
                            <button class="accept">ACEITAR <i class="bi bi-check-circle"></i></button>
                            <button class="reject">RECUSAR <i class="bi bi-x-circle"></i></button>
                        </div>
                        <div class="justificativa">
                            <label for="just-input"><strong>Justificativa:</strong></label>
                            <div class="input-area">
                                <textarea id="just-input" placeholder="Digite sua justificativa..." required></textarea>
                                <button class="send"><i class="bi bi-send"></i></button>
                            </div>  
                        </div>
                    </div>
                </div>`;

                notificacao.innerHTML = texto;
                
                // Lógica de status
                if (not.ID_Status === 2) {
                    notificacao.classList.add("inactive", "accepted");
                    criarConcluir(notificacao);
                    
                    const details = notificacao.querySelector(".details");
                    if (details) details.style.maxHeight = 'none';
                    
                    const participar = notificacao.querySelector("p:nth-of-type(2)");
                    if (participar) participar.style.display = 'none';
                    
                    const buttons = notificacao.querySelector('.buttons');
                    if (buttons) buttons.style.display = 'none';

                    const confirmadasDiv = document.querySelector("#confirmadas");
                    if (confirmadasDiv) confirmadasDiv.appendChild(notificacao);
                } else if (not.ID_Status === 3) {
                    notificacao.classList.add("inactive", "rejected");
                    const recusadasDiv = document.querySelector("#recusadas");
                    if (recusadasDiv) recusadasDiv.appendChild(notificacao);
                } else if (not.ID_Status === 4) {
                    notificacao.classList.add("inactive", "concluido", "accepted");

                    const details = notificacao.querySelector(".details");
                    if (details) details.style.maxHeight = 'none';
                    
                    const participar = notificacao.querySelector("p:nth-of-type(2)");
                    if (participar) participar.style.display = 'none';
                    
                    const buttons = notificacao.querySelector('.buttons');
                    if (buttons) buttons.style.display = 'none';

                    const concluidoBtn = document.createElement("button");
                    concluidoBtn.className = "concluido";
                    concluidoBtn.innerHTML = 'CONCLUIR EVENTO  <i class="bi bi-check-circle"></i>';
                    if (details) details.appendChild(concluidoBtn);

                    notificacao.classList.add("finished");
                    concluidoBtn.disabled = true;
                    concluidoBtn.innerHTML = 'CONCLUÍDO <i class="bi bi-check-circle"></i>';

                    const concluidosDiv = document.querySelector("#concluidos");
                    if (concluidosDiv) concluidosDiv.appendChild(notificacao);
                } else {
                    const pendentesDiv = document.querySelector("#pendentes");
                    if (pendentesDiv) pendentesDiv.appendChild(notificacao);
                }
            });

            // Configurar event listeners para as notificações
            document.querySelectorAll(".notification").forEach(notification => {
                const details = notification.querySelector(".details");
                const justificativa = notification.querySelector(".justificativa");
                if (details && !notification.classList.contains("inactive")) details.style.maxHeight = "0";
                if (justificativa) justificativa.style.display = "none";
            });

            document.querySelectorAll(".notification").forEach(notification => {
                const eventoid = notification.dataset.id;
                const rejectBtn = notification.querySelector(".reject");
                const acceptBtn = notification.querySelector(".accept");
                const sendBtn = notification.querySelector(".justificativa .send");
                const justificativa = notification.querySelector(".justificativa");
                const justificativaInput = notification.querySelector(".justificativa #just-input");
                const details = notification.querySelector(".details");

                notification.addEventListener("click", () => {
                    if (notification.classList.contains("inactive")) return;
                    
                    document.querySelectorAll(".notification").forEach(n => {
                        if (n !== notification && !n.classList.contains("inactive")) {
                            n.classList.remove("active");
                            const d = n.querySelector(".details");
                            if (d) d.style.maxHeight = "0";
                            const j = n.querySelector(".justificativa");
                            if (j) j.style.display = "none";
                        }
                    });
                    
                    notification.classList.toggle("active");
                    if (details) {
                        details.style.maxHeight = details.style.maxHeight === "0px" || !details.style.maxHeight ? 
                            details.scrollHeight + "px" : "0";
                    }
                });

                if (rejectBtn && justificativa) {
                    rejectBtn.addEventListener("click", (event) => {
                        event.stopPropagation();
                        justificativa.style.display = justificativa.style.display === "block" ? "none" : "block";
                        if (details && justificativa.style.display === "block") {
                            details.style.maxHeight = details.scrollHeight + "px";
                        }
                    });
                    
                    justificativa.addEventListener("click", (event) => {
                        event.stopPropagation();
                    });
                }

                if (sendBtn) {
                    sendBtn.addEventListener("click", (event) => {
                        event.stopPropagation();
                        notification.classList.remove("active");
                        notification.classList.add("inactive", "rejected");
                        justificativa.style.display = "none";
                        
                        if (acceptBtn && acceptBtn.parentElement) {
                            acceptBtn.parentElement.style.display = "none";
                        }
                        
                        if (details) {
                            const participar = details.querySelector("p:nth-of-type(2)");
                            if (participar) participar.style.display = "none";
                        }

                        recusa(eventoid, justificativaInput.value);

                        const recusadasDiv = document.querySelector("#recusadas");
                        if (recusadasDiv) recusadasDiv.appendChild(notification);
                    });
                }

                if (acceptBtn) {
                    acceptBtn.addEventListener("click", (event) => {
                        event.stopPropagation();
                        notification.classList.remove("active");
                        notification.classList.add("inactive", "accepted");
                        
                        if (details) {
                            details.style.maxHeight = "none";
                            const participar = details.querySelector("p:nth-of-type(2)");
                            if (participar) participar.style.display = "none";
                        }
                        
                        if (justificativa) justificativa.style.display = "none";
                        if (acceptBtn.parentElement) acceptBtn.parentElement.style.display = "none";

                        if (details && !details.querySelector(".concluido")) {
                            criarConcluir(notification);
                        }

                        confirmarPresenca(eventoid);

                        const confirmadasDiv = document.querySelector("#confirmadas");
                        if (confirmadasDiv) confirmadasDiv.appendChild(notification);
                    });
                }
            });

        } catch (error) {
            console.error("Erro ao carregar notificações:", error);
            notificacoesDiv.innerHTML = '<p class="text-center text-danger mt-3">Falha ao carregar dados das notificações.</p>';
        }
    };

    carregarNotificacoes();
}

inicarNotificacao();