// Topbar.tsx
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/small-logo.svg'
import { Search, User, Menu, X, MapPin, LogOut, Settings, Package, ChevronDown } from 'lucide-react';
import { authService, eventosService, ubicacionService, type Evento, type Estado } from '../services/api';
import '../styles/TopBar.css';

export default function Topbar() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isLocationDropdownOpen, setIsLocationDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Evento[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [estados, setEstados] = useState<Estado[]>([]);
  const [selectedLocation, setSelectedLocation] = useState('Cargando...');
  
  // Refs para cerrar dropdowns al hacer click fuera
  const userDropdownRef = useRef<HTMLDivElement>(null);
  const locationDropdownRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  // Cargar usuario actual y estados
  useEffect(() => {
    const user = authService.getCurrentUser();
    setCurrentUser(user);
    
    // Cargar estados desde el backend
    const loadEstados = async () => {
      try {
        const estadosData = await ubicacionService.getEstados();
        setEstados(estadosData);
        
        // Seleccionar el primer estado por defecto (o Nuevo León si existe)
        if (estadosData.length > 0) {
          const nuevoLeon = estadosData.find(e => e.nombre.toLowerCase().includes('nuevo león'));
          setSelectedLocation(nuevoLeon ? nuevoLeon.nombre : estadosData[0].nombre);
        }
      } catch (error) {
        console.error('Error al cargar estados:', error);
        // En caso de error, usar un valor por defecto
        setSelectedLocation('México');
      }
    };
    
    loadEstados();
  }, []);

  // Cerrar dropdowns al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target as Node)) {
        setIsUserDropdownOpen(false);
      }
      if (locationDropdownRef.current && !locationDropdownRef.current.contains(event.target as Node)) {
        setIsLocationDropdownOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setSearchResults([]);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Búsqueda de eventos
  useEffect(() => {
    const searchEventos = async () => {
      if (searchQuery.trim().length < 2) {
        setSearchResults([]);
        return;
      }

      setIsSearching(true);
      try {
        const results = await eventosService.searchEventos(searchQuery);
        setSearchResults(results);
      } catch (error) {
        console.error('Error buscando eventos:', error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    };

    const debounceTimer = setTimeout(searchEventos, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  const handleLogout = () => {
    authService.logout();
    setCurrentUser(null);
    setIsUserDropdownOpen(false);
    navigate('/');
  };

  const handleLogin = () => {
    setIsUserDropdownOpen(false);
    navigate('/login');
  };

  const handleEventClick = (eventId: number) => {
    setSearchQuery('');
    setSearchResults([]);
    navigate(`/event/${eventId}`);
  };

  const goToHome = () => {
    navigate('/');
  };

  return (
    <>
      <div className="hero">
        <div className="logo" onClick={goToHome}>
          <img src={logo} alt="logo" className="small-logo" />
          <span className="logo-text">StageGo</span>
        </div>

        <div className="options">
          {/* Barra de búsqueda - Desktop */}
          <div className="search-bar" ref={searchRef}>
            <Search className="search-icon" />
            <input 
              type="text" 
              placeholder="Buscar eventos, artistas..." 
              className="search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            
            {/* Resultados de búsqueda */}
            {searchResults.length > 0 && (
              <div className="search-results">
                {searchResults.map((evento) => (
                  <div 
                    key={evento.id_evento} 
                    className="search-result-item"
                    onClick={() => handleEventClick(evento.id_evento)}
                  >
                    <div className="search-result-info">
                      <h4>{evento.nombre_evento}</h4>
                      <p>{evento.tipo_evento_nombre || evento.clasificacion}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {isSearching && searchQuery.length >= 2 && (
              <div className="search-results">
                <div className="search-loading">Buscando...</div>
              </div>
            )}
          </div>

          {/* Ubicación - Desktop */}
          <div className="dropdown-wrapper" ref={locationDropdownRef}>
            <button 
              className="location-button"
              onClick={() => setIsLocationDropdownOpen(!isLocationDropdownOpen)}
            >
              <MapPin className="icon" />
              <span>{selectedLocation}</span>
              <ChevronDown className={`chevron ${isLocationDropdownOpen ? 'rotated' : ''}`} />
            </button>

            {isLocationDropdownOpen && (
              <div className="dropdown location-dropdown">
                <div className="dropdown-header">
                  <h3>Selecciona tu estado</h3>
                </div>
                <div className="location-list">
                  {estados.length > 0 ? (
                    estados.map((estado) => (
                      <button
                        key={estado.id_estado}
                        className={`location-item ${selectedLocation === estado.nombre ? 'active' : ''}`}
                        onClick={() => {
                          setSelectedLocation(estado.nombre);
                          setIsLocationDropdownOpen(false);
                        }}
                      >
                        <MapPin className="icon" />
                        <span>{estado.nombre}</span>
                      </button>
                    ))
                  ) : (
                    <div className="location-loading">
                      <p>Cargando estados...</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Usuario - Desktop */}
          <div className="dropdown-wrapper" ref={userDropdownRef}>
            <button 
              className="user-button"
              onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
            >
              <User className="icon" />
              <span>{currentUser ? currentUser.nombre_completo?.split(' ')[0] : 'Mi Cuenta'}</span>
              <ChevronDown className={`chevron ${isUserDropdownOpen ? 'rotated' : ''}`} />
            </button>

            {isUserDropdownOpen && (
              <div className="dropdown">
                {currentUser ? (
                  <>
                    <div className="dropdown-header">
                      <div className="user-info">
                        <div className="user-avatar">
                          <User className="icon" />
                        </div>
                        <div>
                          <h4>{currentUser.nombre_completo}</h4>
                          <p>{currentUser.email}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="dropdown-menu">
                      <button className="menu-item">
                        <User className="icon" />
                        <span>Mi Perfil</span>
                      </button>
                      <button className="menu-item">
                        <Package className="icon" />
                        <span>Mis Pedidos</span>
                      </button>
                      <button className="menu-item">
                        <Settings className="icon" />
                        <span>Configuración</span>
                      </button>
                      <div className="menu-divider"></div>
                      <button className="menu-item logout" onClick={handleLogout}>
                        <LogOut className="icon" />
                        <span>Cerrar Sesión</span>
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="dropdown-header">
                      <h3>¡Bienvenido!</h3>
                    </div>
                    <div className="dropdown-menu">
                      <button className="menu-item" onClick={handleLogin}>
                        <User className="icon" />
                        <span>Iniciar Sesión</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Menú hamburguesa - Mobile */}
          <button className="menu-button" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="icon-lg" /> : <Menu className="icon-lg" />}
          </button>
        </div>
      </div>

      {/* Menú Mobile */}
      <div className={`mobile-menu ${isMenuOpen ? 'open' : ''}`}>
        {/* Búsqueda Mobile */}
        <div className="mobile-search">
          <Search className="search-icon" />
          <input 
            type="text" 
            placeholder="Buscar eventos..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Resultados de búsqueda mobile */}
        {searchResults.length > 0 && (
          <div className="mobile-search-results">
            {searchResults.map((evento) => (
              <div 
                key={evento.id_evento} 
                className="mobile-search-result"
                onClick={() => {
                  handleEventClick(evento.id_evento);
                  setIsMenuOpen(false);
                }}
              >
                <h4>{evento.nombre_evento}</h4>
                <p>{evento.tipo_evento_nombre || evento.clasificacion}</p>
              </div>
            ))}
          </div>
        )}

        {/* Opciones Mobile */}
        <div className="mobile-options">
          <div className="mobile-option" onClick={() => setIsLocationDropdownOpen(!isLocationDropdownOpen)}>
            <div className="mobile-option-left">
              <MapPin className="icon" />
              <span>{selectedLocation}</span>
            </div>
          </div>

          <div className="mobile-option" onClick={() => currentUser ? navigate('/perfil') : handleLogin()}>
            <div className="mobile-option-left">
              <User className="icon" />
              <span>{currentUser ? currentUser.nombre_completo : 'Mi Cuenta'}</span>
            </div>
          </div>

          {currentUser && (
            <div className="mobile-option" onClick={handleLogout}>
              <div className="mobile-option-left">
                <LogOut className="icon" />
                <span>Cerrar Sesión</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}