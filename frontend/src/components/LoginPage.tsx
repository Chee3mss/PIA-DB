import DarkVeil from './DarkVeil'
import logo from '../assets/StageGo-logo.svg'
import '../styles/LoginPage.css'

export default function LoginPage() {
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
            <button className="btn btn-primary">Inicia sesión</button>
            <div className="welcome-divider">o</div>
            <p className="welcome-sub small">Crea una cuenta para comenzar a disfrutar</p>
            <button className="btn btn-outline">Crea tu cuenta</button>
          </div>
        </div>
    )
}


