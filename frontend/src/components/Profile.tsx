import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Phone, MapPin, Calendar, Package, Ticket, CreditCard, ChevronLeft } from 'lucide-react';
import { authService, clientesService } from '../services/api';
import Topbar from './TopBar';
import '../styles/Profile.css';

interface ClienteInfo {
  id_cliente: number;
  nombre_completo: string;
  email: string;
  telefono: string;
  numero_registro: string;
  fecha_registro: string;
  municipio?: string;
  estado?: string;
}

interface Compra {
  id_venta: number;
  fecha: string;
  monto_total: number;
  nombre_metodo: string;
  cantidad_boletos: number;
}

export default function Profile() {
  const navigate = useNavigate();
  const [clienteInfo, setClienteInfo] = useState<ClienteInfo | null>(null);
  const [compras, setCompras] = useState<Compra[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProfileData = async () => {
      try {
        const currentUser = authService.getCurrentUser();
        
        if (!currentUser) {
          navigate('/');
          return;
        }

        // Obtener id_cliente del usuario actual
        const idCliente = currentUser.id_cliente || currentUser.user?.id_cliente;
        
        if (!idCliente) {
          console.error('Usuario sin id_cliente:', currentUser);
          setError('Tu sesión es antigua. Por favor, cierra sesión y vuelve a iniciar sesión para actualizar tus datos.');
          setLoading(false);
          return;
        }

        // Cargar perfil del cliente
        const perfil = await clientesService.getPerfil(idCliente);
        setClienteInfo(perfil as ClienteInfo);

        // Cargar compras del cliente
        const comprasData = await clientesService.getCompras(idCliente);
        setCompras(comprasData);
        
        setLoading(false);
      } catch (err) {
        console.error('Error al cargar datos del perfil:', err);
        setError('No se pudo cargar la información del perfil');
        setLoading(false);
      }
    };

    loadProfileData();
  }, [navigate]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(amount);
  };

  if (loading) {
    return (
      <>
        <Topbar />
        <div className="profile-container">
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Cargando información...</p>
          </div>
        </div>
      </>
    );
  }

  if (error || !clienteInfo) {
    return (
      <>
        <Topbar />
        <div className="profile-container">
          <div className="error-state">
            <p>{error || 'No se pudo cargar la información'}</p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button onClick={() => {
                authService.logout();
                navigate('/');
              }} className="back-button">
                Cerrar Sesión
              </button>
              <button onClick={() => navigate('/')} className="back-button" style={{ background: 'rgba(255, 215, 0, 0.2)', color: '#FFD700' }}>
                Volver al inicio
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Topbar />
      <div className="profile-container">
        <div className="profile-content">
          {/* Header */}
          <div className="profile-header">
            <button onClick={() => navigate('/')} className="back-btn">
              <ChevronLeft className="icon" />
              Volver
            </button>
            <h1>Mi Perfil</h1>
          </div>

          {/* Información del Usuario */}
          <div className="profile-section">
            <div className="section-header">
              <User className="section-icon" />
              <h2>Información Personal</h2>
            </div>
            <div className="info-grid">
              <div className="info-item">
                <div className="info-icon">
                  <User className="icon" />
                </div>
                <div className="info-content">
                  <label>Nombre Completo</label>
                  <p>{clienteInfo.nombre_completo}</p>
                </div>
              </div>

              <div className="info-item">
                <div className="info-icon">
                  <Mail className="icon" />
                </div>
                <div className="info-content">
                  <label>Correo Electrónico</label>
                  <p>{clienteInfo.email}</p>
                </div>
              </div>

              <div className="info-item">
                <div className="info-icon">
                  <Phone className="icon" />
                </div>
                <div className="info-content">
                  <label>Teléfono</label>
                  <p>{clienteInfo.telefono || 'No especificado'}</p>
                </div>
              </div>

              <div className="info-item">
                <div className="info-icon">
                  <MapPin className="icon" />
                </div>
                <div className="info-content">
                  <label>Ubicación</label>
                  <p>
                    {clienteInfo.municipio && clienteInfo.estado 
                      ? `${clienteInfo.municipio}, ${clienteInfo.estado}`
                      : 'No especificada'}
                  </p>
                </div>
              </div>

              <div className="info-item">
                <div className="info-icon">
                  <Calendar className="icon" />
                </div>
                <div className="info-content">
                  <label>Miembro desde</label>
                  <p>{formatDate(clienteInfo.fecha_registro)}</p>
                </div>
              </div>

              <div className="info-item">
                <div className="info-icon">
                  <Ticket className="icon" />
                </div>
                <div className="info-content">
                  <label>Número de Registro</label>
                  <p>{clienteInfo.numero_registro}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Historial de Compras */}
          <div className="profile-section">
            <div className="section-header">
              <Package className="section-icon" />
              <h2>Mis Compras</h2>
            </div>

            {compras.length === 0 ? (
              <div className="empty-state">
                <Ticket className="empty-icon" />
                <p>Aún no has realizado ninguna compra</p>
                <button onClick={() => navigate('/')} className="cta-button">
                  Explorar Eventos
                </button>
              </div>
            ) : (
              <div className="compras-list">
                {compras.map((compra) => (
                  <div key={compra.id_venta} className="compra-card">
                    <div className="compra-header">
                      <div className="compra-id">
                        <Package className="icon" />
                        <span>Orden #{compra.id_venta}</span>
                      </div>
                      <span className="compra-date">
                        {formatDate(compra.fecha)}
                      </span>
                    </div>

                    <div className="compra-details">
                      <div className="compra-detail-item">
                        <Ticket className="icon" />
                        <span>{compra.cantidad_boletos} boleto{compra.cantidad_boletos !== 1 ? 's' : ''}</span>
                      </div>

                      <div className="compra-detail-item">
                        <CreditCard className="icon" />
                        <span>{compra.nombre_metodo}</span>
                      </div>
                    </div>

                    <div className="compra-footer">
                      <div className="compra-total">
                        <span>Total:</span>
                        <strong>{formatCurrency(compra.monto_total)}</strong>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Estadísticas */}
          {compras.length > 0 && (
            <div className="profile-stats">
              <div className="stat-card">
                <Package className="stat-icon" />
                <div className="stat-content">
                  <h3>{compras.length}</h3>
                  <p>Compras totales</p>
                </div>
              </div>

              <div className="stat-card">
                <Ticket className="stat-icon" />
                <div className="stat-content">
                  <h3>{compras.reduce((acc, c) => acc + c.cantidad_boletos, 0)}</h3>
                  <p>Boletos adquiridos</p>
                </div>
              </div>

              <div className="stat-card">
                <CreditCard className="stat-icon" />
                <div className="stat-content">
                  <h3>{formatCurrency(compras.reduce((acc, c) => acc + c.monto_total, 0))}</h3>
                  <p>Gastado en total</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

