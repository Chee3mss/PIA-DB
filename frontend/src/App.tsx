import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Welcome from './components/Welcome';
import LoginPage from './components/LoginPage';
import EventDetail from './components/EventDetail';
import EventTest from './components/EventTest';
import SeatSelection from './components/SeatSelection';
import Profile from './components/Profile';
import AdminPanel from './components/AdminPanel';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/event/:eventId" element={<EventDetail />} />
        <Route path="/event/:eventId/seats/:functionId" element={<SeatSelection />} />
        <Route path="/eventest" element={<EventTest />} />
        <Route path="/perfil" element={<Profile />} />
        <Route path="/admin" element={<AdminPanel />} />
      </Routes>
    </Router>
  );
}

export default App;
