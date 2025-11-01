// Topbar.tsx
import { useState } from 'react';
import logo from '../assets/small-logo.svg'
import { Search, ShoppingCart, User, Menu, X, MapPin } from 'lucide-react';
import '../styles/Topbar.css';

export default function Topbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(3);

  setCartCount(3);

  return (
    <>
      <div className="hero">
        <div className="logo">
          
          <img src={logo} alt="logo" className="small-logo" />
        </div>

        <div className="options">
          {/* Barra de búsqueda - Desktop */}
          <div className="search-bar">
            <Search className="search-icon" />
            <input 
              type="text" 
              placeholder="Buscar eventos, artistas..." 
              className="search-input"
            />
          </div>

          {/* Ubicación - Desktop */}
          <button className="location-button">
            <MapPin className="icon" />
            <span>Monterrey</span>
          </button>

          {/* Carrito - Desktop */}
          <button className="icon-button">
            <ShoppingCart className="icon" />
            {cartCount > 0 && (
              <span className="cart-badge">{cartCount}</span>
            )}
          </button>

          {/* Usuario - Desktop */}
          <button className="user-button">
            <User className="icon" />
            <span>Mi Cuenta</span>
          </button>

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
          <input type="text" placeholder="Buscar eventos..." />
        </div>

        {/* Opciones Mobile */}
        <div className="mobile-options">
          <div className="mobile-option">
            <div className="mobile-option-left">
              <MapPin className="icon" />
              <span>Monterrey</span>
            </div>
          </div>

          <div className="mobile-option">
            <div className="mobile-option-left">
              <ShoppingCart className="icon" />
              <span>Mi Carrito</span>
            </div>
            {cartCount > 0 && (
              <span className="mobile-badge">{cartCount}</span>
            )}
          </div>

          <div className="mobile-option">
            <div className="mobile-option-left">
              <User className="icon" />
              <span>Mi Cuenta</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}