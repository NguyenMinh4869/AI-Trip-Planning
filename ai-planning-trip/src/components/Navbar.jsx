import React from 'react'

function Navbar() {
  return (
    <header className="nav">
      <div className="nav__container">
        <div className="nav__brand">Hhihiahah</div>
        <nav className="nav__links">
          <a href="#features">Features</a>
          <a href="#about">About Us</a>
          <a href="#prices">Prices</a>
          <a href="#contact">Contact Us</a>
        </nav>
        <div className="nav__actions">
          <button className="btn btn--ghost">Register</button>
          <button className="btn btn--primary">Sign In</button>
        </div>
      </div>
    </header>
  )
}

export default Navbar


