import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Topbar from './TopBar';
import { SeatsioSeatingChart } from '@seatsio/seatsio-react';
import '../styles/EventTest.css';

// Datos de prueba simulando el evento 2
const MOCK_EVENT = {
  id_evento: 2,
  nombre_evento: "Evento de Prueba - Seats.io",
  descripcion: "Esta es una página de prueba para integrar Seats.io en la plataforma. Aquí podrás visualizar cómo funciona el selector de asientos profesional.",
  imagen_url: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800",
  fecha_inicio: "2025-12-15",
  fecha_fin: "2025-12-15",
  clasificacion: "Todo Público",
  categoria: "Teatro",
  funciones: [
    {
      id_funcion: 1,
      fecha: "2025-12-15",
      hora: "19:00",
      auditorio_nombre: "Teatro Principal",
      nombre_sede: "Centro Cultural",
      estado: "Activo",
      boletos_vendidos: 45
    },
    {
      id_funcion: 2,
      fecha: "2025-12-15",
      hora: "21:30",
      auditorio_nombre: "Teatro Principal",
      nombre_sede: "Centro Cultural",
      estado: "Activo",
      boletos_vendidos: 23
    },
    {
      id_funcion: 3,
      fecha: "2025-12-16",
      hora: "18:00",
      auditorio_nombre: "Teatro Principal",
      nombre_sede: "Centro Cultural",
      estado: "Activo",
      boletos_vendidos: 67
    }
  ]
};

interface SeatsioConfig {
  workspaceKey: string;
  event: string;
  region: string;
}

