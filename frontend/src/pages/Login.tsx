import React, { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { Logo } from '../components/LogoLogin'
import "../css/login.css"
import { useNavigate } from 'react-router-dom'
import api from '../services/api';

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
      const res = await api.post("/auth/login", { email, senha });
      login(res.data.token);
      setErroLogin('');
      navigate("/home");
    } catch (err: any) {
      const erroMessage = err.response?.data?.mensagem || err.message;
      setErroLogin(erroMessage);
    }
  }

  return (
    <main className="container-principal">
      <div className="fundo-sombra">
        <div id="rowForm">
          <form onSubmit={handleSubmit} className="login-form">
            <h2>Entrar</h2>
  
            <div className="form-group">
              <input
                type="email"
                className="form-input"
                id="email"
                placeholder="E-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
  
            <div className="form-group">
              <input
                type="password"
                className="form-input"
                id="senha"
                placeholder="Senha"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
              />
            </div>
  
            {erroLogin && (
              <div id="erroLogin" className="erro-mensagem">
                {erroLogin}
              </div>
            )}
  
            <button type="submit" className="btn-login">
              <span className="space"></span>
              <span id="entrar-btn-text">ENTRAR</span>
              <span id="setaLogin">
                <i className="bi bi-arrow-right-circle-fill"></i>
              </span>
            </button>
          </form>
        </div>
      </div>
      <div className="logo-container">
          <Logo />
        </div>
    </main>
  )  
}
