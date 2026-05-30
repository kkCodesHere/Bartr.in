import React, { useState, useEffect, useRef, useCallback } from 'react';
import Map, { Marker, NavigationControl, GeolocateControl } from 'react-map-gl';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import 'mapbox-gl/dist/mapbox-gl.css';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';

// Get Mapbox token from environment variable
const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN || 'pk.eyJ1IjoiYmFydHJpbiIsImEiOiJjbTVxcWRxZGswMDJsMmtzZGdqNGRqZGRhIn0.YOUR_TOKEN_HERE';

// Nagpur coordinates
const NAGPUR_CENTER = {
  longitude: 79.0882,
  latitude: 21.1458
};

// Custom marker component
const CustomMarker = ({ longitude, latitude, color = '#ef4444' }) => (
  <Marker longitude={longitude} latitude={latitude}>
    <div style={{
      width: '30px',
      height: '30px',
      cursor: 'pointer',
      transform: 'translate(-50%, -100%)'
    }}>
      <svg
        height="30"
        viewBox="0 0 24 24"
        style={{
          fill: color,
          stroke: '#000',
          strokeWidth: 2,
          filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))'
        }}
      >
        <path d="M12 0C7.802 0 4 3.403 4 7.602C4 11.8 7.469 16.812 12 24C16.531 16.812 20 11.8 20 7.602C20 3.403 16.199 0 12 0Z" />
        <circle cx="12" cy="8" r="3" fill="white" />
      </svg>
    </div>
  </Marker>
);

// Location Picker Map for posting gigs
export function LocationPickerMap({ onLocationSelect, initialLocation }) {
  const [viewState, setViewState] = useState({
    longitude: initialLocation?.[1] || NAGPUR_CENTER.longitude,
    latitude: initialLocation?.[0] || NAGPUR_CENTER.latitude,
    zoom: initialLocation ? 15 : 12
  });
  
  const [marker, setMarker] = useState(
    initialLocation ? { longitude: initialLocation[1], latitude: initialLocation[0] } : null
  );
  
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const mapRef = useRef(null);

  // Geocode search query
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    setSearching(true);
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(searchQuery)}.json?` +
        `proximity=${NAGPUR_CENTER.longitude},${NAGPUR_CENTER.latitude}&` +
        `bbox=78.9,21.0,79.2,21.3&` + // Nagpur bounding box
        `limit=5&` +
        `access_token=${MAPBOX_TOKEN}`
      );
      const data = await response.json();
      setSearchResults(data.features || []);
    } catch (error) {
      console.error('Search error:', error);
    }
    setSearching(false);
  };

  // Select search result
  const selectSearchResult = (result) => {
    const [longitude, latitude] = result.center;
    setMarker({ longitude, latitude });
    setViewState({
      longitude,
      latitude,
      zoom: 15
    });
    onLocationSelect(result.place_name, [latitude, longitude]);
    setSearchResults([]);
    setSearchQuery('');
  };

  // Handle map click
  const handleMapClick = useCallback(async (event) => {
    const { lngLat } = event;
    const longitude = lngLat.lng;
    const latitude = lngLat.lat;
    
    setMarker({ longitude, latitude });
    
    // Reverse geocode to get address
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?` +
        `access_token=${MAPBOX_TOKEN}`
      );
      const data = await response.json();
      const address = data.features?.[0]?.place_name || `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
      onLocationSelect(address, [latitude, longitude]);
    } catch (error) {
      console.error('Reverse geocode error:', error);
      onLocationSelect(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`, [latitude, longitude]);
    }
  }, [onLocationSelect]);

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {/* Search Bar */}
      <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.5rem' }}>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search location in Nagpur..."
          style={{
            flex: 1,
            padding: '0.75rem 1rem',
            border: '3px solid black',
            borderRadius: '12px',
            fontWeight: '700',
            fontSize: '0.9rem',
            outline: 'none'
          }}
        />
        <button
          type="submit"
          disabled={searching}
          style={{
            padding: '0.75rem 1.5rem',
            background: 'black',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            fontWeight: '900',
            cursor: searching ? 'not-allowed' : 'pointer',
            opacity: searching ? 0.6 : 1
          }}
        >
          {searching ? '...' : 'Search'}
        </button>
      </form>

      {/* Search Results */}
      {searchResults.length > 0 && (
        <div style={{
          background: 'white',
          border: '3px solid black',
          borderRadius: '12px',
          maxHeight: '150px',
          overflowY: 'auto'
        }}>
          {searchResults.map((result, idx) => (
            <div
              key={idx}
              onClick={() => selectSearchResult(result)}
              style={{
                padding: '0.75rem 1rem',
                cursor: 'pointer',
                borderBottom: idx < searchResults.length - 1 ? '1px solid #eee' : 'none',
                fontWeight: '600',
                fontSize: '0.85rem',
                transition: 'background 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#f8fafc'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
            >
              📍 {result.place_name}
            </div>
          ))}
        </div>
      )}

      {/* Map */}
      <div style={{ flex: 1, minHeight: '300px', border: '4px solid black', borderRadius: '16px', overflow: 'hidden' }}>
        <Map
          ref={mapRef}
          {...viewState}
          onMove={evt => setViewState(evt.viewState)}
          onClick={handleMapClick}
          mapStyle="mapbox://styles/mapbox/streets-v12"
          mapboxAccessToken={MAPBOX_TOKEN}
          style={{ width: '100%', height: '100%' }}
        >
          {marker && (
            <CustomMarker 
              longitude={marker.longitude} 
              latitude={marker.latitude}
              color="#ef4444"
            />
          )}
          
          <NavigationControl position="top-right" />
          <GeolocateControl
            position="top-right"
            trackUserLocation
            onGeolocate={(e) => {
              const { longitude, latitude } = e.coords;
              setMarker({ longitude, latitude });
              handleMapClick({ lngLat: { lng: longitude, lat: latitude } });
            }}
          />
        </Map>
      </div>

      <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#64748b', textAlign: 'center' }}>
        💡 Click on the map to select a location or search above
      </div>
    </div>
  );
}

