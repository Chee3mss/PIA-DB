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

                    {/* Resumen de boletos (siempre visible) */}
                    {compra.boletos && compra.boletos.length > 0 && (
                      <div className="boletos-summary">
                        <div className="evento-info-compact">
                          <h4>{compra.boletos[0].nombre_evento}</h4>
                          <div className="evento-meta-compact">
                            <span className="meta-compact">
                              <Clock className="icon-small" />
                              {(() => {
                                const fecha = new Date(compra.boletos[0].fecha_funcion);
                                const [horas, minutos] = compra.boletos[0].hora_funcion.split(':');
                                fecha.setHours(parseInt(horas), parseInt(minutos));
                                return fecha.toLocaleDateString('es-MX', {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric'
                                });
                              })()}
                            </span>
                            <span className="meta-compact">
                              <MapPinIcon className="icon-small" />
                              {compra.boletos[0].ciudad}
                            </span>
                          </div>
                          <div className="asientos-summary">
                            <strong>Asientos:</strong> {compra.boletos.map(b => b.asiento).join(', ')}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Detalles completos de los boletos (expandible) */}
                    {expandedCompras.has(compra.id_venta) && compra.boletos && compra.boletos.length > 0 && (
                      <div className="boletos-details">
                        {compra.boletos.map((boleto, index) => (
                          <div key={boleto.id_boleto} className="boleto-item">
                            {index === 0 && (
                              <div className="evento-info">
                                <h3>{boleto.nombre_evento}</h3>
                                <div className="evento-meta">
                                  <div className="meta-item">
                                    <Clock className="icon" />
                                    <span>
                                      {(() => {
                                        // Combinar fecha y hora
                                        const fecha = new Date(boleto.fecha_funcion);
                                        const [horas, minutos] = boleto.hora_funcion.split(':');
                                        fecha.setHours(parseInt(horas), parseInt(minutos));
                                        
                                        return fecha.toLocaleString('es-MX', {
                                          year: 'numeric',
                                          month: 'long',
                                          day: 'numeric',
                                          hour: '2-digit',
                                          minute: '2-digit'
                                        });
                                      })()}
                                    </span>
                                  </div>
                                  <div className="meta-item">
                                    <MapPinIcon className="icon" />
                                    <span>{boleto.nombre_lugar} - {boleto.nombre_auditorio}, {boleto.ciudad}, {boleto.estado_lugar}</span>
                                  </div>
                                </div>
                              </div>
                            )}
                            
                            <div className="boleto-details-row">
                              <div className="boleto-info">
                                <Ticket className="icon" />
                                <div>
                                  <strong>Asiento: {boleto.asiento}</strong>
                                  <span className="boleto-tipo">{boleto.tipo_boleto}</span>
                                </div>
                              </div>
                              <div className="boleto-precio">
                                {formatCurrency(boleto.precio_final)}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="compra-footer">
                      <button 
                        className="ver-detalles-btn"
                        onClick={() => toggleCompraExpanded(compra.id_venta)}
                      >
                        {expandedCompras.has(compra.id_venta) ? (
                          <>
                            <ChevronUp className="icon" />
                            Ocultar detalles
                          </>
                        ) : (
                          <>
                            <ChevronDown className="icon" />
                            Ver más detalles
                          </>
                        )}
                      </button>
                      <div className="compra-total">
                        <span>Total:</span>
                        <strong>{formatCurrency(compra.total || compra.monto_total)}</strong>
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
            </div>
          )}
        </div>
      </div>
    </>
  );
}

