import { useState } from "react"
import { ModalCotacaoFrete } from "./CotacaoFrete"

export default function Cotacao(){
  const [ showModalCotacao, setShowModalCotacao] = useState(false)

  return(
    <>
      <button onClick={() => setShowModalCotacao(true)}>ver modal</button>
      <ModalCotacaoFrete
        show={showModalCotacao}
        onClose={() => setShowModalCotacao(false)}
      />
    </>
  )
}