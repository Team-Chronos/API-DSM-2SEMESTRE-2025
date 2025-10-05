import React, { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { Logo } from '../components/Logo'

import "../css/login.css"

export const Login = () => {
  useEffect(() => {
    document.title = "NeweLog - Login";
    document.body.classList.add("login-page");
    
    return () => {
      document.body.classList.remove("login-page");
    };
  }, []);
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    login(email, senha)
  }

  return (
    <main className="container-fluid d-flex p-0 m-0">
      <div className="fundo-sombra d-flex flex-column col-12 pe-3 ps-3 col-lg-7">
        <Logo></Logo>
        <div id="rowForm" className="col-lg-8 my-auto my-lg-5 pb-4 pe-3 ps-3 row">
          <form onSubmit={handleSubmit} className="d-flex flex-column">
            <h2 className="mb-4">Entrar <br /> email: admin@a senha: 123</h2>
            <div className="mb-3">
              <input
                type="email"
                className="form-control"
                id="email"
                name="email"
                placeholder="E-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <input
                type="password"
                className="form-control"
                id="senha"
                name="senha"
                placeholder="Senha"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
              />
              <span className="form-text ms-1 mt-2 text-white">
                Esqueceu a senha?
              </span>
            </div>
            <button type="submit" className="btn align-self-center">
              <span className="space"></span>
              <span id="entrar-btn-text" className='py-1'>ENTRAR</span>
              <span id="setaLogin" className="d-flex">
                <i className="bi bi-arrow-right-circle-fill" style={{ fontSize: "28px", display: "flex", alignItems: "center"}}></i>
              </span>
            </button>
          </form>
        </div>
      </div>
    </main>
  )
}