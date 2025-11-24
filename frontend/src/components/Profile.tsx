import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Phone, MapPin, Calendar, Package, Ticket, CreditCard, ChevronLeft, Clock, MapPinIcon, ChevronDown, ChevronUp } from 'lucide-react';
import { authService, clientesService } from '../services/api';
import { useToast } from './ToastProvider';
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

interface Boleto {
  id_boleto: number;
  asiento: string;
  precio_final: number;
  vigente: number;
  tipo_boleto: string;
  estado_boleto: string;
  nombre_evento: string;
  descripcion_evento: string;
  imagen_url: string;
  fecha_funcion: string;
  hora_funcion: string;
  id_funcion: number;
  nombre_auditorio: string;
  nombre_lugar: string;
  direccion_lugar: string;
  ciudad: string;
  estado_lugar: string;
}

interface Compra {
  id_venta: number;
  fecha: string;
  total: number;
  monto_total: number;
  nombre_metodo: string;
  cantidad_boletos: number;
  boletos: Boleto[];
}

export default function Profile() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [clienteInfo, setClienteInfo] = useState<ClienteInfo | null>(null);
  const [compras, setCompras] = useState<Compra[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedCompras, setExpandedCompras] = useState<Set<number>>(new Set());

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

  const toggleCompraExpanded = (idVenta: number) => {
    setExpandedCompras(prev => {
      const newSet = new Set(prev);
      if (newSet.has(idVenta)) {
        newSet.delete(idVenta);
      } else {
        newSet.add(idVenta);
      }
      return newSet;
    });
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
                showToast('✅ Sesión cerrada correctamente', 'success');
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

          {/* Botón para ir a Mis Boletos */}
          <div className="profile-quick-actions">
            <button onClick={() => navigate('/boletos')} className="quick-action-btn boletos-btn">
              <Ticket className="icon" />
              <div className="action-text">
                <span className="action-title">Mis Boletos</span>
                <span className="action-desc">Ver todos mis boletos</span>
              </div>
            </button>
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
            </div>
          )}
        </div>
      </div>
    </>
  );
}

