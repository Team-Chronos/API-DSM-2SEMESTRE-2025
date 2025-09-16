window.addEventListener('DOMContentLoaded', function () {

    // Gerar ata na página
    document.getElementById('btn-gerar').addEventListener('click', function () {
        const titulo = document.getElementById('titulo').value;
        const data = document.getElementById('data').value;
        const horaInicio = document.getElementById('hora_inicio').value;
        const local = document.getElementById('local').value;
        const pauta = document.getElementById('pauta').value;
        const descricao = document.getElementById('descricao').value;
        const responsavelAta = document.getElementById('responsavel_ata').value;

        // Formata a data para o padrão brasileiro (dd/mm/aaaa)
        const dataObj = new Date(data);
        const dataFormatada = dataObj.toLocaleDateString('pt-BR', {timeZone: 'UTC'});

        const textoAta =
`ATA DE REUNIÃO

Título: ${titulo}
Data: ${dataFormatada}
Hora de Início: ${horaInicio}
Local: ${local}
--------------------------------------------------
2. PAUTA DA REUNIÃO
${pauta}
--------------------------------------------------
3. DESCRIÇÃO SOBRE APRENDIZADOS
${descricao}
--------------------------------------------------
A presente ata foi redigida por ${responsavelAta} e reflete os pontos discutidos e as decisões tomadas na reunião.`;

        document.getElementById('resultado').textContent = textoAta;
    });

    // --- SEÇÃO CORRIGIDA ---
    // Exportar para PDF
    document.getElementById('btn-download-pdf').addEventListener('click', function () {
        const elemento = document.getElementById('resultado');

        // Verifica se a ata foi gerada antes de tentar baixar
        const placeholderText = 'A ata gerada aparecerá aqui após preencher o formulário e clicar no botão.';
        if (elemento.textContent.trim() === placeholderText || !elemento.textContent.trim()) {
            alert("Por favor, gere a ata na página antes de exportar para PDF.");
            return;
        }

        const opt = {
            margin:       [10, 10, 10, 10],
            filename:     'ata_reuniao.pdf',
            image:        { type: 'jpeg', quality: 0.98 },
            html2canvas:  { scale: 2, useCORS: true },
            jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' },
            pagebreak:    { mode: ['avoid-all', 'css', 'legacy'] }
        };

        // Gera o PDF diretamente do elemento visível 'resultado', que já está formatado pelo CSS
        html2pdf().set(opt).from(elemento).save();
    });

});