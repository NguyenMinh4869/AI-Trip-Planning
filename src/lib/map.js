import mapboxgl from 'mapbox-gl'

let map = null

// Sample locations with custom icons
const sampleLocations = [
  {
    name: "Notre Dame Cathedral of Saigon",
    coordinates: [106.6992, 10.7798],
    icon: "https://cdn-icons-png.flaticon.com/512/3448/3448588.png", // church
  },
  {
    name: "Bến Nghé Street Food",
    coordinates: [106.7009, 10.7769],
    icon: "https://cdn-icons-png.flaticon.com/512/3075/3075977.png", // food
  },
  {
    name: "Bitexco Financial Tower",
    coordinates: [106.7047, 10.7715],
    icon: "https://cdn-icons-png.flaticon.com/512/684/684908.png", // tower
  },
  {
    name: "Independence Palace",
    coordinates: [106.6958, 10.7772],
    icon: "https://cdn-icons-png.flaticon.com/512/3179/3179068.png", // building
  },
]

export function initMap() {
  if (map || !document.getElementById('map')) return
  
  const token = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN
  if (!token) {
    console.error('Mapbox access token not found. Please add VITE_MAPBOX_ACCESS_TOKEN to your .env file')
    return
  }
  
  mapboxgl.accessToken = token
  
  map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v12',
    center: [108.2068, 16.0471], // [lng, lat] format for Mapbox
    zoom: 12
  })
  
  // Add navigation controls
  map.addControl(new mapboxgl.NavigationControl())
  
  // Ensure map resizes properly
  map.on('load', () => {
    map.resize()
  })
  
  // Resize map when window resizes
  window.addEventListener('resize', () => {
    if (map) {
      map.resize()
    }
  })
}

export function setMarkers(items) {
  if (!map) return
  
  // Clear existing markers
  const existingMarkers = document.querySelectorAll('.mapboxgl-marker')
  existingMarkers.forEach(marker => marker.remove())
  
  if (!items || items.length === 0) return
  
  const bounds = new mapboxgl.LngLatBounds()
  let hasValidMarkers = false
  
  items.forEach((item) => {
    if (typeof item.lat !== 'number' || typeof item.lng !== 'number') return
    
    // Create custom marker element if icon is provided
    let markerElement = null
    if (item.icon) {
      markerElement = document.createElement("div")
      markerElement.style.backgroundImage = `url(${item.icon})`
      markerElement.style.width = "32px"
      markerElement.style.height = "32px"
      markerElement.style.backgroundSize = "cover"
      markerElement.style.borderRadius = "50%"
      markerElement.style.cursor = "pointer"
    }
    
    // Create marker with custom element or default
    const marker = new mapboxgl.Marker(markerElement)
      .setLngLat([item.lng, item.lat])
      .addTo(map)
    
    // Add popup if item has name
    if (item.name) {
      marker.setPopup(new mapboxgl.Popup({ 
        offset: 25,
        className: 'custom-popup'
      }).setHTML(`<div class="popup-content">${item.name}</div>`))
    }
    
    bounds.extend([item.lng, item.lat])
    hasValidMarkers = true
  })
  
  if (hasValidMarkers) {
    map.fitBounds(bounds, { padding: 50 })
  }
}

// Function to add sample locations with custom icons
export function addSampleLocations() {
  if (!map) return
  
  // Clear existing markers first
  const existingMarkers = document.querySelectorAll('.mapboxgl-marker')
  existingMarkers.forEach(marker => marker.remove())
  
  const bounds = new mapboxgl.LngLatBounds()
  
  sampleLocations.forEach((loc) => {
    // Create custom marker element
    const el = document.createElement("div")
    el.style.backgroundImage = `url(${loc.icon})`
    el.style.width = "32px"
    el.style.height = "32px"
    el.style.backgroundSize = "cover"
    el.style.borderRadius = "50%"
    el.style.cursor = "pointer"
    
    // Create marker with custom element
    new mapboxgl.Marker(el)
      .setLngLat(loc.coordinates)
      .setPopup(new mapboxgl.Popup({ 
        offset: 25,
        className: 'custom-popup'
      }).setHTML(`<div class="popup-content">${loc.name}</div>`))
      .addTo(map)
    
    bounds.extend(loc.coordinates)
  })
  
  // Fit map to show all markers
  map.fitBounds(bounds, { padding: 50 })
}


