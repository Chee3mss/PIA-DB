import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import Topbar from './TopBar';
import AuthModal from './AuthModal';
import { eventosService, authService, type EventoDetalle, type Funcion } from '../services/api';
import '../styles/EventDetail.css';

export default function EventDetail() {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [evento, setEvento] = useState<EventoDetalle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [selectedFunctionId, setSelectedFunctionId] = useState<number | null>(null);

  // Cargar datos del evento desde el backend
  useEffect(() => {
    const loadEvento = async () => {
      if (!eventId) return;
      
      try {
        setLoading(true);
        setError(null);
        const data = await eventosService.getEventoById(Number(eventId));
        setEvento(data);
      } catch (err: any) {
        console.error('Error al cargar evento:', err);
        setError(err.response?.data?.error || 'Error al cargar el evento');
      } finally {
        setLoading(false);
      }
    };

    loadEvento();
  }, [eventId]);

  // Abrir modal de autenticación si se redirigió desde SeatSelection
  useEffect(() => {
    if (location.state?.openAuthModal) {
      setIsAuthModalOpen(true);
      // Limpiar el estado para evitar que se abra de nuevo al navegar
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  // Manejar selección de función con verificación de autenticación
  const handleFunctionClick = (functionId: number) => {
    if (!authService.isAuthenticated()) {
      setSelectedFunctionId(functionId);
      setIsAuthModalOpen(true);
    } else {
      navigate(`/event/${eventId}/seats/${functionId}`);
    }
  };

  // Manejar login exitoso
  const handleLoginSuccess = (user: any) => {
    setIsAuthModalOpen(false);
    if (selectedFunctionId) {
      navigate(`/event/${eventId}/seats/${selectedFunctionId}`);
    }
  };

  // Estado de carga
  if (loading) {
    return (
      <>
        <Topbar />
        <div className="loading-container">
            <div className="spinner"></div>
            <p>Cargando evento...</p>
        </div>
      </>
    );
  }

  // Error o evento no encontrado
  if (error || !evento) {
    return (
      <>
        <Topbar />
        <div className="error-container">
            <h2>{error || 'Evento no encontrado'}</h2>
            <button onClick={() => navigate('/')} className="btn-primary">
              Volver al inicio
            </button>
        </div>
      </>
    );
  }

  // Calcular ciudades únicas para mostrar
  const getUniqueLocations = () => {
    if (!evento?.funciones) return [];
    
    const locations = new Set<string>();
    evento.funciones.forEach(f => {
        if (f.ciudad) {
            locations.add(f.ciudad);
        }
    });
    
    return Array.from(locations);
  };

  const uniqueLocations = getUniqueLocations();

  return (
    <>
      <Topbar />
      <div className="event-page">
        {/* Hero Section con Imagen de Fondo */}
        <div className="event-hero" style={{ backgroundImage: `url(${evento.imagen_url})` }}>
            <div className="event-hero-overlay"></div>
            <div className="event-hero-content">
                <div className="hero-poster-wrapper">
                    {evento.imagen_url ? (
                        <img src={evento.imagen_url} alt={evento.nombre_evento} className="hero-poster" />
                    ) : (
                        <div className="hero-poster-placeholder">{evento.nombre_evento.charAt(0)}</div>
                    )}
                </div>
                <div className="hero-info">
                    <span className="hero-category">{evento.categoria || 'Evento'}</span>
                    <h1 className="hero-title">{evento.nombre_evento}</h1>
                    <div className="hero-meta">
                        <span>{evento.clasificacion || 'Todo Público'}</span>
                        {evento.fecha_inicio && (
                            <>
                                <span>•</span>
                                <span>{new Date(evento.fecha_inicio).getFullYear()}</span>
                            </>
                        )}
                        {uniqueLocations.length > 0 && (
                            <>
                                <span>•</span>
                                <span>{uniqueLocations.length > 1 ? 'Gira Nacional' : uniqueLocations[0]}</span>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>

        <div className="event-content-container">
            <button onClick={() => navigate('/')} className="btn-back-text">
              ← Volver a eventos
            </button>

            <div className="event-grid">
                {/* Columna Izquierda: Información */}
                <div className="event-info-col">
                    <section className="info-section">
                        <h3>Acerca del evento</h3>
                        <p className="event-description">{evento.descripcion}</p>
                    </section>

                    <section className="info-section">
                        <h3>Detalles de ubicación</h3>
                        <ul className="details-list">
                            {uniqueLocations.length > 1 ? (
                                <li>
                                    <strong>Ciudades de la gira:</strong> 
                                    <div style={{ marginTop: '0.5rem' }}>
                                        {uniqueLocations.map(city => (
                                            <span key={city} className="city-tag">{city}</span>
                                        ))}
                                    </div>
                                </li>
                            ) : (
                                <>
                                    <li>
                                        <strong>Lugar:</strong> {evento.funciones?.[0]?.nombre_sede || 'Por confirmar'}
                                    </li>
                                    <li>
                                        <strong>Ciudad:</strong> {uniqueLocations[0] || evento.ciudad || 'Por confirmar'}
                                    </li>
                                    {evento.funciones?.[0]?.direccion && (
                                        <li>
                                            <strong>Dirección:</strong> {evento.funciones[0].direccion}
                                        </li>
                                    )}
                                </>
                            )}
                        </ul>
                        <p style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#666', fontStyle: 'italic' }}>
                            * Revisa la lista de funciones para ver el recinto específico por fecha.
                        </p>
                    </section>
                </div>

                {/* Columna Derecha: Funciones */}
                <div className="event-functions-col">
                    <div className="functions-card">
                        <h3>Selecciona una función</h3>
                        <div className="functions-list">
                            {evento.funciones && evento.funciones.length > 0 ? (
                                evento.funciones.map((func: Funcion) => {
                                    const totalSeats = 500; // Mock: esto debería venir del backend si es posible
                                    const availableSeats = totalSeats - func.boletos_vendidos;
                                    const isAvailable = availableSeats > 0;

                                    return (
                                        <div 
                                            key={func.id_funcion} 
                                            className={`function-item ${!isAvailable ? 'disabled' : ''}`}
                                            onClick={() => isAvailable && handleFunctionClick(func.id_funcion)}
                                        >
                                            <div className="function-info">
                                                <span className="function-date">
                                                    {new Date(func.fecha).toLocaleDateString('es-MX', { day: 'numeric', month: 'short', weekday: 'short' })}
                                                </span>
                                                <span className="function-time">{func.hora} hrs</span>
                                            </div>
                                            <div className="function-details">
                                                <div className="venue-info">
                                                    <span className="venue-name">{func.auditorio_nombre}</span>
                                                    <span className="venue-city">{func.ciudad ? `${func.ciudad}` : ''} {func.nombre_sede ? `• ${func.nombre_sede}` : ''}</span>
                                                </div>
                                                {isAvailable ? (
                                                    <span className="seats-available">{availableSeats} lugares</span>
                                                ) : (
                                                    <span className="sold-out">Agotado</span>
                                                )}
                                            </div>
                                            <div className="function-action">
                                                <button className="btn-select" disabled={!isAvailable}>
                                                    Seleccionar
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="no-functions">
                                    <p>No hay funciones disponibles por el momento.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>
      <footer>
        <p>© 2025 StageGo. All rights reserved.</p>
      </footer>
      
      {/* Modal de Autenticación */}
      <AuthModal 
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </>
  );
}