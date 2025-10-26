import React, { useEffect, useState } from 'react'
import axios from "axios";
import { useAuth } from '../context/AuthContext'
import { Logo } from '../components/Logo'
import "../css/login.css"
import { useNavigate } from 'react-router-dom'

export const Login = () => {
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erroLogin, setErroLogin] = useState('')
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "NeweLog - Login";
    document.body.classList.add("login-page");

    return () => {
      document.body.classList.remove("login-page");
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:3000/api/auth/login", { email, senha });
      login(res.data.token);
      setErroLogin('');
      navigate("/home");
    } catch (err: any) {
      const erroMessage = err.response?.data?.mensagem || err.message;
      setErroLogin(erroMessage);
    }
  }

  return (
    <main className="container-fluid d-flex p-0 m-0">
      <div className="fundo-sombra d-flex flex-column col-12 pe-3 ps-3 col-lg-7">
        <Logo />
        <div id="rowForm" className="col-lg-8 my-auto my-lg-5 pb-4 pe-3 ps-3 row">
          <form onSubmit={handleSubmit} className="d-flex flex-column">
            <h2 className="mb-4">Entrar</h2>

            <div className="mb-3">
              <input
                type="email"
                className="form-control"
                id="email"
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
                placeholder="Senha"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
              />
              <span className="form-text ms-1 mt-2 text-white">
                Esqueceu a senha?
              </span>
            </div>

            {erroLogin && (
              <div
                id="erroLogin"
                className="mb-3 bg-warning text-danger text-center py-3 px-2"
                style={{
                  borderRadius: "10px",
                  fontWeight: "600"
                }}
              >
                {erroLogin}
              </div>
            )}

            <button type="submit" className="btn align-self-center">
              <span className="space"></span>
              <span id="entrar-btn-text" className='py-1'>ENTRAR</span>
              <span id="setaLogin" className="d-flex">
                <i className="bi bi-arrow-right-circle-fill" style={{ fontSize: "28px", display: "flex", alignItems: "center" }}></i>
              </span>
            </button>
          </form>
        </div>
      </div>
    </main>
  )
}
