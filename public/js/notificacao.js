const main = document.querySelector('main')
let notificacoesDiv = document.querySelector('#notificacoesDiv')
let searchNotificacao = document.querySelector('#searchNotificacao')

const carregarNotificacoes = async () => {
    searchNotificacao = document.querySelector('#searchNotificacao')
    if (!searchNotificacao){
        searchNotificacao = document.createElement('div')
        searchNotificacao.className = 'search-bar'
    
        searchNotificacao.innerHTML = `
            <input id="searchNotificacao" type="text" placeholder="Pesquisar...">
            <i class="bi bi-search"></i>
        `

        setTimeout(() => {
            const input = document.querySelector('#searchNotificacao');
            if (input) {
                input.addEventListener('input', () => {
                    const termo = input.value.toLowerCase();
                    const notificacoes = document.querySelectorAll('.notification');

                    notificacoes.forEach(notificacao => {
                        const strong = notificacao.querySelector('strong');
                        const texto = strong ? strong.textContent.toLowerCase() : '';
                        
                        if (texto.includes(termo)) {
                            notificacao.style.display = 'flex';
                        } else {
                            notificacao.style.display = 'none';
                        }
                    });
                });
            }
        }, 0);

        main.appendChild(searchNotificacao)
    }

    notificacoesDiv = document.querySelector('#notificacoesDiv')
    if (!notificacoesDiv){
        notificacoesDiv = document.createElement('div')
        notificacoesDiv.id = 'notificacoesDiv'
        main.appendChild(notificacoesDiv)
    }

    try {
        // const response = await fetch('/api/notificacoes');
        // const notificacoes = await response.json();
        
        // teste, apagar depois da conexão com o banco
        const notificacoes = [
            {
                Title: 'Calabreso damasco',
                data: '21/03/2025 16:43',
                Local: 'https://google.com'
            },
            {
                Title: 'Mista fria',
                data: '31/03/2023 13:37',
                Local: 'https://google.com'
            },
            {
                Title: 'macaco doce',
                data: '22/02/2022 12:43',
                Local: 'bom dia'
            },

        ]

        notificacoesDiv.innerHTML = '';
        if (notificacoes.length === 0) {
            notificacoesDiv.innerHTML = '<p class="text-center mt-3">Nenhuma notificação encontrado.</p>';
            return;
        }

        notificacoes.forEach(not => {
            let notificacao = document.createElement('div');
            notificacao.className = 'notification flex-row';
            let texto
            texto = `
            <i class="bi bi-bell"></i>
            <div class="content">
                <strong>${not.Title} ${not.data}</strong>
                <div class="details flex-column">`
            if (not.Local.includes('https://') || not.Local.includes('http://')){
                texto += `
                    <a href="${not.Local}" target="_blank">${not.Local}</a>`
            }
            else{
                texto += `
                    <div>${not.Local}</div>
                `
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
            </div>
            `;
            notificacao.innerHTML = texto
            notificacoesDiv.appendChild(notificacao);
        })
    } catch (error) {
        console.error("Erro ao carregar notificações:", error);
        notificacoesDiv.innerHTML = '<p class="text-center text-danger mt-3">Falha ao carregar dados das notificações.</p>';
    }

    window.addEventListener("DOMContentLoaded", () => {
        document.querySelectorAll(".notification").forEach(notification => {
            const details = notification.querySelector(".details");
            const justificativa = notification.querySelector(".justificativa");
            if(details && !notification.classList.contains("inactive")) details.style.maxHeight = "0";
            if(justificativa) justificativa.style.display = "none";


            if(justificativa){
                justificativa.addEventListener("click", event => {
                    event.stopPropagation();
                });
            }
        });

        document.querySelectorAll(".notification").forEach(notification => {
            const rejectBtn = notification.querySelector(".reject");
            const acceptBtn = notification.querySelector(".accept");
            const sendBtn = notification.querySelector(".justificativa .send");
            const justificativa = notification.querySelector(".justificativa");
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

                console.log('rejectBtn')
                if(rejectBtn && justificativa){
                    rejectBtn.addEventListener("click", (event)=>{
                        event.stopPropagation();
                        justificativa.style.display = justificativa.style.display==="block" ? "none" : "block";
                        if (details && justificativa.style.display === "block") {
                            details.style.maxHeight = details.scrollHeight + "px";
                        }
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
                        const container = notification.parentElement;
                        notification.style.transition = "transform 0.5s ease";
                        notification.style.transform = "translateY(20px)";
                        setTimeout(() => {
                            notification.style.transform = "translateY(0)";
                            container.appendChild(notification);
                        }, 10);
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

                        const container = notification.parentElement;
                        notification.style.transition = "transform 0.5s ease";
                        notification.style.transform = "translateY(20px)";
                        setTimeout(() => {
                            notification.style.transform = "translateY(0)";
                            container.appendChild(notification);
                        }, 10);
                    });
                }
            });
        });
    });
};