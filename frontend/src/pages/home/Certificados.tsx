import { useState } from "react";

import "../../css/certificados.css";

import { pdfjs } from "react-pdf";

import PdfPreview from "../../components/modals/modalpdf";

const SearchIcon = () => (

  <svg

    xmlns="http://www.w3.org/2000/svg"

    width="20"

    height="20"

    viewBox="0 0 24 24"

    fill="none"

    stroke="currentColor"

    strokeWidth="2"

    strokeLinecap="round"

    strokeLinejoin="round"

  >

    <circle cx="11" cy="11" r="8"></circle>

    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>

  </svg>

);



pdfjs.GlobalWorkerOptions.workerSrc = new URL(

  "pdfjs-dist/build/pdf.worker.min.mjs",

  import.meta.url

).toString();



export const Certificados = () => {

  const [search, setSearch] = useState("");



  return (

    <div id="certificados-module">

      <div className="barra-pesquisa">

        <input

          type="text"

          placeholder="Pesquisar por nome do certificado..."

          value={search}

          onChange={(e) => setSearch(e.target.value)}

        />

        <button className="botao-pesquisar" aria-label="Pesquisar">

          <SearchIcon />

        </button>

      </div>

      <PdfPreview filtro={search} />

    </div>

  );

};