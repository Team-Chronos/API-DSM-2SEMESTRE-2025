import React, { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { Logo } from '../components/LogoLogin'
import "../css/login.css"
import { useNavigate } from 'react-router-dom'
import api from '../services/api';
import { LogoMobile } from '../components/Logo'

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
    <main className="login-page">
      <div className='mobile-header-only'>
        <LogoMobile />
        <div className='custom-shape-divider'>
          <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="shape-fill"></path>
          </svg>
        </div>
      </div>
      <div className="container-principal">
        <div className="fundo-sombra">
          <div id="rowForm">
            <form onSubmit={handleSubmit} className="login-form">
              <h2>Entrar</h2>
              <span className='mobile-subtittle'>Faça login para continuar</span>
              <div className="form-group">
                <label className='mobile-label'>NOME</label>
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
                <label className="mobile-label">SENHA</label>
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
                <span id="entrar-btn-text">
                  <span className='desktop-text'>ENTRAR</span>
                  <span className='mobile-text'>ENTRAR</span>
                </span>
                <span id="setaLogin" className='desktop-only-icon'>
                  <i className="bi bi-arrow-right-circle-fill"></i>
                </span>
              </button>
            </form>
          </div>
        </div>
        <div className="logo-container desktop-only-logo">
          <Logo />
        </div>
      </div>
    </main>
  )
}
