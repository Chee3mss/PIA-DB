import { useState } from 'react';
import '../styles/SeatMap.css';

interface Seat {
  id: string;
  row: string;
  number: number;
  status: 'available' | 'occupied' | 'selected';
  price: number;
}

interface SeatMapProps {
  functionId: number;
  venue: string;
}

// Generar asientos para el auditorio
const generateSeats = (): Seat[] => {
  const seats: Seat[] = [];
  const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
  const seatsPerRow = 12;
  
  rows.forEach((row, rowIndex) => {
    for (let num = 1; num <= seatsPerRow; num++) {
      // Simular algunos asientos ocupados aleatoriamente
      const isOccupied = Math.random() > 0.7;
      
      // Precios según la fila
      let price = 500;
      if (rowIndex < 3) price = 1200; // Filas A-C (VIP)
      else if (rowIndex < 6) price = 800; // Filas D-F (Premium)
      
      seats.push({
        id: `${row}${num}`,
        row,
        number: num,
        status: isOccupied ? 'occupied' : 'available',
        price
      });
    }
  });
  
  return seats;
};

export default function SeatMap({ functionId, venue }: SeatMapProps) {
  const [seats, setSeats] = useState<Seat[]>(generateSeats());
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

  const groupedSeats = seats.reduce((acc, seat) => {
    if (!acc[seat.row]) {
      acc[seat.row] = [];
    }
    acc[seat.row].push(seat);
    return acc;
  }, {} as Record<string, Seat[]>);

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
            {Object.entries(groupedSeats).map(([row, rowSeats]) => (
              <div key={row} className="seat-row">
                <div className="row-label">{row}</div>
                <div className="seats">
                  {rowSeats.map(seat => (
                    <button
                      key={seat.id}
                      className={`seat seat-${seat.status}`}
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
            ))}
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
            <h3>Zonas de precios</h3>
            <div className="zones">
              <div className="zone">
                <span className="zone-color vip"></span>
                <span>Filas A-C: $1,200</span>
              </div>
              <div className="zone">
                <span className="zone-color premium"></span>
                <span>Filas D-F: $800</span>
              </div>
              <div className="zone">
                <span className="zone-color general"></span>
                <span>Filas G-J: $500</span>
              </div>
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

