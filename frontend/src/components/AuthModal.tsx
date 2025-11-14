import { useState, useEffect } from 'react';
import { X, Mail, Lock, User } from 'lucide-react';
import { authService } from '../services/api';
import '../styles/AuthModal.css';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess?: (user: any) => void;
}

export default function AuthModal({ isOpen, onClose, onLoginSuccess }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  
  // Formulario de Login
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  // Formulario de Registro
  const [registerName, setRegisterName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Animación de entrada
  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      document.body.style.overflow = 'hidden';
    } else {
      setIsVisible(false);
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Reset form when switching between login/register
  useEffect(() => {
    setError('');
    setSuccess('');
  }, [isLogin]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
      resetForms();
    }, 300);
  };

  const resetForms = () => {
    setLoginEmail('');
    setLoginPassword('');
    setRegisterName('');
    setRegisterEmail('');
    setRegisterPassword('');
    setError('');
    setSuccess('');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await authService.login({
        email: loginEmail,
        password: loginPassword
      });

      setSuccess('¡Inicio de sesión exitoso!');
      
      setTimeout(() => {
        if (onLoginSuccess) {
          onLoginSuccess(response.user);
        }
        handleClose();
        window.location.reload();
      }, 1000);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al iniciar sesión. Verifica tus credenciales.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    // Validaciones básicas
    if (!registerName.trim()) {
      setError('El nombre completo es requerido');
      setLoading(false);
      return;
    }

    if (!registerEmail.trim() || !registerEmail.includes('@')) {
      setError('Por favor ingresa un correo electrónico válido');
      setLoading(false);
      return;
    }

    if (registerPassword.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      setLoading(false);
      return;
    }

    try {
      const response = await authService.register({
        nombre_completo: registerName,
        email: registerEmail,
        password: registerPassword
      });

      setSuccess('¡Registro exitoso! Redirigiendo...');
      
      setTimeout(() => {
        if (onLoginSuccess) {
          onLoginSuccess(response.user);
        }
        handleClose();
        window.location.reload();
      }, 1000);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al registrarse. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        className={`auth-overlay ${isVisible ? 'visible' : ''}`}
        onClick={handleClose}
      />

      {/* Modal */}
      <div className={`auth-modal ${isVisible ? 'visible' : ''}`}>
        {/* Lado izquierdo - Imagen/Información */}
        <div className="auth-left">
          <div className="auth-left-content">
            <div className="auth-logo-section">
              <h1 className="auth-brand">StageGo</h1>
              <p className="auth-tagline">Tu plataforma de eventos</p>
            </div>
            
            <div className="auth-features">
              <div className="feature-item">
                <div className="feature-icon">✓</div>
                <div>
                  <h3>Acceso a eventos exclusivos</h3>
                  <p>Disfruta de los mejores shows y conciertos</p>
                </div>
              </div>
              
              <div className="feature-item">
                <div className="feature-icon">✓</div>
                <div>
                  <h3>Compra fácil y segura</h3>
                  <p>Sistema de pago confiable y rápido</p>
                </div>
              </div>
              
              <div className="feature-item">
                <div className="feature-icon">✓</div>
                <div>
                  <h3>Tus boletos siempre disponibles</h3>
                  <p>Accede a tu historial en cualquier momento</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Lado derecho - Formulario */}
        <div className="auth-right">
          <button className="auth-close" onClick={handleClose}>
            <X />
          </button>

          <div className="auth-form-container">
            <div className="auth-header">
              <h2>{isLogin ? 'Bienvenido de nuevo' : 'Crea una cuenta'}</h2>
              <p>
                {isLogin 
                  ? 'Inicia sesión para continuar' 
                  : 'Únete a StageGo hoy'}
              </p>
            </div>

            {/* Mensajes de error/éxito */}
            {error && (
              <div className="auth-message error">
                {error}
              </div>
            )}

            {success && (
              <div className="auth-message success">
                {success}
              </div>
            )}

            {/* Formulario de Login */}
            {isLogin ? (
              <form onSubmit={handleLogin} className="auth-form">
                <div className="form-group">
                  <label htmlFor="login-email">Correo electrónico</label>
                  <div className="input-wrapper">
                    <Mail className="input-icon" />
                    <input
                      id="login-email"
                      type="email"
                      placeholder="correo@ejemplo.com"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      required
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="login-password">Contraseña</label>
                  <div className="input-wrapper">
                    <Lock className="input-icon" />
                    <input
                      id="login-password"
                      type="password"
                      placeholder="••••••••"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      required
                      disabled={loading}
                    />
                  </div>
                </div>

                <button 
                  type="submit" 
                  className="auth-submit-btn"
                  disabled={loading}
                >
                  {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
                </button>

                <div className="auth-footer">
                  <button
                    type="button"
                    className="auth-link"
                    onClick={() => setIsLogin(false)}
                  >
                    ¿No tienes cuenta? <span>Regístrate</span>
                  </button>
                </div>
              </form>
            ) : (
              /* Formulario de Registro */
              <form onSubmit={handleRegister} className="auth-form">
                <div className="form-group">
                  <label htmlFor="register-name">Nombre completo</label>
                  <div className="input-wrapper">
                    <User className="input-icon" />
                    <input
                      id="register-name"
                      type="text"
                      placeholder="Juan Pérez"
                      value={registerName}
                      onChange={(e) => setRegisterName(e.target.value)}
                      required
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="register-email">Correo electrónico</label>
                  <div className="input-wrapper">
                    <Mail className="input-icon" />
                    <input
                      id="register-email"
                      type="email"
                      placeholder="correo@ejemplo.com"
                      value={registerEmail}
                      onChange={(e) => setRegisterEmail(e.target.value)}
                      required
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="register-password">Contraseña</label>
                  <div className="input-wrapper">
                    <Lock className="input-icon" />
                    <input
                      id="register-password"
                      type="password"
                      placeholder="••••••••"
                      value={registerPassword}
                      onChange={(e) => setRegisterPassword(e.target.value)}
                      required
                      disabled={loading}
                      minLength={6}
                    />
                  </div>
                </div>

                <button 
                  type="submit" 
                  className="auth-submit-btn"
                  disabled={loading}
                >
                  {loading ? 'Registrando...' : 'Crear cuenta'}
                </button>

                <div className="auth-footer">
                  <button
                    type="button"
                    className="auth-link"
                    onClick={() => setIsLogin(true)}
                  >
                    ¿Ya tienes cuenta? <span>Inicia sesión</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

