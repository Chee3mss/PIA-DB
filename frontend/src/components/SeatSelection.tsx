import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Topbar from './TopBar';
import { SeatsioSeatingChart } from '@seatsio/seatsio-react';
import { eventosService, authService } from '../services/api';
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
  const [holdToken, setHoldToken] = useState<string | null>(null);

  // Workspace key global por defecto (puedes ponerlo en variables de entorno)
  const DEFAULT_WORKSPACE_KEY = 'f746befc-30bd-4c29-aa82-e6a52e274ba4';

  // Verificar autenticación antes de cargar datos
  useEffect(() => {
    if (!authService.isAuthenticated()) {
      // Redirigir a la página del evento si no está autenticado y abrir modal de login
      navigate(`/event/${eventId}`, { 
        replace: true,
        state: { openAuthModal: true }
      });
    }
  }, [eventId, navigate]);

  useEffect(() => {
    // Solo cargar datos si está autenticado
    if (authService.isAuthenticated()) {
      loadData();
    }
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

  const handleChartRendered = (chart: any) => {
      chartRef.current = chart;
      // Capture hold token if available
      if (chart.holdToken) {
          setHoldToken(chart.holdToken);
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

    // Calculate approximate expiration for display (e.g. 15 mins from now)
    const holdExpiration = new Date(Date.now() + 15 * 60 * 1000).toISOString();

    // Simplify seats data to avoid cloning errors in navigation state
    const simplifiedSeats = selectedSeats.map(seat => ({
        id: seat.id,
        label: seat.label,
        category: seat.category ? { label: seat.category.label } : null,
        pricing: seat.pricing ? { price: seat.pricing.price } : { price: 500 }
    }));

    // Navigate to Review Page with simplified data
    navigate(`/event/${eventId}/seats/${functionId}/review`, {
        state: {
            selectedSeats: simplifiedSeats,
            eventoInfo,
            seatsioConfig,
            holdToken,
            holdExpiration
        }
    });
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

  // Error
  if (error) {
    return (
      <>
        <Topbar />
        <div className="seat-selection-container">
          <div className="error-state">
            <h2>❌ {error}</h2>
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
    <div className="seat-selection-page">
      <Topbar />
      
      <div className="seat-selection-layout">
        {/* Panel Izquierdo - Mapa */}
        <div className="map-panel">
            <button onClick={() => navigate(`/event/${eventId}`)} className="btn-back-floating">
                ← Volver
            </button>
            
            <div className="seatsio-wrapper-full">
                {loading ? (
                    <div className="skeleton-map">
                        <div className="skeleton-spinner"></div>
                        <p>Cargando mapa de asientos...</p>
                    </div>
                ) : (
                    seatsioConfig && (
                        <SeatsioSeatingChart
                            key={functionId} // Force re-mount on function change
                            onRenderStarted={handleChartRendered}
                            workspaceKey={seatsioConfig.seatsio_public_key || DEFAULT_WORKSPACE_KEY}
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
                            showMinimap={false} 
                            colorScheme="light"
                            fitTo="widthAndHeight"
                        />
                    )
                )}
            </div>
        </div>

        {/* Panel Derecho - Información y Resumen */}
        <div className="sidebar-panel">
            <div className="event-header-compact">
                {loading ? (
                    <div className="skeleton-header">
                        <div className="skeleton-thumb"></div>
                        <div className="skeleton-text-group">
                            <div className="skeleton-line title"></div>
                            <div className="skeleton-line subtitle"></div>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="event-mini-thumb">
                            {eventoInfo?.imagen_url && (
                                <img src={eventoInfo.imagen_url} alt={eventoInfo.nombre_evento} />
                            )}
                        </div>
                        <div className="event-info-text">
                            <h3>{eventoInfo?.nombre_evento}</h3>
                            <p className="venue-text">{seatsioConfig?.auditorio.nombre}</p>
                            <p className="date-text">
                                {seatsioConfig && formatFecha(seatsioConfig.funcion.fecha)} • {seatsioConfig?.funcion.hora} hrs
                            </p>
                        </div>
                    </>
                )}
            </div>

            <div className="selection-content">
                <h4>Tus Asientos <span className="badge-count">{selectedSeats.length}</span></h4>
                
                {selectedSeats.length === 0 ? (
                    <div className="empty-state-sidebar">
                        <div className="empty-icon">🎫</div>
                        <p>Selecciona asientos en el mapa</p>
                    </div>
                ) : (
                    <div className="selected-seats-scroll">
                        {selectedSeats.map((seat, index) => (
                            <div key={index} className="seat-item-row">
                                <div className="seat-id-box">
                                    <span className="seat-code">{seat.label}</span>
                                    <span className="seat-category">{seat.category?.label || 'General'}</span>
                                </div>
                                <div className="seat-price-box">
                                    ${(seat.pricing?.price || 500).toLocaleString()}
                                    <button 
                                        className="btn-remove-seat"
                                        onClick={() => {
                                            if (chartRef.current) chartRef.current.deselectObjects([seat.id]);
                                            handleSeatDeselected(seat);
                                        }}
                                    >
                                        ✕
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="sidebar-footer">
                <div className="total-row">
                    <span>Total</span>
                    <span className="total-amount">
                        ${selectedSeats.reduce((sum, seat) => sum + (seat.pricing?.price || 500), 0).toLocaleString()}
                    </span>
                </div>
                <button 
                    className="btn-checkout-large" 
                    onClick={handleContinue}
                    disabled={selectedSeats.length === 0}
                >
                    Continuar
                </button>
            </div>
        </div>
      </div>
    </div>
  );
}
