import React, { useState, useEffect } from 'react';
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import '../styles/CheckoutForm.css';

interface CheckoutFormProps {
  total: number;
  onCancel: () => void;
  onSuccess?: () => void;
}

export default function CheckoutForm({ total, onCancel, onSuccess }: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();

  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!stripe) {
      return;
    }

    const clientSecret = new URLSearchParams(window.location.search).get(
      "payment_intent_client_secret"
    );

    if (!clientSecret) {
      return;
    }

    stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
      switch (paymentIntent?.status) {
        case "succeeded":
          setMessage("Payment succeeded!");
          break;
        case "processing":
          setMessage("Your payment is processing.");
          break;
        case "requires_payment_method":
          setMessage("Your payment was not successful, please try again.");
          break;
        default:
          setMessage("Something went wrong.");
          break;
      }
    });
  }, [stripe]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    setIsLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // Make sure to change this to your payment completion page
        return_url: `${window.location.origin}/success`, // You might want to create this route or handle it differently
      },
    });

    // This point will only be reached if there is an immediate error when
    // confirming the payment. Otherwise, your customer will be redirected to
    // your `return_url`. For some payment methods like iDEAL, your customer will
    // be redirected to an intermediate site first to authorize the payment, then
    // redirected to the `return_url`.
    if (error.type === "card_error" || error.type === "validation_error") {
      setMessage(error.message || "An unexpected error occurred.");
    } else {
      setMessage("An unexpected error occurred.");
    }

    setIsLoading(false);
  };

  return (
    <form id="payment-form" onSubmit={handleSubmit} className="checkout-form">
      <h3 style={{marginBottom: '20px', color: 'var(--text-primary)'}}>Finalizar Compra</h3>
      <PaymentElement id="payment-element" options={{layout: "tabs"}} />
      <button disabled={isLoading || !stripe || !elements} id="submit" className="btn-pay">
        <span id="button-text">
          {isLoading ? <div className="spinner" id="spinner"></div> : `Pagar $${total.toLocaleString()}`}
        </span>
      </button>
      <button type="button" onClick={onCancel} className="btn-cancel-pay">
        Cancelar
      </button>
      {message && <div id="payment-message" className="payment-message">{message}</div>}
    </form>
  );
}

