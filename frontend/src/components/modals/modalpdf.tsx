import { Document, Page } from "react-pdf"
import "../../css/modalpdf.css"

interface Certificado {
  ID_Colaborador: number;
  ID_Evento: number;
  Arquivo_PDF: string;
  Nome_Evento: string;
  Data_Evento: string;
}

interface PdfPreviewProps {
  certificados: Certificado[];
}

function PdfPreview({ certificados = [] }: PdfPreviewProps) {

  return (
    <div>
      <div className="pdf-grid">
        {certificados.length > 0 ? (
          certificados.map((cert) => (
            <a
              key={`${cert.ID_Colaborador}-${cert.ID_Evento}`}
              href={`/certificadoParticipacao/download/${cert.Arquivo_PDF}`}
              className="pdf-card"
              rel="noopener noreferrer"
              
              title={`Baixar certificado: ${cert.Nome_Evento}`}
            >
              <div className="pdf-preview-container">
                <Document
                  file={`/certificadoParticipacao/download/${cert.Arquivo_PDF}`}
                  loading="Carregando prévia..."
                  error="Falha ao carregar prévia."
                >
                  <Page
                    pageNumber={1}
                    width={260}
                    renderTextLayer={false}
                    renderAnnotationLayer={false}
                  />
                </Document>
              </div>
              <p className="pdf-card-title">{cert.Nome_Evento}</p>
            </a> 
          ))
        ) : (
          <p>Nenhum certificado encontrado.</p>
        )}
      </div>
    </div>
  )
}

export default PdfPreview