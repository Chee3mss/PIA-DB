import { useState, useMemo } from 'react';
import { generateSeatsForVenue, getPriceZonesInfo, getVenueStructure } from '../utils/venueLayouts';
import type { Seat } from '../utils/venueLayouts';
import '../styles/SeatMap.css';

interface SeatMapProps {
  functionId: number;
  venue: string;
}

export default function SeatMap({ venue }: SeatMapProps) {
  // Generar asientos basados en el venue específico
  const initialSeats = useMemo(() => generateSeatsForVenue(venue), [venue]);
  const [seats, setSeats] = useState<Seat[]>(initialSeats);
  
  // Obtener información de zonas y estructura del venue
  const priceZones = useMemo(() => getPriceZonesInfo(venue), [venue]);
  const venueStructure = useMemo(() => getVenueStructure(venue), [venue]);
  const selectedSeats = seats.filter(s => s.status === 'selected');
  const totalPrice = selectedSeats.reduce((sum, seat) => sum + seat.price, 0);

  const handleSeatClick = (seatId: string) => {
    setSeats(prevSeats =>
      prevSeats.map(seat => {
        if (seat.id === seatId && seat.status !== 'occupied') {
          return {
            ...seat,
            status: seat.status === 'selected' ? 'available' : 'selected'
          };
        }
        return seat;
      })
    );
  };

  // Agrupar asientos por fila
  const groupedSeats = seats.reduce((acc, seat) => {
    if (!acc[seat.row]) {
      acc[seat.row] = [];
    }
    acc[seat.row].push(seat);
    return acc;
  }, {} as Record<string, Seat[]>);

  // Determinar la clase de zona para un asiento
  const getZoneClass = (seat: Seat) => {
    return `seat-${seat.status} zone-${seat.zone}`;
  };

  const handleContinue = () => {
    if (selectedSeats.length > 0) {
      alert(`Has seleccionado ${selectedSeats.length} asiento(s)\nTotal: $${totalPrice.toLocaleString()}\n\nAsientos: ${selectedSeats.map(s => s.id).join(', ')}`);
    }
  };

  return (
    <div className="seat-map-container">
      <div className="seat-selection-layout">
        {/* Columna izquierda - Mapa de asientos */}
        <div className="left-column">
          <div className="venue-info">
            <div className="stage">ESCENARIO</div>
          </div>

          <div className="seat-map">
            {venueStructure ? (
              // Renderizar por zonas estructurales
              venueStructure.map((zone, zoneIndex) => (
                <div key={zoneIndex} className={`venue-zone zone-section-${zone.name.includes('VIP') ? 'vip' : zone.name.includes('Premium') ? 'premium' : 'general'}`}>
                  <div className="zone-header">{zone.name}</div>
                  {zone.rows.map((row) => {
                    const rowSeats = groupedSeats[row] || [];
                    if (rowSeats.length === 0) return null;
                    
                    return (
                      <div key={row} className="seat-row">
                        <div className="row-label">{row}</div>
                        <div className="seats">
                          {rowSeats.map(seat => (
                            <button
                              key={seat.id}
                              className={`seat ${getZoneClass(seat)}`}
                              onClick={() => handleSeatClick(seat.id)}
                              disabled={seat.status === 'occupied'}
                              title={`${seat.id} - $${seat.price}`}
                            >
                              {seat.number}
                            </button>
                          ))}
                        </div>
                        <div className="row-label">{row}</div>
                      </div>
                    );
                  })}
                </div>
              ))
            ) : (
              // Fallback: renderizado simple
              Object.entries(groupedSeats).map(([row, rowSeats]) => (
                <div key={row} className="seat-row">
                  <div className="row-label">{row}</div>
                  <div className="seats">
                    {rowSeats.map(seat => (
                      <button
                        key={seat.id}
                        className={`seat ${getZoneClass(seat)}`}
                        onClick={() => handleSeatClick(seat.id)}
                        disabled={seat.status === 'occupied'}
                        title={`${seat.id} - $${seat.price}`}
                      >
                        {seat.number}
                      </button>
                    ))}
                  </div>
                  <div className="row-label">{row}</div>
                </div>
              ))
            )}
          </div>

          <div className="seat-legend">
            <div className="legend-item">
              <div className="seat-sample seat-available"></div>
              <span>Disponible</span>
            </div>
            <div className="legend-item">
              <div className="seat-sample seat-selected"></div>
              <span>Seleccionado</span>
            </div>
            <div className="legend-item">
              <div className="seat-sample seat-occupied"></div>
              <span>Ocupado</span>
            </div>
          </div>

          <div className="price-zones">
            <h3>Zonas de precios - {venue}</h3>
            <div className="zones">
              {priceZones.map((zone) => (
                <div key={zone.name} className="zone">
                  <span className={`zone-color ${zone.color}`}></span>
                  <span>{zone.name}: ${zone.price.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Columna derecha - Resumen de selección */}
        <div className="right-column">
          <div className="selection-summary-sidebar">
            <h3>Tus asientos</h3>
            
            {selectedSeats.length === 0 ? (
              <div className="empty-selection">
                <p>Aún no has seleccionado ningún asiento</p>
                <p className="empty-hint">Haz clic en los asientos disponibles del mapa para seleccionarlos</p>
              </div>
            ) : (
              <>
                <div className="selected-seats-grid">
                  {selectedSeats.map((seat) => (
                    <div key={seat.id} className="selected-seat-card">
                      <div className="seat-card-header">
                        <span className="seat-id">{seat.id}</span>
                        <button 
                          className="remove-seat-btn"
                          onClick={() => handleSeatClick(seat.id)}
                          title="Eliminar asiento"
                        >
                          ✕
                        </button>
                      </div>
                      <div className="seat-details">
                        <span className="seat-row">Fila {seat.row}</span>
                        <span className="seat-price">${seat.price.toLocaleString()}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="price-summary">
                  <div className="price-breakdown">
                    <div className="price-line">
                      <span>Subtotal ({selectedSeats.length} asiento{selectedSeats.length > 1 ? 's' : ''})</span>
                      <span>${totalPrice.toLocaleString()}</span>
                    </div>
                    <div className="price-line">
                      <span>Cargo por servicio</span>
                      <span>${(selectedSeats.length * 50).toLocaleString()}</span>
                    </div>
                    <div className="price-line total">
                      <strong>Total</strong>
                      <strong>${(totalPrice + selectedSeats.length * 50).toLocaleString()}</strong>
                    </div>
                  </div>

                  <button className="btn-continue" onClick={handleContinue}>
                    Continuar con la compra
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

