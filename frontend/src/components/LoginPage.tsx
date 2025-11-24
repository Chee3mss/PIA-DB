import { useState } from 'react'
import DarkVeil from './DarkVeil'
import AuthPanel from './AuthPanel'
import logo from '../assets/StageGo-logo.svg'
import '../styles/LoginPage.css'

export default function LoginPage() {
    const [isAuthOpen, setIsAuthOpen] = useState(false)
    const [isLoginMode, setIsLoginMode] = useState(true)

    const handleLoginClick = () => {
        setIsLoginMode(true)
        setIsAuthOpen(true)
    }

    const handleRegisterClick = () => {
        setIsLoginMode(false)
        setIsAuthOpen(true)
    }

    return (
        <div className="welcome">
          <DarkVeil />
          <div className="welcome-content">
            <h1>
              Inicia sesión o crea una cuenta en
            </h1>
            <img src={logo} alt="StageGo" className="welcome-logo" />
            <p className="welcome-sub">
              ¿Ya tienes tu cuenta digital?
            </p>
            <button className="btn btn-primary" onClick={handleLoginClick}>Inicia sesión</button>
            <div className="welcome-divider">o</div>
            <p className="welcome-sub small">Crea una cuenta para comenzar a disfrutar</p>
            <button className="btn btn-outline" onClick={handleRegisterClick}>Crea tu cuenta</button>
          </div>
          <AuthPanel 
            isOpen={isAuthOpen} 
            onClose={() => setIsAuthOpen(false)}
            onLoginSuccess={() => {
              setIsAuthOpen(false)
              window.location.href = '/'
            }}
          />
        </div>
    )
}


