import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Topbar from './TopBar';
import { eventosService, type EventoDetalle, type Funcion } from '../services/api';
import '../styles/EventDetail.css';

export default function EventDetail() {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  
  const [evento, setEvento] = useState<EventoDetalle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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
        
        // Seleccionar la primera función por defecto
        if (data.funciones && data.funciones.length > 0) {
          setSelectedFunctionId(data.funciones[0].id_funcion);
        }
      } catch (err: any) {
        console.error('Error al cargar evento:', err);
        setError(err.response?.data?.error || 'Error al cargar el evento');
      } finally {
        setLoading(false);
      }
    };

    loadEvento();
  }, [eventId]);

  // Estado de carga
  if (loading) {
    return (
      <>
        <Topbar />
        <div className="event-detail-container">
          <div style={{ 
            minHeight: '50vh', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center' 
          }}>
            <div style={{ textAlign: 'center' }}>
              <h2>Cargando evento...</h2>
              <p>Por favor espera un momento</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Error o evento no encontrado
  if (error || !evento) {
    return (
      <>
        <Topbar />
        <div className="event-detail-container">
          <div className="event-not-found">
            <h2>{error || 'Evento no encontrado'}</h2>
            <button onClick={() => navigate('/')} className="btn-back">
              Volver al inicio
            </button>
          </div>
        </div>
      </>
    );
  }

  const selectedFunction = evento.funciones?.find(f => f.id_funcion === selectedFunctionId);

  // Calcular duración aproximada del evento
  const calcularDuracion = () => {
    const inicio = new Date(evento.fecha_inicio);
    const fin = new Date(evento.fecha_fin);
    const diff = fin.getTime() - inicio.getTime();
    const dias = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (dias > 0) {
      return `${dias + 1} días`;
    }
    return 'Evento único';
  };

  return (
    <>
      <Topbar />
      <div className="event-detail-container">
        <button onClick={() => navigate('/')} className="btn-back-top">
          ← Volver
        </button>

        <div className="event-header">
          {evento.imagen_url ? (
            <img 
              src={evento.imagen_url} 
              alt={evento.nombre_evento}
              className="event-image"
              onError={(e) => {
                // Si la imagen no carga, mostrar placeholder
                (e.target as HTMLImageElement).style.display = 'none';
                const placeholder = (e.target as HTMLElement).nextElementSibling;
                if (placeholder) {
                  (placeholder as HTMLElement).style.display = 'flex';
                }
              }}
            />
          ) : null}
          <div className="event-image-placeholder" style={{ display: evento.imagen_url ? 'none' : 'flex' }}>
            <span>{evento.nombre_evento.charAt(0)}</span>
          </div>
          <div className="event-info">
            <div className="event-category">{evento.categoria || 'Evento'}</div>
            <h1 className="event-title">{evento.nombre_evento}</h1>
            <p className="event-description">{evento.descripcion}</p>
            <div className="event-meta">
              <div className="meta-item">
                <strong>Duración:</strong> {calcularDuracion()}
              </div>
              <div className="meta-item">
                <strong>Clasificación:</strong> {evento.clasificacion || 'Todo Público'}
              </div>
              <div className="meta-item">
                <strong>Fecha:</strong> {new Date(evento.fecha_inicio).toLocaleDateString('es-MX', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="functions-section">
          <h2>Selecciona una función</h2>
          {evento.funciones && evento.funciones.length > 0 ? (
            <div className="functions-grid">
              {evento.funciones.map((func: Funcion) => {
                // Calcular asientos disponibles (esto debería venir del backend)
                const totalSeats = 500; // Valor temporal, debería venir de la capacidad del auditorio
                const availableSeats = totalSeats - func.boletos_vendidos;
                
                return (
                  <div
                    key={func.id_funcion}
                    className={`function-card ${selectedFunctionId === func.id_funcion ? 'selected' : ''}`}
                    onClick={() => {
                      // Navegar a la página de selección de asientos
                      navigate(`/event/${eventId}/seats/${func.id_funcion}`);
                    }}
                  >
                    <div className="function-date">
                      {new Date(func.fecha).toLocaleDateString('es-MX', {
                        weekday: 'short',
                        day: 'numeric',
                        month: 'short'
                      })}
                    </div>
                    <div className="function-time">{func.hora} hrs</div>
                    <div className="function-venue">
                      {func.auditorio_nombre || 'Auditorio'}
                      {func.nombre_sede && <span className="venue-location"> - {func.nombre_sede}</span>}
                    </div>
                    <div className={`function-availability ${availableSeats < 100 ? 'low' : ''}`}>
                      {availableSeats > 0 ? `${availableSeats} asientos disponibles` : 'Agotado'}
                    </div>
                    <div className="function-status">
                      Estado: <span className={`status-badge ${func.estado.toLowerCase()}`}>{func.estado}</span>
                    </div>
                    <div className="function-action">
                      <button className="btn-select-function">
                        Seleccionar asientos →
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="no-functions">
              <p>No hay funciones disponibles para este evento en este momento.</p>
            </div>
          )}
        </div>
      </div>
      <footer>
        <p>© 2025 StageGo. All rights reserved.</p>
      </footer>
    </>
  );
}


