import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Topbar from './TopBar';
import SeatMap from './SeatMap';
import '../styles/EventDetail.css';

export interface EventFunction {
  id: number;
  date: string;
  time: string;
  venue: string;
  availableSeats: number;
  totalSeats: number;
}

export interface Event {
  id: number;
  title: string;
  description: string;
  image?: string;
  category: string;
  duration: string;
  rating: string;
  functions: EventFunction[];
}

// Datos de ejemplo para eventos
const eventsData: Event[] = [
  {
    id: 1,
    title: "Festival de Música 2025",
    description: "Los mejores artistas internacionales se reunirán en un solo lugar para ofrecerte una experiencia musical única e inolvidable.",
    category: "Concierto",
    duration: "4 horas",
    rating: "Todo Público",
    functions: [
      { id: 1, date: "2025-01-15", time: "19:00", venue: "Auditorio Nacional", availableSeats: 450, totalSeats: 500 },
      { id: 2, date: "2025-01-16", time: "19:00", venue: "Arena Monterrey", availableSeats: 720, totalSeats: 800 },
      { id: 3, date: "2025-01-17", time: "18:00", venue: "Foro Sol", availableSeats: 1200, totalSeats: 1500 },
    ]
  },
  {
    id: 2,
    title: "Concierto Sinfónico Premium",
    description: "Una velada inolvidable con la Orquesta Filarmónica interpretando las mejores obras clásicas.",
    category: "Música Clásica",
    duration: "2.5 horas",
    rating: "Todo Público",
    functions: [
      { id: 4, date: "2025-02-10", time: "20:00", venue: "Teatro de la Ciudad", availableSeats: 180, totalSeats: 200 },
      { id: 5, date: "2025-02-11", time: "20:00", venue: "Teatro Metropolitano", availableSeats: 110, totalSeats: 140 },
    ]
  },
  {
    id: 3,
    title: "Stand-Up Comedy Night",
    description: "Una noche de risas garantizadas con los mejores comediantes del momento.",
    category: "Comedia",
    duration: "2 horas",
    rating: "Mayores 18",
    functions: [
      { id: 6, date: "2025-02-20", time: "21:00", venue: "Centro Cultural", availableSeats: 85, totalSeats: 98 },
      { id: 7, date: "2025-02-21", time: "21:00", venue: "Teatro Metropolitano", availableSeats: 120, totalSeats: 140 },
    ]
  },
];

export default function EventDetail() {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  
  const event = eventsData.find(e => e.id === Number(eventId));
  const [selectedFunctionId, setSelectedFunctionId] = useState<number>(
    event?.functions[0]?.id || 0
  );

  if (!event) {
    return (
      <>
        <Topbar />
        <div className="event-detail-container">
          <div className="event-not-found">
            <h2>Evento no encontrado</h2>
            <button onClick={() => navigate('/')} className="btn-back">
              Volver al inicio
            </button>
          </div>
        </div>
      </>
    );
  }

  const selectedFunction = event.functions.find(f => f.id === selectedFunctionId);

  return (
    <>
      <Topbar />
      <div className="event-detail-container">
        <button onClick={() => navigate('/')} className="btn-back-top">
          ← Volver
        </button>

        <div className="event-header">
          <div className="event-image-placeholder">
            <span>{event.title.charAt(0)}</span>
          </div>
          <div className="event-info">
            <div className="event-category">{event.category}</div>
            <h1 className="event-title">{event.title}</h1>
            <p className="event-description">{event.description}</p>
            <div className="event-meta">
              <div className="meta-item">
                <strong>Duración:</strong> {event.duration}
              </div>
              <div className="meta-item">
                <strong>Clasificación:</strong> {event.rating}
              </div>
            </div>
          </div>
        </div>

        <div className="functions-section">
          <h2>Selecciona una función</h2>
          <div className="functions-grid">
            {event.functions.map((func) => (
              <div
                key={func.id}
                className={`function-card ${selectedFunctionId === func.id ? 'selected' : ''}`}
                onClick={() => setSelectedFunctionId(func.id)}
              >
                <div className="function-date">
                  {new Date(func.date).toLocaleDateString('es-MX', {
                    weekday: 'short',
                    day: 'numeric',
                    month: 'short'
                  })}
                </div>
                <div className="function-time">{func.time} hrs</div>
                <div className="function-venue">{func.venue}</div>
                <div className={`function-availability ${func.availableSeats < 100 ? 'low' : ''}`}>
                  {func.availableSeats} asientos disponibles
                </div>
              </div>
            ))}
          </div>
        </div>

        {selectedFunction && (
          <div className="seat-selection-section">
            <h2>Selecciona tus asientos</h2>
            <SeatMap 
              functionId={selectedFunction.id}
              venue={selectedFunction.venue}
            />
          </div>
        )}
      </div>
      <footer>
        <p>© 2025 StageGo. All rights reserved.</p>
      </footer>
    </>
  );
}


