import React from 'react'
import logo from '../assets/small-logo.svg'
import '../styles/Welcome.css'

export default function Welcome() {
    return (
      <>
        <div className="hero">
          <nav>
            <option value="eventos">Eventos</option>
            <option value="promos">Promos</option>

          </nav>
          <div className="logo">
            <img src = {logo} alt="logo" className='small-logo'/>
          </div>
          <div className="options">
            <img src="" alt="" />
            <img src="" alt="" />
          </div>
        </div>
        <main>
          Hola mundo
        </main>
        <footer>
          <p>© 2025 StageGo. All rights reserved.</p>
        </footer>
        </>
    )
}