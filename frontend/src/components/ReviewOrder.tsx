import { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Topbar from './TopBar';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from './CheckoutForm';
import '../styles/ReviewOrder.css';

// Cargar la clave publicable de Stripe desde las variables de entorno
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '');

interface LocationState {
  selectedSeats: any[];
  eventoInfo: any;
  seatsioConfig: any;
  holdToken: string;
  holdExpiration: string; // ISO date string or null
}

export default function ReviewOrder() {
  const { eventId, functionId } = useParams<{ eventId: string; functionId: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as LocationState;

  const [clientSecret, setClientSecret] = useState("");
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [expired, setExpired] = useState(false);

  // Redirect if no state is present (e.g. direct access)
  useEffect(() => {
    if (!state) {
      navigate(`/event/${eventId}/seats/${functionId}`);
    }
  }, [state, eventId, functionId, navigate]);

  // Timer Logic
  useEffect(() => {
    if (!state?.holdExpiration) return;

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const expiration = new Date(state.holdExpiration).getTime();
      const distance = expiration - now;

      if (distance < 0) {
        clearInterval(interval);
        setExpired(true);
        setTimeLeft(0);
      } else {
        setTimeLeft(Math.floor(distance / 1000));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [state?.holdExpiration]);

  // Initialize Payment Intent
  useEffect(() => {
    if (state?.selectedSeats?.length > 0 && !clientSecret) {
        initiatePayment();
    }
  }, [state?.selectedSeats]);

  const initiatePayment = async () => {
    // Simplify items as before
    const simplifiedItems = state.selectedSeats.map(seat => ({
        id: seat.id,
        label: seat.label,
        category: seat.category ? { label: seat.category.label } : null,
        pricing: seat.pricing ? { price: seat.pricing.price } : { price: 500 }
    }));

    try {
        const response = await fetch("http://localhost:3001/api/payments/create-payment-intent", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ items: simplifiedItems }),
        });
        
        if (!response.ok) {
            throw new Error('Error initiating payment');
        }

        const data = await response.json();
        setClientSecret(data.clientSecret);
        
        // Store simplified items in localStorage to retrieve after payment redirect
        localStorage.setItem('pendingPurchase', JSON.stringify({
            selectedSeats: simplifiedItems,
            functionId: functionId,
            eventId: eventId,
            timestamp: Date.now()
        }));
        
    } catch (error) {
        console.error("Error:", error);
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleCancel = () => {
      // TODO: Release seats via API or just navigate back (Seats.io will expire them eventually)
      navigate(-1);
  };

  if (!state) return null;

  const total = state.selectedSeats.reduce((sum, seat) => sum + (seat.pricing?.price || 500), 0);

  const appearance = {
    theme: 'stripe' as const,
  };
  
  const options = {
    clientSecret,
    appearance,
  };

  if (expired) {
      return (
        <div className="review-page">
            <Topbar />
            <div className="review-container expired">
                <div className="expired-message">
                    <h2>⏳ Tiempo expirado</h2>
                    <p>El tiempo para completar tu compra ha expirado.</p>
                    <button onClick={() => navigate(`/event/${eventId}/seats/${functionId}`)} className="btn-primary">
                        Volver a seleccionar asientos
                    </button>
                </div>
            </div>
        </div>
      );
  }

  return (
    <div className="review-page">
      <Topbar />
      <div className="review-container">
        
        <div className="review-header">
            <h1>Revisión de Compra</h1>
            {timeLeft !== null && (
                <div className={`timer-badge ${timeLeft < 60 ? 'urgent' : ''}`}>
                    Tiempo restante: <span>{formatTime(timeLeft)}</span>
                </div>
            )}
        </div>

        <div className="review-content">
            {/* Order Summary */}
            <div className="order-summary-card">
                <h3>Tu Orden</h3>
                
                <div className="event-details">
                    <h4>{state.eventoInfo?.nombre_evento}</h4>
                    <p>{state.seatsioConfig?.auditorio.nombre} • {state.seatsioConfig?.funcion.fecha} {state.seatsioConfig?.funcion.hora}</p>
                </div>

                <div className="seats-list">
                    {state.selectedSeats.map((seat, idx) => (
                        <div key={idx} className="seat-item">
                            <div className="seat-info">
                                <span className="seat-label">{seat.label}</span>
                                <span className="seat-cat">{seat.category?.label || 'General'}</span>
                            </div>
                            <div className="seat-price">
                                ${(seat.pricing?.price || 500).toLocaleString()}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="total-section">
                    <span>Total a pagar</span>
                    <span className="total-amount">${total.toLocaleString()}</span>
                </div>
            </div>

            {/* Payment Section */}
            <div className="payment-section-card">
                {clientSecret ? (
                    <Elements options={options} stripe={stripePromise}>
                        <CheckoutForm 
                            total={total}
                            onCancel={handleCancel}
                        />
                    </Elements>
                ) : (
                    <div className="loading-payment">
                        <div className="spinner"></div>
                        <p>Preparando pago seguro...</p>
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
}
