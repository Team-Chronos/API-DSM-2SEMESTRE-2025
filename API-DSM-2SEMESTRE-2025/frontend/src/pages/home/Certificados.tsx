import { useState } from "react";
import { todosOsCertificados } from "../../components/dadosCertificados";
import "../../css/certificados.css";
import { PdfPreviewIframe } from "../../utils/PdfPreview"

const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
);

export const Certificados = () => {
  const usuarioLogadoId = 1;
  const [searchText, setSearchText] = useState("");

  const meusCertificados = todosOsCertificados.filter(
    (cert) => cert.ID_colaborador === usuarioLogadoId
  );

  const certificadosFiltrados = meusCertificados.filter((cert) =>
    cert.Nome_Evento.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div id="certificados-module">
      <div className="barra-pesquisa">
        <input
          type="text"
          placeholder="Pesquisar por nome do evento..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <button className="botao-pesquisar" aria-label="Pesquisar">
          <SearchIcon />
        </button>
      </div>

      {certificadosFiltrados.length > 0 ? (
        <div className="grid-certificados">
          {certificadosFiltrados.map((cert) => (
            <a
              key={cert.id}
              href={cert.Url_Pdf}
              target="_blank"
              rel="noopener noreferrer"
              className="certificado-card-link"
            >
              <div className="certificado-card">
                <div className="card-preview">
                  <PdfPreviewIframe pdfUrl={cert.Url_Pdf} />
                </div>
                <div className="card-footer" title={cert.Nome_Evento}>
                  <span className="footer-title">{cert.Nome_Evento}</span>
                  <span className="footer-date">
                    {new Date(cert.Data_Part).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </a>
          ))}
        </div>
      ) : (
        <p className="text-center mt-3">Nenhum documento encontrado.</p>
      )}
    </div>
  );
};