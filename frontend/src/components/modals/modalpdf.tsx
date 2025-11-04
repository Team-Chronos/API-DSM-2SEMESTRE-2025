import { useEffect, useState } from "react"
import { Document, Page } from "react-pdf"
import "../../css/modalpdf.css"

interface Certificado {
  nome: string
  url: string
}

function PdfPreview({ filtro = "" }) {
  const [certificados, setCertificados] = useState<Certificado[]>([])

  useEffect(() => {
    async function fetchCertificados() {
      try {
        const response = await fetch("http://localhost:3000/api/certificados")
        const data = await response.json()
        setCertificados(data)
      } catch (error) {
        console.error("Erro ao carregar certificados:", error)
      }
    }
    fetchCertificados()
  }, [])

  const certificadosFiltrados = certificados.filter((cert) =>
    cert.nome.toLowerCase().includes(filtro.toLowerCase())
  )
  return (
    <div>
      <div className="pdf-grid">
        {certificadosFiltrados.length > 0 ? (
          certificadosFiltrados.map((cert) => (
            <div
              key={cert.nome}
              className="pdf-card" 
            >
              <div className="pdf-preview-container">
                <Document
                  file={`http://localhost:3000${cert.url}`}
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
              <p className="pdf-card-title">{cert.nome}</p>
            </div>
          ))
        ) : (
          <p>Nenhum certificado encontrado.</p>
        )}
      </div>
    </div>
  )
}

export default PdfPreview