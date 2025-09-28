function inicarNotificacao()
{
    const participacaoModal = new bootstrap.Modal(document.querySelector("#participacaoModal"))

    const carregarNotificacoes = async () => {
    let searchNotificacao = document.querySelector('#searchNotificacao');
    if (!searchNotificacao){
        searchNotificacao = document.createElement('div');
        searchNotificacao.className = 'search-bar';
        searchNotificacao.innerHTML = `
            <input id="searchNotificacao" type="text" placeholder="Pesquisar...">
            <i class="bi bi-search"></i>
        `;
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
        main.appendChild(searchNotificacao);
    }

    let notificacoesDiv = document.querySelector('#notificacoesDiv');
    if (!notificacoesDiv){
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
        if (notificacoes.length === 0) {
            notificacoesDiv.innerHTML = '<p class="text-center mt-3">Nenhuma notificação encontrado.</p>';
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
            notificacao.dataset.id =  not.ID_Evento

            let texto = `
            <i class="bi bi-bell"></i>
            <div class="content">
                <strong>${not.Nome_Evento} <br> Data: ${dataFormatada}</strong>
                <div class="details flex-column">`
            if (not.Local_Evento.includes('https://') || not.Local_Evento.includes('http://')){
                texto += `<a href="${not.Local_Evento}" target="_blank">${not.Local_Evento}</a>`;
            } else {
                texto += `<div>${not.Local_Evento}</div>`;
            }
            texto += `
                    <p>${not.Descricao}</p>
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
            
            if (not.ID_Status === 2) {
                notificacao.classList.add("inactive", "accepted");

                criarConcluir(notificacao)
                const details = notificacao.querySelector(".details");
                details.style.maxHeight = 'none'
                const participar = details.querySelector("p:nth-of-type(2)");
                participar.style.display = 'none'
                const buttons = notificacao.querySelector('.buttons')
                buttons.style.display = 'none'

                document.querySelector("#confirmadas").appendChild(notificacao);
            } else if (not.ID_Status === 3) {
                notificacao.classList.add("inactive", "rejected");
                document.querySelector("#recusadas").appendChild(notificacao);
            } else if (not.ID_Status === 4) {
                notificacao.classList.add("inactive", "concluido", "accepted");

                const details = notificacao.querySelector(".details");
                details.style.maxHeight = 'none'
                const participar = details.querySelector("p:nth-of-type(2)");
                participar.style.display = 'none'
                const buttons = notificacao.querySelector('.buttons')
                buttons.style.display = 'none'

                const concluidoBtn = document.createElement("button");
                concluidoBtn.className = "concluido";
                concluidoBtn.innerHTML = 'CONCLUIR EVENTO  <i class="bi bi-check-circle"></i>';
                details.appendChild(concluidoBtn);

                notificacao.classList.add("finished");
                concluidoBtn.disabled = true;
                concluidoBtn.innerHTML = 'CONCLUÍDO <i class="bi bi-check-circle"></i>';

                document.querySelector("#concluidos").appendChild(notificacao);
            } else {
                document.querySelector("#pendentes").appendChild(notificacao);
            }
        });

        document.querySelectorAll(".notification").forEach(notification => {
            const details = notification.querySelector(".details");
            const justificativa = notification.querySelector(".justificativa");
            if(details && !notification.classList.contains("inactive")) details.style.maxHeight = "0";
            if(justificativa) justificativa.style.display = "none";
        });

        document.querySelectorAll(".notification").forEach(notification => {
            const eventoid = notification.dataset.id
            const rejectBtn = notification.querySelector(".reject");
            const acceptBtn = notification.querySelector(".accept");
            const sendBtn = notification.querySelector(".justificativa .send");
            const justificativa = notification.querySelector(".justificativa");
            const justificativaInput = notification.querySelector(".justificativa #just-input");
            const details = notification.querySelector(".details");

            notification.addEventListener("click", () => {
                if(notification.classList.contains("inactive")) return;
                document.querySelectorAll(".notification").forEach(n => {
                    if(n !== notification && !n.classList.contains("inactive")){
                        n.classList.remove("active");
                        const d = n.querySelector(".details");
                        if(d) d.style.maxHeight = "0";
                        const j = n.querySelector(".justificativa");
                        if(j) j.style.display = "none";
                    }
                });
                notification.classList.toggle("active");
                if(details) details.style.maxHeight = details.style.maxHeight === "0px" || !details.style.maxHeight ? details.scrollHeight + "px" : "0";
            });

            if(rejectBtn && justificativa){
                rejectBtn.addEventListener("click",(event)=>{
                    event.stopPropagation(); // impedir que feche
                    justificativa.style.display = justificativa.style.display==="block" ? "none" : "block";
                    if (details && justificativa.style.display === "block") {
                        details.style.maxHeight = details.scrollHeight + "px";
                    }
                });
                justificativa.addEventListener("click",(event)=>{
                    event.stopPropagation(); // impedir que feche
                });
            }

            if (sendBtn){
                sendBtn.addEventListener("click",(event)=>{
                    event.stopPropagation();
                    notification.classList.remove("active");
                    notification.classList.add("inactive","rejected");
                    justificativa.style.display = "none";
                    if(acceptBtn && acceptBtn.parentElement) acceptBtn.parentElement.style.display="none";
                    if(details){
                        const participar = details.querySelector("p:nth-of-type(2)");
                        if(participar) participar.style.display="none";
                    }

                    recusa(eventoid, justificativaInput.value);

                    document.querySelector("#recusadas").appendChild(notification);
                });
            }

            if(acceptBtn){
                acceptBtn.addEventListener("click",(event)=>{
                    event.stopPropagation();
                    notification.classList.remove("active");
                    notification.classList.add("inactive","accepted");
                    if(details){
                        details.style.maxHeight="none";
                        const participar = details.querySelector("p:nth-of-type(2)");
                        if(participar) participar.style.display="none";
                    }
                    if(justificativa) justificativa.style.display="none";
                    if(acceptBtn.parentElement) acceptBtn.parentElement.style.display="none";

                    if (!details.querySelector(".concluido")) {
                        criarConcluir(notification)
                    }

                    confirmarPresenca(eventoid);

                    document.querySelector("#confirmadas").appendChild(notification);
                });
            }
        });

    } catch (error) {
        console.error("Erro ao carregar notificações:", error);
        notificacoesDiv.innerHTML = '<p class="text-center text-danger mt-3">Falha ao carregar dados das notificações.</p>';
    }
};

const criarConcluir = (notification) => {
    const concluidoBtn = document.createElement("button");
    concluidoBtn.className = "concluido";
    concluidoBtn.innerHTML = 'CONCLUIR EVENTO  <i class="bi bi-check-circle"></i>';
    
    notification.querySelector(".details").appendChild(concluidoBtn);

    concluidoBtn.addEventListener("click", async (e) => {
        e.stopPropagation();

        const response = await fetch(`/api/participacaoEventos/${payload.id}/${notification.dataset.id}`);
        const notificacao = await response.json();
        
        const eventoDate = new Date(notificacao.Data_Evento);

        const year = eventoDate.getFullYear();
        const month = String(eventoDate.getMonth() + 1).padStart(2, '0');
        const day = String(eventoDate.getDate()).padStart(2, '0');
        const hours = String(eventoDate.getHours()).padStart(2, '0');
        const minutes = String(eventoDate.getMinutes()).padStart(2, '0');

        const dataParaInput = `${year}-${month}-${day}T${hours}:${minutes}`;

        document.querySelector("#dataPart").value = dataParaInput;
        document.querySelector("#duracaoPart").value = notificacao.Duracao_Evento;
        document.querySelector("#conhecimentoAdqPart").value = '';

        participacaoModal.currentNotification = notification;

        participacaoModal.show();
    });
    
};

document.querySelector("#formParticipacao").addEventListener("submit", async (e) => {
    e.preventDefault();

    const notification = participacaoModal.currentNotification;
    if (!notification) return;

    const eventoid = notification.dataset.id;
    const dataPart = document.querySelector("#dataPart").value;
    const duracaoPart = document.querySelector("#duracaoPart").value;
    const conhecimentoAdqPart = document.querySelector("#conhecimentoAdqPart").value;

    const dados = {
        data_evento: dataPart,
        duracao: duracaoPart,
        conhecimentos: conhecimentoAdqPart
    };

    try {
        const response = await fetch(`/api/certificadoParticipacao/${payload.id}/${eventoid}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dados)
        });

        const result = await response.json();

        if (response.ok) {
            await concluirEvento(eventoid);

            notification.classList.add("inactive", "finished");
            const btn = notification.querySelector(".concluido");
            btn.disabled = true;
            btn.innerHTML = 'CONCLUÍDO <i class="bi bi-check-circle"></i>';

            document.querySelector("#concluidos").appendChild(notification);

            participacaoModal.hide();
        } else {
            alert("Erro ao salvar os dados do evento: " + (result.message || "Erro desconhecido"));
        }
    } catch (error) {
        console.error(error);
        alert("Erro ao enviar os dados. Tente novamente.");
    }
});


const recusa = async function(eventoid, justificativaValue){
    const dados = {
        status: 3,
        justificativa_notificacao: justificativaValue
    }
    atualizaPE(dados, eventoid)
}
const confirmarPresenca = async function(eventoid){
    const dados = {
        status: 2,
        justificativa_notificacao: null
    }
    atualizaPE(dados, eventoid)
}
const concluirEvento = async function(eventoid){
    const dados = {
        status: 4,
        justificativa_notificacao: null
    }
    atualizaPE(dados, eventoid)
}
const atualizaPE = async function(dados, eventoid){
    const response = await fetch(`/api/participacaoEventos/${payload.id}/${eventoid}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dados)
    });
    const result = await response.json();
}

carregarNotificacoes()}

inicarNotificacao();