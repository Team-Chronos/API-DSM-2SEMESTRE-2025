function inicarCertificados() {
    const carregarCertificados = async () => {
        let searchCertificado = document.querySelector('#searchCertificado');
        if (!searchCertificado) {
            searchCertificado = document.createElement('div');
            searchCertificado.className = 'search-bar';
            searchCertificado.innerHTML = `
                <input id="searchCertificado" type="text" placeholder="Pesquisar...">
                <i class="bi bi-search"></i>
            `;
            setTimeout(() => {
                const input = document.querySelector('#searchCertificado');
                if (input) {
                    input.addEventListener('input', () => {
                        const termo = input.value.toLowerCase();
                        const certificadosS = document.querySelectorAll('.certificado-card');
                        certificadosS.forEach(card => {
                            const texto = card.innerText.toLowerCase();
                            card.style.display = texto.includes(termo) ? 'flex' : 'none';
                        });
                    });
                }
            }, 0);
            main.appendChild(searchCertificado);
        }

        let certificadosDiv = document.querySelector('#certificadosDiv');
        if (!certificadosDiv) {
            certificadosDiv = document.createElement('div');
            certificadosDiv.id = 'certificadosDiv';
            certificadosDiv.style.display = 'grid';
            certificadosDiv.style.gridTemplateColumns = 'repeat(4, 1fr)';
            certificadosDiv.style.gap = '40px';
            certificadosDiv.style.marginTop = '20px';
            main.appendChild(certificadosDiv);
        }

        
        let modal = document.querySelector('#certificadoModal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'certificadoModal';
            modal.style.position = 'fixed';
            modal.style.top = '0';
            modal.style.left = '0';
            modal.style.width = '100%';
            modal.style.height = '100%';
            modal.style.background = 'rgba(0,0,0,0.6)';
            modal.style.display = 'none';
            modal.style.alignItems = 'center';
            modal.style.justifyContent = 'center';
            modal.style.zIndex = '1000';

            modal.innerHTML = `
                <div id="modalContent" style="
                    background: #fff; 
                    padding: 20px; 
                    border-radius: 8px; 
                    max-width: 600px; 
                    max-height: 80vh; 
                    overflow-y: auto;
                ">
                    <span id="closeModal" style="cursor:pointer;float:right;font-weight:bold;font-size:18px">&times;</span>
                    <div id="modalBody"></div>
                </div>
            `;

            document.body.appendChild(modal);

            document.querySelector('#closeModal').onclick = () => {
                modal.style.display = 'none';
            };

            modal.onclick = (e) => {
                if (e.target === modal) modal.style.display = 'none';
            };
        }

        try {
            const response = await fetch(`/api/certificadoParticipacao/${payload.id}`);
            const certificados = await response.json();

            certificadosDiv.innerHTML = ''; 

            certificados.forEach(cert => {
                const card = document.createElement('div');
                card.className = 'certificado-card';
                card.style.border = '1px solid var(--blue)';
                card.style.borderRadius = '20px';
                card.style.padding = '10px';
                card.style.backgroundColor = 'rgb(212 211 210)';
                card.style.display = 'flex';
                card.style.flexDirection = 'column';
                card.style.alignItems = 'center';
                card.style.boxShadow = '0 2px 6px rgba(0,0,0,0.1)';
                card.style.cursor = 'pointer';

                
                const pdfPreview = document.createElement('div');
                pdfPreview.style.width = '100%';
                pdfPreview.style.height = '220px';
                pdfPreview.style.background = '#fff';
                pdfPreview.style.border = '1px solid var(--blue)';
                pdfPreview.style.borderRadius = '15px';
                pdfPreview.style.padding = '10px';
                pdfPreview.style.fontSize = '12px';
                pdfPreview.style.overflow = 'hidden';
                pdfPreview.style.display = '-webkit-box';
                pdfPreview.style.webkitBoxOrient = 'vertical';
                pdfPreview.style.webkitLineClamp = '12'; 
                pdfPreview.style.textOverflow = 'ellipsis';
                pdfPreview.style.marginBottom = '10px';

                pdfPreview.innerHTML = `
                    <p><strong style="color: var(--dark-blue)">${cert.Nome_Col}</strong> participou do evento <strong style="color: var(--dark-blue)">${cert.Nome_Evento}</strong> 
                    com duração de <strong style="color: var(--dark-blue)">${cert.Duracao_Evento}</strong>, em <strong style="color: var(--dark-blue)">${new Date(cert.Data_Part).toLocaleDateString()}</strong>.</p>
                    
                    <p><strong style="color: var(--dark-blue)">Descrição do evento:</strong><br>${cert.Descricao || 'Sem descrição'}</p>
                    
                    <p><strong style="color: var(--dark-blue)">Local do evento:</strong><br>${cert.Local_Evento}</p>
                    
                    <p><strong style="color: var(--dark-blue)">Conhecimentos adquiridos:</strong><br>${cert.Descricao_Part || 'Não informado'}</p>
                `;
                card.appendChild(pdfPreview);

                
                const footer = document.createElement('div');
                footer.style.textAlign = 'center';
                footer.style.fontSize = '14px';
                footer.style.fontWeight = 'bold';
                footer.style.color = 'var(--dark-blue)';
                footer.innerHTML = `
                    ${cert.Nome_Evento}<br>
                    ${new Date(cert.Data_Part).toLocaleDateString()}
                `;
                card.appendChild(footer);

                
                card.addEventListener('click', () => {
                    const modalBody = document.querySelector('#modalBody');
                    modalBody.innerHTML = `
                        <h3>${cert.Nome_Evento}</h3>
                        <p><strong>${cert.Nome_Col}</strong> participou do evento <strong>${cert.Nome_Evento}</strong> 
                        com duração de <strong>${cert.Duracao_Evento}</strong>, em <strong>${new Date(cert.Data_Part).toLocaleDateString()}</strong>.</p>
                        
                        <p><strong>Descrição do evento:</strong><br>${cert.Descricao || 'Sem descrição'}</p>
                        
                        <p><strong>Local do evento:</strong><br>${cert.Local_Evento}</p>
                        
                        <p><strong>Conhecimentos adquiridos:</strong><br>${cert.Descricao_Part || 'Não informado'}</p>
                    `;
                    modal.style.display = 'flex';
                });

                certificadosDiv.appendChild(card);
            });

        } catch (err) {
            console.error('Erro ao carregar certificados:', err);
        }
    };

    carregarCertificados();
}

inicarCertificados();
