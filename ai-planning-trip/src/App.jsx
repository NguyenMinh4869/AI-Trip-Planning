import React from 'react'
import './App.css'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Plan from './pages/Plan'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

function App() {
  return (
    <div className="app">
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/plan" element={<Plan />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
