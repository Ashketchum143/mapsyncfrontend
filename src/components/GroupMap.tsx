import React, { useState, useCallback } from 'react';
import { GoogleMap, useJsApiLoader, Marker, Polyline, InfoWindow } from '@react-google-maps/api';
import { MapPin } from 'lucide-react';
import { Trip } from '../contexts/TripContext';

interface GroupMapProps {
  trip: Trip;
}

// Mock API key - in a real app, this would be an environment variable
const GOOGLE_MAPS_API_KEY = 'YOUR_GOOGLE_MAPS_API_KEY';

// Map container style
const containerStyle = {
  width: '100%',
  height: '100%'
};

const GroupMap: React.FC<GroupMapProps> = ({ trip }) => {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: GOOGLE_MAPS_API_KEY
  });

  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [selectedMarker, setSelectedMarker] = useState<string | null>(null);

  // Calculate center of the map based on all points
  const center = React.useMemo(() => {
    if (!trip) return { lat: 37.7749, lng: -122.4194 }; // Default to San Francisco
    
    const points = [
      trip.origin.location,
      ...trip.stops.map(stop => stop.location),
      trip.destination.location
    ];
    
    const latSum = points.reduce((sum, point) => sum + point.lat, 0);
    const lngSum = points.reduce((sum, point) => sum + point.lng, 0);
    
    return {
      lat: latSum / points.length,
      lng: lngSum / points.length
    };
  }, [trip]);

  // Create path for the polyline
  const path = React.useMemo(() => {
    if (!trip) return [];
    
    return [
      trip.origin.location,
      ...trip.stops.map(stop => stop.location),
      trip.destination.location
    ];
  }, [trip]);

  const onLoad = useCallback((map: google.maps.Map) => {
    // Fit bounds to include all points
    const bounds = new google.maps.LatLngBounds();
    path.forEach(point => bounds.extend(point));
    map.fitBounds(bounds);
    
    setMap(map);
  }, [path]);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  if (!isLoaded) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="w-full h-full">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={10}
        onLoad={onLoad}
        onUnmount={onUnmount}
        options={{
          fullscreenControl: false,
          mapTypeControl: false,
          streetViewControl: false,
          zoomControl: true
        }}
      >
        {/* Origin Marker */}
        <Marker
          position={trip.origin.location}
          icon={{
            path: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z',
            fillColor: '#ef4444',
            fillOpacity: 1,
            strokeWeight: 1,
            strokeColor: '#ffffff',
            scale: 2,
            anchor: new google.maps.Point(12, 22),
          }}
          onClick={() => setSelectedMarker('origin')}
        />
        
        {selectedMarker === 'origin' && (
          <InfoWindow
            position={trip.origin.location}
            onCloseClick={() => setSelectedMarker(null)}
          >
            <div className="p-1">
              <p className="font-medium">{trip.origin.name}</p>
              <p className="text-xs text-gray-500">Starting Point</p>
            </div>
          </InfoWindow>
        )}
        
        {/* Stop Markers */}
        {trip.stops.map((stop, index) => (
          <Marker
            key={stop.id}
            position={stop.location}
            label={{
              text: (index + 1).toString(),
              color: '#ffffff',
              fontWeight: 'bold',
            }}
            icon={{
              path: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z',
              fillColor: '#3b82f6',
              fillOpacity: 1,
              strokeWeight: 1,
              strokeColor: '#ffffff',
              scale: 2,
              anchor: new google.maps.Point(12, 22),
            }}
            onClick={() => setSelectedMarker(stop.id)}
          />
        ))}
        
        {selectedMarker && trip.stops.find(stop => stop.id === selectedMarker) && (
          <InfoWindow
            position={trip.stops.find(stop => stop.id === selectedMarker)!.location}
            onCloseClick={() => setSelectedMarker(null)}
          >
            <div className="p-1">
              <p className="font-medium">{trip.stops.find(stop => stop.id === selectedMarker)!.name}</p>
              <p className="text-xs text-gray-500">Stop</p>
            </div>
          </InfoWindow>
        )}
        
        {/* Destination Marker */}
        <Marker
          position={trip.destination.location}
          icon={{
            path: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z',
            fillColor: '#22c55e',
            fillOpacity: 1,
            strokeWeight: 1,
            strokeColor: '#ffffff',
            scale: 2,
            anchor: new google.maps.Point(12, 22),
          }}
          onClick={() => setSelectedMarker('destination')}
        />
        
        {selectedMarker === 'destination' && (
          <InfoWindow
            position={trip.destination.location}
            onCloseClick={() => setSelectedMarker(null)}
          >
            <div className="p-1">
              <p className="font-medium">{trip.destination.name}</p>
              <p className="text-xs text-gray-500">Destination</p>
            </div>
          </InfoWindow>
        )}
        
        {/* Route Polyline */}
        <Polyline
          path={path}
          options={{
            strokeColor: '#3b82f6',
            strokeOpacity: 0.8,
            strokeWeight: 4,
          }}
        />
        
        {/* User Markers (Mock) */}
        {trip.participants.map((participant, index) => (
          <Marker
            key={participant}
            position={{
              lat: path[Math.min(index, path.length - 1)].lat + (Math.random() * 0.01),
              lng: path[Math.min(index, path.length - 1)].lng + (Math.random() * 0.01)
            }}
            icon={{
              url: index === 0 
                ? 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png'
                : 'https://maps.google.com/mapfiles/ms/icons/green-dot.png',
              scaledSize: new google.maps.Size(32, 32)
            }}
          />
        ))}
      </GoogleMap>
    </div>
  );
};

export default GroupMap;