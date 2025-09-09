import React from 'react'

function Navbar() {
  return (
    <header className="nav">
      <div className="nav__container">
        <div className="nav__brand">Hhihiahah</div>
        <nav className="nav__links">
          <a href="#features">Tính Năng</a>
          <a href="#about">Blog Du Lịch</a>
          <a href="#prices">Thanh Toán</a>
          <a href="#contact">Liên Hệ QC</a>
          
        </nav>
        <div className="nav__actions">
          <button className="btn btn--ghost">Đăng Kí</button>
          <button className="btn btn--primary">Đăng Nhập</button>
        </div>
      </div>
    </header>
  )
}

export default Navbar


