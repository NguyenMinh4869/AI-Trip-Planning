let map
export function initMap() {
  if (map || !window.google || !document.getElementById('map')) return
  map = new window.google.maps.Map(document.getElementById('map'), {
    center: { lat: 16.0471, lng: 108.2068 },
    zoom: 12,
    mapId: 'DEMO_MAP',
  })
}

export function setMarkers(items) {
  if (!map || !window.google) return
  const bounds = new window.google.maps.LatLngBounds()
  items.forEach((it) => {
    if (typeof it.lat !== 'number' || typeof it.lng !== 'number') return
    const m = new window.google.maps.Marker({ position: { lat: it.lat, lng: it.lng }, map })
    bounds.extend(m.getPosition())
  })
  if (!bounds.isEmpty()) map.fitBounds(bounds)
}


