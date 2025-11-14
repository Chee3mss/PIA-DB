import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Topbar from './TopBar';
import { SeatsioSeatingChart } from '@seatsio/seatsio-react';
import { eventosService } from '../services/api';
import '../styles/SeatSelection.css';

interface SeatsioConfig {
  seatsio_event_key: string;
  seatsio_public_key: string | null;
  auditorio: {
    id: number;
    nombre: string;
    sede: string;
  };
  funcion: {
    id: number;
    fecha: string;
    hora: string;
  };
}

interface EventoInfo {
  id_evento: number;
  nombre_evento: string;
  imagen_url: string;
  clasificacion: string;
  categoria: string;
}

export default function SeatSelection() {
  const { eventId, functionId } = useParams<{ eventId: string; functionId: string }>();
  const navigate = useNavigate();
  
  const [seatsioConfig, setSeatsioConfig] = useState<SeatsioConfig | null>(null);
  const [eventoInfo, setEventoInfo] = useState<EventoInfo | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const chartRef = useRef<any>(null);

  // Public key global por defecto (puedes ponerlo en variables de entorno)
  const DEFAULT_PUBLIC_KEY = 'f746befc-30bd-4c29-aa82-e6a52e274ba4';

  useEffect(() => {
    loadData();
  }, [eventId, functionId]);

  const loadData = async () => {
    if (!eventId || !functionId) return;

    try {
      setLoading(true);
      setError(null);

      // Cargar información del evento
      const eventoData = await eventosService.getEventoById(Number(eventId));
      setEventoInfo({
        id_evento: eventoData.id_evento,
        nombre_evento: eventoData.nombre_evento,
        imagen_url: eventoData.imagen_url,
        clasificacion: eventoData.clasificacion,
        categoria: eventoData.categoria
      });

      // Cargar configuración de Seats.io para la función (AUTOMÁTICO)
      const response = await fetch(
        `http://localhost:3001/api/seatsio/function/${functionId}`
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al cargar configuración de Seats.io');
      }

      const data = await response.json();
      
      // Transformar la respuesta al formato esperado
      setSeatsioConfig({
        seatsio_event_key: data.seatsio_event_key,
        seatsio_public_key: data.seatsio_public_key,
        auditorio: {
          id: data.funcion.id,
          nombre: data.funcion.auditorio,
          sede: data.funcion.sede
        },
        funcion: {
          id: data.funcion.id,
          fecha: data.funcion.fecha,
          hora: data.funcion.hora
        }
      });
    } catch (err: any) {
      console.error('Error al cargar datos:', err);
      setError(err.message || 'Error al cargar la información');
    } finally {
      setLoading(false);
    }
  };

  const handleSeatSelected = (seat: any) => {
    console.log('Asiento seleccionado:', seat);
    setSelectedSeats(prev => {
      // Evitar duplicados
      if (prev.find(s => s.id === seat.id)) return prev;
      return [...prev, seat];
    });
  };

  const handleSeatDeselected = (seat: any) => {
    console.log('Asiento deseleccionado:', seat);
    setSelectedSeats(prev => prev.filter(s => s.id !== seat.id));
  };

  const handleContinue = () => {
    if (selectedSeats.length === 0) {
      alert('Por favor selecciona al menos un asiento');
      return;
    }

    const total = selectedSeats.reduce((sum, seat) => {
      const price = seat.pricing?.price || 500;
      return sum + price;
    }, 0);

    // Aquí puedes navegar a la página de checkout o procesar la compra
    alert(
      `Has seleccionado ${selectedSeats.length} asiento(s)\n` +
      `Total: $${total.toLocaleString()}\n\n` +
      `Asientos: ${selectedSeats.map(s => s.label).join(', ')}\n\n` +
      `Próximamente: Proceder al pago`
    );

    // TODO: Navegar a checkout
    // navigate(`/checkout/${eventId}/${functionId}`, { 
    //   state: { selectedSeats, total } 
    // });
  };

  const formatFecha = (fecha: string) => {
    const date = new Date(fecha);
    return date.toLocaleDateString('es-MX', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  // Loading
  if (loading) {
    return (
      <>
        <Topbar />
        <div className="seat-selection-container">
          <div className="loading-state">
            <h2>Cargando selección de asientos...</h2>
            <p>Por favor espera un momento</p>
          </div>
        </div>
      </>
    );
  }

  // Error
  if (error || !seatsioConfig || !eventoInfo) {
    return (
      <>
        <Topbar />
        <div className="seat-selection-container">
          <div className="error-state">
            <h2>❌ {error || 'Error al cargar'}</h2>
            <p>
              {error?.includes('configuración de Seats.io') 
                ? 'Este auditorio aún no tiene configuración de Seats.io. Contacta al administrador.' 
                : 'No se pudo cargar la información necesaria.'}
            </p>
            <button onClick={() => navigate(`/event/${eventId}`)} className="btn-back">
              ← Volver al evento
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Topbar />
      <div className="seat-selection-container">
        <button onClick={() => navigate(`/event/${eventId}`)} className="btn-back-top">
          ← Volver al evento
        </button>

        {/* Header con información del evento y función */}
        <div className="selection-header">
          <div className="event-mini-info">
            {eventoInfo.imagen_url && (
              <img 
                src={eventoInfo.imagen_url} 
                alt={eventoInfo.nombre_evento}
                className="event-mini-image"
              />
            )}
            <div className="event-mini-details">
              <span className="event-mini-category">{eventoInfo.categoria}</span>
              <h1 className="event-mini-title">{eventoInfo.nombre_evento}</h1>
              <div className="function-info">
                <span className="function-date">
                  📅 {formatFecha(seatsioConfig.funcion.fecha)}
                </span>
                <span className="function-time">
                  🕐 {seatsioConfig.funcion.hora} hrs
                </span>
                <span className="function-venue">
                  📍 {seatsioConfig.auditorio.nombre} - {seatsioConfig.auditorio.sede}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Mapa de asientos de Seats.io */}
        <div className="seatsio-section">
          <h2>Selecciona tus asientos</h2>
          
          <div className="seatsio-wrapper">
            <div className="seatsio-chart-container">
              <SeatsioSeatingChart
                ref={chartRef}
                publicKey={seatsioConfig.seatsio_public_key || DEFAULT_PUBLIC_KEY}
                event={seatsioConfig.seatsio_event_key}
                region="na"
                onObjectSelected={handleSeatSelected}
                onObjectDeselected={handleSeatDeselected}
                language="es"
                pricing={[
                  { category: 'VIP', price: 1500 },
                  { category: 'Premium', price: 1000 },
                  { category: 'Preferente', price: 800 },
                  { category: 'General', price: 500 }
                ]}
                priceFormatter={(price: number) => `$${price.toLocaleString()}`}
                session="continue"
                maxSelectedObjects={10}
                showMinimap={true}
                colorScheme="light"
              />
            </div>
          </div>

          {/* Resumen de selección */}
          <div className="selection-summary">
            <div className="summary-header">
              <h3>Tu selección</h3>
              {selectedSeats.length > 0 && (
                <button 
                  className="btn-clear-selection"
                  onClick={() => {
                    if (chartRef.current) {
                      chartRef.current.clearSelection();
                    }
                    setSelectedSeats([]);
                  }}
                >
                  Limpiar selección
                </button>
              )}
            </div>

            {selectedSeats.length === 0 ? (
              <div className="empty-selection">
                <p>No has seleccionado ningún asiento aún</p>
                <p className="empty-selection-hint">
                  Haz clic en los asientos del mapa para seleccionarlos
                </p>
              </div>
            ) : (
              <>
                <div className="selected-seats-list">
                  {selectedSeats.map((seat, index) => (
                    <div key={index} className="selected-seat-item">
                      <div className="seat-info">
                        <span className="seat-label">{seat.label}</span>
                        <span className="seat-category">
                          {seat.category?.label || 'General'}
                        </span>
                      </div>
                      <span className="seat-price">
                        ${(seat.pricing?.price || 500).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
                
                <div className="summary-totals">
                  <div className="summary-row">
                    <span>Subtotal ({selectedSeats.length} asiento{selectedSeats.length !== 1 ? 's' : ''}):</span>
                    <span className="summary-value">
                      ${selectedSeats.reduce((sum, seat) => 
                        sum + (seat.pricing?.price || 500), 0
                      ).toLocaleString()}
                    </span>
                  </div>
                  <div className="summary-row summary-total">
                    <span><strong>Total:</strong></span>
                    <span className="summary-value-total">
                      <strong>
                        ${selectedSeats.reduce((sum, seat) => 
                          sum + (seat.pricing?.price || 500), 0
                        ).toLocaleString()}
                      </strong>
                    </span>
                  </div>
                </div>

                <button className="btn-continue" onClick={handleContinue}>
                  Continuar con la compra →
                </button>
              </>
            )}
          </div>
        </div>
      </div>
      
      <footer>
        <p>© 2025 StageGo. All rights reserved.</p>
      </footer>
    </>
  );
}