export default function EventTest() {
  const navigate = useNavigate();
  const [selectedFunctionId, setSelectedFunctionId] = useState<number>(1);
  const [selectedSeats, setSelectedSeats] = useState<any[]>([]);
  const [seatsioConfig, setSeatsioConfig] = useState<SeatsioConfig | null>(null);
  const chartRef = useRef<any>(null);

  useEffect(() => {
    // Configuración de Seats.io
    // IMPORTANTE: Necesitas reemplazar estos valores con tus propias credenciales
    setSeatsioConfig({
      workspaceKey: 'f746befc-30bd-4c29-aa82-e6a52e274ba4', // Reemplazar con tu workspace key de Seats.io
      event: '9c160410-3b99-4758-85d1-e2d1321f9973', // Reemplazar con tu event key
      region: 'na' // 'na' para North America, 'eu' para Europe
    });
  }, []);

  const selectedFunction = MOCK_EVENT.funciones.find(f => f.id_funcion === selectedFunctionId);

  const handleSeatSelected = (seat: any) => {
    console.log('Asiento seleccionado:', seat);
    setSelectedSeats(prev => [...prev, seat]);
  };

  const handleSeatDeselected = (seat: any) => {
    console.log('Asiento deseleccionado:', seat);
    setSelectedSeats(prev => prev.filter(s => s.id !== seat.id));
  };

  const handleContinue = () => {
    if (selectedSeats.length > 0) {
      const total = selectedSeats.reduce((sum, seat) => {
        // Seats.io puede tener precios por zona
        const price = seat.pricing?.price || 500;
        return sum + price;
      }, 0);

      alert(
        `Has seleccionado ${selectedSeats.length} asiento(s)\n` +
        `Total estimado: $${total.toLocaleString()}\n\n` +
        `Asientos: ${selectedSeats.map(s => s.label).join(', ')}`
      );
    }
  };

  const calcularDuracion = () => {
    const inicio = new Date(MOCK_EVENT.fecha_inicio);
    const fin = new Date(MOCK_EVENT.fecha_fin);
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
      <div className="event-test-container">
        <button onClick={() => navigate('/')} className="btn-back-top">
          ← Volver
        </button>

        {/* Banner de prueba */}
        <div className="test-banner">
          <strong>🔧 MODO PRUEBA</strong> - Esta es una página de prueba para integrar Seats.io
        </div>

        <div className="event-header">
          {MOCK_EVENT.imagen_url ? (
            <img 
              src={MOCK_EVENT.imagen_url} 
              alt={MOCK_EVENT.nombre_evento}
              className="event-image"
            />
          ) : null}
          <div className="event-info">
            <div className="event-category">{MOCK_EVENT.categoria}</div>
            <h1 className="event-title">{MOCK_EVENT.nombre_evento}</h1>
            <p className="event-description">{MOCK_EVENT.descripcion}</p>
            <div className="event-meta">
              <div className="meta-item">
                <strong>Duración:</strong> {calcularDuracion()}
              </div>
              <div className="meta-item">
                <strong>Clasificación:</strong> {MOCK_EVENT.clasificacion}
              </div>
              <div className="meta-item">
                <strong>Fecha:</strong> {new Date(MOCK_EVENT.fecha_inicio).toLocaleDateString('es-MX', {
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
          <div className="functions-grid">
            {MOCK_EVENT.funciones.map((func) => {
              const totalSeats = 500;
              const availableSeats = totalSeats - func.boletos_vendidos;
              
              return (
                <div
                  key={func.id_funcion}
                  className={`function-card ${selectedFunctionId === func.id_funcion ? 'selected' : ''}`}
                  onClick={() => setSelectedFunctionId(func.id_funcion)}
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
                    {func.auditorio_nombre}
                    <span className="venue-location"> - {func.nombre_sede}</span>
                  </div>
                  <div className={`function-availability ${availableSeats < 100 ? 'low' : ''}`}>
                    {availableSeats} asientos disponibles
                  </div>
                  <div className="function-status">
                    Estado: <span className={`status-badge ${func.estado.toLowerCase()}`}>{func.estado}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {selectedFunction && (
          <div className="seatsio-section">
            <h2>Selecciona tus asientos con Seats.io</h2>
            
            {seatsioConfig ? (
              <div className="seatsio-wrapper">

                <div className="seatsio-chart-container">
                  <SeatsioSeatingChart
                    ref={chartRef}
                    workspaceKey={seatsioConfig.workspaceKey}
                    event={seatsioConfig.event}
                    region={seatsioConfig.region}
                    onObjectSelected={handleSeatSelected}
                    onObjectDeselected={handleSeatDeselected}
                    language="es"
                    pricing={[
                      { category: 'VIP', price: 1200 },
                      { category: 'Premium', price: 800 },
                      { category: 'General', price: 500 }
                    ]}
                    priceFormatter={(price: number) => `$${price.toLocaleString()}`}
                  />
                </div>
              </div>
            ) : (
              <div className="loading-seatsio">
                <p>Cargando configuración de Seats.io...</p>
              </div>
            )}

            {/* Resumen de selección */}
            <div className="selection-summary">
              <h3>Resumen de tu selección</h3>
              {selectedSeats.length === 0 ? (
                <p className="empty-selection">No has seleccionado ningún asiento aún</p>
              ) : (
                <>
                  <div className="selected-seats-list">
                    {selectedSeats.map((seat, index) => (
                      <div key={index} className="selected-seat-item">
                        <span className="seat-label">{seat.label}</span>
                        <span className="seat-category">{seat.category?.label || 'General'}</span>
                        <span className="seat-price">${seat.pricing?.price?.toLocaleString() || '500'}</span>
                      </div>
                    ))}
                  </div>
                  <div className="total-price">
                    <strong>Total:</strong>
                    <strong>
                      ${selectedSeats.reduce((sum, seat) => sum + (seat.pricing?.price || 500), 0).toLocaleString()}
                    </strong>
                  </div>
                  <button className="btn-continue" onClick={handleContinue}>
                    Continuar con la compra
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
      <footer>
        <p>© 2025 StageGo. All rights reserved.</p>
      </footer>
    </>
  );
}