// Gig Location Display Map (read-only)
export function GigLocationMap({ location, coordinates }) {
  const [viewState, setViewState] = useState({
    longitude: coordinates?.[1] || NAGPUR_CENTER.longitude,
    latitude: coordinates?.[0] || NAGPUR_CENTER.latitude,
    zoom: coordinates ? 14 : 12
  });
  
  const [marker, setMarker] = useState(
    coordinates ? { longitude: coordinates[1], latitude: coordinates[0] } : null
  );
  
  const [loading, setLoading] = useState(!coordinates);

  useEffect(() => {
    if (!coordinates && location && location !== 'Remote') {
      // Geocode the location string
      setLoading(true);
      fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(location)}.json?` +
        `proximity=${NAGPUR_CENTER.longitude},${NAGPUR_CENTER.latitude}&` +
        `limit=1&` +
        `access_token=${MAPBOX_TOKEN}`
      )
        .then(res => res.json())
        .then(data => {
          if (data.features && data.features.length > 0) {
            const [longitude, latitude] = data.features[0].center;
            setMarker({ longitude, latitude });
            setViewState({
              longitude,
              latitude,
              zoom: 14
            });
          }
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [location, coordinates]);

  if (location === 'Remote' || (!marker && !loading)) {
    return (
      <div style={{
        width: '100%',
        height: '250px',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: '16px',
        border: '4px solid black',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: '1rem',
        color: 'white'
      }}>
        <div style={{ fontSize: '3rem' }}>🌐</div>
        <div style={{ fontSize: '1.5rem', fontWeight: '900', textTransform: 'uppercase' }}>Remote Work</div>
        <div style={{ fontSize: '0.9rem', fontWeight: '700', opacity: 0.9 }}>Location flexible</div>
      </div>
    );
  }

  if (loading) {
    return (
      <div style={{
        width: '100%',
        height: '250px',
        background: '#f8fafc',
        borderRadius: '16px',
        border: '4px solid black',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: '700',
        color: '#64748b'
      }}>
        Loading map...
      </div>
    );
  }

  return (
    <div style={{ width: '100%', height: '250px', border: '4px solid black', borderRadius: '16px', overflow: 'hidden' }}>
      <Map
        {...viewState}
        onMove={evt => setViewState(evt.viewState)}
        mapStyle="mapbox://styles/mapbox/streets-v12"
        mapboxAccessToken={MAPBOX_TOKEN}
        style={{ width: '100%', height: '100%' }}
        interactive={true}
        scrollZoom={true}
      >
        {marker && (
          <CustomMarker 
            longitude={marker.longitude} 
            latitude={marker.latitude}
            color="#ef4444"
          />
        )}
        
        <NavigationControl position="top-right" />
      </Map>
    </div>
  );
}
