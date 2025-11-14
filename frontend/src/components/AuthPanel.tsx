import { useState } from 'react';
import { X, Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
import logo from '../assets/StageGo-logo.svg';
import { authService } from '../services/api';
import '../styles/AuthPanel.css';

interface AuthPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess?: () => void;
}

export default function AuthPanel({ isOpen, onClose, onLoginSuccess }: AuthPanelProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Estados del formulario de login
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });

  // Estados del formulario de registro
  const [registerData, setRegisterData] = useState({
    nombre_completo: '',
    email: '',
    telefono: '',
    password: '',
    confirmPassword: ''
  });

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await authService.login(loginData.email, loginData.password);
      setLoginData({ email: '', password: '' });
      if (onLoginSuccess) onLoginSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validaciones
    if (registerData.password !== registerData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    if (registerData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setLoading(true);

    try {
      await authService.register({
        nombre_completo: registerData.nombre_completo,
        email: registerData.email,
        telefono: registerData.telefono,
        password: registerData.password
      });
      
      // Limpiar formulario y cambiar a login
      setRegisterData({
        nombre_completo: '',
        email: '',
        telefono: '',
        password: '',
        confirmPassword: ''
      });
      
      setIsLogin(true);
      setError('');
      alert('¡Cuenta creada exitosamente! Ahora puedes iniciar sesión.');
    } catch (err: any) {
      setError(err.message || 'Error al crear la cuenta');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setError('');
    setLoginData({ email: '', password: '' });
    setRegisterData({
      nombre_completo: '',
      email: '',
      telefono: '',
      password: '',
      confirmPassword: ''
    });
    onClose();
  };

  return (
    <>
      {/* Overlay de fondo oscuro */}
      <div 
        className={`auth-overlay ${isOpen ? 'open' : ''}`}
        onClick={handleClose}
      />

      {/* Panel deslizante */}
      <div className={`auth-panel ${isOpen ? 'open' : ''}`}>
        <button className="auth-panel-close" onClick={handleClose}>
          <X className="icon" />
        </button>

        <div className="auth-panel-header">
          <img src={logo} alt="StageGo" className="auth-logo" />
          <h2>{isLogin ? 'Bienvenido de nuevo' : 'Crea una cuenta'}</h2>
          <p>{isLogin ? 'Inicia sesión para continuar' : 'Regístrate para comenzar a disfrutar'}</p>
        </div>

        <div className="auth-panel-content">
          {error && (
            <div className="auth-error">
              {error}
            </div>
          )}

          {isLogin ? (
            <form onSubmit={handleLoginSubmit} className="auth-form">
              <div className="form-group">
                <label htmlFor="login-email">Correo electrónico o teléfono</label>
                <div className="input-wrapper">
                  <Mail className="input-icon" />
                  <input
                    id="login-email"
                    type="text"
                    placeholder="Correo electrónico o teléfono"
                    value={loginData.email}
                    onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="login-password">Contraseña</label>
                <div className="input-wrapper">
                  <Lock className="input-icon" />
                  <input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Contraseña"
                    value={loginData.password}
                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                    required
                  />
                  <button
                    type="button"
                    className="toggle-password"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="icon" /> : <Eye className="icon" />}
                  </button>
                </div>
              </div>

              <button 
                type="button" 
                className="forgot-password"
                onClick={() => alert('Función de recuperación de contraseña por implementar')}
              >
                ¿Olvidaste la contraseña?
              </button>

              <button 
                type="submit" 
                className="btn-submit"
                disabled={loading}
              >
                {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegisterSubmit} className="auth-form">
              <div className="form-group">
                <label htmlFor="register-name">Nombre completo</label>
                <div className="input-wrapper">
                  <User className="input-icon" />
                  <input
                    id="register-name"
                    type="text"
                    placeholder="Nombre completo"
                    value={registerData.nombre_completo}
                    onChange={(e) => setRegisterData({ ...registerData, nombre_completo: e.target.value })}
                    required
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
                    placeholder="Correo electrónico"
                    value={registerData.email}
                    onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="register-phone">Teléfono</label>
                <div className="input-wrapper">
                  <Mail className="input-icon" />
                  <input
                    id="register-phone"
                    type="tel"
                    placeholder="Teléfono (10 dígitos)"
                    value={registerData.telefono}
                    onChange={(e) => setRegisterData({ ...registerData, telefono: e.target.value })}
                    required
                    maxLength={10}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="register-password">Contraseña</label>
                <div className="input-wrapper">
                  <Lock className="input-icon" />
                  <input
                    id="register-password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Contraseña (mínimo 6 caracteres)"
                    value={registerData.password}
                    onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    className="toggle-password"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="icon" /> : <Eye className="icon" />}
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="register-confirm-password">Confirmar contraseña</label>
                <div className="input-wrapper">
                  <Lock className="input-icon" />
                  <input
                    id="register-confirm-password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirmar contraseña"
                    value={registerData.confirmPassword}
                    onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                    required
                  />
                  <button
                    type="button"
                    className="toggle-password"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff className="icon" /> : <Eye className="icon" />}
                  </button>
                </div>
              </div>

              <button 
                type="submit" 
                className="btn-submit"
                disabled={loading}
              >
                {loading ? 'Creando cuenta...' : 'Crea una cuenta'}
              </button>
            </form>
          )}

          <div className="auth-divider">
            <span>{isLogin ? '¿No tienes cuenta?' : '¿Ya tienes una cuenta?'}</span>
          </div>

          <button
            type="button"
            className="btn-switch"
            onClick={() => {
              setIsLogin(!isLogin);
              setError('');
            }}
          >
            {isLogin ? 'Registrarse' : 'Iniciar sesión'}
          </button>
        </div>
      </div>
    </>
  );
}

