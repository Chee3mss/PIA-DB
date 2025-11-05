import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Welcome from './components/Welcome';
import LoginPage from './components/LoginPage';
import EventDetail from './components/EventDetail';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/event/:eventId" element={<EventDetail />} />
      </Routes>
    </Router>
  );
}

export default App;
