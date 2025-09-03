import React from 'react'
import Hero from '../components/Hero'
import Popular from '../components/Popular'

function Home() {
  return (
    <div className="layout">
      <div>
        <Hero />
        <Popular />
      </div>
      <div className="map" id="map" />
    </div>
  )
}

export default Home


