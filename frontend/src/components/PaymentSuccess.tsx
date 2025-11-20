import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Topbar from './TopBar';
import '../styles/PaymentSuccess.css';

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const clientSecret = searchParams.get('payment_intent_client_secret');
    const paymentIntentId = searchParams.get('payment_intent');
    const redirectStatus = searchParams.get('redirect_status');
    
    // Retrieve stored purchase data from localStorage
    const purchaseDataString = localStorage.getItem('pendingPurchase');

    if (!clientSecret || !paymentIntentId) {
      setStatus('error');
      setMessage('No se encontró información del pago.');
      return;
    }

    if (redirectStatus === 'succeeded' && purchaseDataString) {
        const purchaseData = JSON.parse(purchaseDataString);
        
        // Confirm payment with backend to register in DB
        confirmPaymentWithBackend(paymentIntentId, purchaseData);
    } else if (redirectStatus === 'processing') {
        setStatus('success');
        setMessage('Tu pago se está procesando.');
    } else {
        setStatus('error');
        setMessage('El pago no se completó correctamente.');
    }
  }, [searchParams]);

  const confirmPaymentWithBackend = async (paymentIntentId: string, purchaseData: any) => {
      try {
          const response = await fetch('http://localhost:3001/api/payments/confirm-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                  paymentIntentId,
                  items: purchaseData.selectedSeats,
                  customerId: 3, // Hardcoded for demo, should come from auth context
                  functionId: purchaseData.functionId
              })
          });

          if (response.ok) {
              setStatus('success');
              // Clear pending purchase
              localStorage.removeItem('pendingPurchase');
          } else {
              console.error('Error registering purchase in DB');
              setStatus('success'); // Show success anyway as payment was successful, but log error
              setMessage('Pago exitoso, pero hubo un error al registrar los boletos. Contacta soporte.');
          }
      } catch (error) {
          console.error('Error confirming payment:', error);
          setStatus('success');
          setMessage('Pago exitoso. Error de conexión al registrar boletos.');
      }
  };

  return (
    <div className="payment-success-page">
      <Topbar />
      <div className="success-container">
        {status === 'success' ? (
            <div className="success-card">
                <div className="icon-circle success">
                    ✓
                </div>
                <h1>¡Pago Exitoso!</h1>
                <p>Gracias por tu compra. Tus boletos han sido reservados.</p>
                <p className="transaction-id">ID de Transacción: {searchParams.get('payment_intent')}</p>
                {message && <p className="info-message">{message}</p>}
                
                <div className="actions">
                    <button onClick={() => navigate('/')} className="btn-home">
                        Volver al Inicio
                    </button>
                    <button onClick={() => navigate('/perfil')} className="btn-tickets">
                        Ver Mis Boletos
                    </button>
                </div>
            </div>
        ) : status === 'error' ? (
            <div className="success-card">
                <div className="icon-circle error">
                    ✕
                </div>
                <h1>Algo salió mal</h1>
                <p>{message}</p>
                <button onClick={() => navigate('/')} className="btn-home">
                    Volver al Inicio
                </button>
            </div>
        ) : (
            <div className="loading-state">
                <div className="spinner"></div>
                <p>Verificando y registrando tu compra...</p>
            </div>
        )}
      </div>
    </div>
  );
}
