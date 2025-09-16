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

        const dataObj = new Date(data + 'T00:00:00');
        const dataFormatada = dataObj.toLocaleDateString('pt-BR');

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

    // Exportar para PDF
    document.getElementById('btn-download-pdf').addEventListener('click', function () {
        const elemento = document.getElementById('resultado');

        if (!elemento.textContent.trim()) {
            alert("Por favor, gere a ata antes de exportar para PDF.");
            return;
        }

        // Criar cópia temporária com <br> para preservar quebras no PDF
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = elemento.textContent.replace(/\n/g, '<br>');

        const opt = {
            margin:       [10, 10, 10, 10],
            filename:     'ata_reuniao.pdf',
            image:        { type: 'jpeg', quality: 0.98 },
            html2canvas:  { scale: 2, useCORS: true },
            jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' },
            pagebreak:    { mode: ['css', 'legacy'] }
        };

        setTimeout(() => {
            html2pdf().set(opt).from(tempDiv).save();
        }, 200);
    });

});
