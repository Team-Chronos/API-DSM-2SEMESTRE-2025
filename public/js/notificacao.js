function inicarNotificacao()
{
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
        const notificacoes = [
            { Title: 'Calabreso damasco', data: '21/03/2025 16:43', Local: 'https://google.com' },
            { Title: 'Mista fria', data: '31/03/2023 13:37', Local: 'https://google.com' },
            { Title: 'macaco doce', data: '22/02/2022 12:43', Local: 'bom dia' }
        ];
        notificacoesDiv.innerHTML = '';
        if (notificacoes.length === 0) {
            notificacoesDiv.innerHTML = '<p class="text-center mt-3">Nenhuma notificação encontrado.</p>';
            return;
        }
        notificacoes.forEach(not => {
            let notificacao = document.createElement('div');
            notificacao.className = 'notification flex-row';
            let texto = `
            <i class="bi bi-bell"></i>
            <div class="content">
                <strong>${not.Title} ${not.data}</strong>
                <div class="details flex-column">`
            if (not.Local.includes('https://') || not.Local.includes('http://')){
                texto += `<a href="${not.Local}" target="_blank">${not.Local}</a>`;
            } else {
                texto += `<div>${not.Local}</div>`;
            }
            texto += `
                    <p>REUNIÃO DE DEBATE SOBRE NOVA REGULAMENTAÇÃO.</p>
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
            notificacoesDiv.appendChild(notificacao);
        });

        document.querySelectorAll(".notification").forEach(notification => {
            const details = notification.querySelector(".details");
            const justificativa = notification.querySelector(".justificativa");
            if(details && !notification.classList.contains("inactive")) details.style.maxHeight = "0";
            if(justificativa) justificativa.style.display = "none";
        });

        document.querySelectorAll(".notification").forEach(notification => {
            const rejectBtn = notification.querySelector(".reject");
            const acceptBtn = notification.querySelector(".accept");
            const sendBtn = notification.querySelector(".justificativa .send");
            const justificativa = notification.querySelector(".justificativa");
            const details = notification.querySelector(".details");

            const moverTopoRespondidas = () => {
                const container = notification.parentElement;
                notification.style.transition = "transform 0.5s ease";
                notification.style.transform = "translateY(20px)";
                setTimeout(() => {
                    notification.style.transform = "translateY(0)";
                    const primeiroRespondido = Array.from(container.querySelectorAll('.notification.accepted, .notification.rejected'))
                                                   .find(n => n !== notification);
                    if(primeiroRespondido){
                        container.insertBefore(notification, primeiroRespondido);
                    } else {
                        container.appendChild(notification);
                    }
                }, 10);
            };

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

            if(sendBtn){
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
                    moverTopoRespondidas();
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
                        const concluidoBtn = document.createElement("button");
                        concluidoBtn.className = "concluido";
                        concluidoBtn.innerHTML = 'CONCLUIR EVENTO  <i class="bi bi-check-circle"></i>';
                        details.appendChild(concluidoBtn);
                        concluidoBtn.addEventListener("click",(e)=>{
                            e.stopPropagation();
                            notification.classList.add("finished");
                            concluidoBtn.disabled = true;
                            concluidoBtn.innerHTML = 'CONCLUÍDO <i class="bi bi-check-circle"></i>';
                        });
                    }

                    moverTopoRespondidas();
                });
            }
        });

    } catch (error) {
        console.error("Erro ao carregar notificações:", error);
        notificacoesDiv.innerHTML = '<p class="text-center text-danger mt-3">Falha ao carregar dados das notificações.</p>';
    }
};

carregarNotificacoes()}

inicarNotificacao();