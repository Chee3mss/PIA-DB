import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import './App.css';
import Welcome from './components/Welcome';
import LoginPage from './components/LoginPage';
import EventDetail from './components/EventDetail';
import EventTest from './components/EventTest';
import SeatSelection from './components/SeatSelection';
import ReviewOrder from './components/ReviewOrder';
import PaymentSuccess from './components/PaymentSuccess';
import Profile from './components/Profile';
import AdminPanel from './components/AdminPanel';
import Boletos from './components/Boletos';

// Componente para hacer scroll al inicio cuando cambia la ruta
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/event/:eventId" element={<EventDetail />} />
        <Route path="/event/:eventId/seats/:functionId" element={<SeatSelection />} />
        <Route path="/event/:eventId/seats/:functionId/review" element={<ReviewOrder />} />
        <Route path="/success" element={<PaymentSuccess />} />
        <Route path="/eventest" element={<EventTest />} />
        <Route path="/perfil" element={<Profile />} />
        <Route path="/boletos" element={<Boletos />} />
        <Route path="/admin" element={<AdminPanel />} />
      </Routes>
    </Router>
  );
}

export default App;
