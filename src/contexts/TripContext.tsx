import React, { createContext, useContext, useState, ReactNode } from 'react';

// Mock trip types
export interface Stop {
  id: string;
  name: string;
  location: {
    lat: number;
    lng: number;
  };
}

export interface Trip {
  id: string;
  name: string;
  origin: {
    name: string;
    location: {
      lat: number;
      lng: number;
    };
  };
  destination: {
    name: string;
    location: {
      lat: number;
      lng: number;
    };
  };
  stops: Stop[];
  participants: string[];
  createdBy: string;
  createdAt: string;
  imageUrl: string; // Added imageUrl field
}

interface TripContextType {
  trips: Trip[];
  currentTrip: Trip | null;
  createTrip: (tripData: Omit<Trip, 'id' | 'createdAt'>) => Promise<string>;
  joinTrip: (inviteCode: string) => Promise<boolean>;
  addStop: (tripId: string, stop: Omit<Stop, 'id'>) => Promise<boolean>;
  setCurrentTrip: (trip: Trip | null) => void;
}

const TripContext = createContext<TripContextType | undefined>(undefined);

export function useTrip() {
  const context = useContext(TripContext);
  if (context === undefined) {
    throw new Error('useTrip must be used within a TripProvider');
  }
  return context;
}

// Sample mock data with real photos
const mockTrips: Trip[] = [
  {
    id: 'trip1',
    name: 'Pacific Coast Highway',
    origin: {
      name: 'San Francisco, CA',
      location: { lat: 37.7749, lng: -122.4194 }
    },
    destination: {
      name: 'Los Angeles, CA',
      location: { lat: 34.0522, lng: -118.2437 }
    },
    stops: [
      {
        id: 'stop1',
        name: 'Monterey Bay Aquarium',
        location: { lat: 36.6182, lng: -121.9019 }
      },
      {
        id: 'stop2',
        name: 'Big Sur',
        location: { lat: 36.2704, lng: -121.8081 }
      }
    ],
    participants: ['user123', 'user456'],
    createdBy: 'user123',
    createdAt: new Date().toISOString(),
    imageUrl: 'https://images.pexels.com/photos/13291360/pexels-photo-13291360.jpeg'
  },
  {
    id: 'trip2',
    name: 'East Coast Tour',
    origin: {
      name: 'Boston, MA',
      location: { lat: 42.3601, lng: -71.0589 }
    },
    destination: {
      name: 'New York, NY',
      location: { lat: 40.7128, lng: -74.0060 }
    },
    stops: [
      {
        id: 'stop3',
        name: 'Providence, RI',
        location: { lat: 41.8240, lng: -71.4128 }
      }
    ],
    participants: ['user123'],
    createdBy: 'user123',
    createdAt: new Date().toISOString(),
    imageUrl: 'https://images.pexels.com/photos/2190283/pexels-photo-2190283.jpeg'
  },
  {
    id: 'trip3',
    name: 'Rocky Mountain Adventure',
    origin: {
      name: 'Denver, CO',
      location: { lat: 39.7392, lng: -104.9903 }
    },
    destination: {
      name: 'Yellowstone, WY',
      location: { lat: 44.4280, lng: -110.5885 }
    },
    stops: [],
    participants: ['user123'],
    createdBy: 'user123',
    createdAt: new Date().toISOString(),
    imageUrl: 'https://images.pexels.com/photos/1834399/pexels-photo-1834399.jpeg'
  }
];

interface TripProviderProps {
  children: ReactNode;
}

export function TripProvider({ children }: TripProviderProps) {
  const [trips, setTrips] = useState<Trip[]>(mockTrips);
  const [currentTrip, setCurrentTrip] = useState<Trip | null>(null);

  const createTrip = async (tripData: Omit<Trip, 'id' | 'createdAt'>): Promise<string> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newTrip: Trip = {
      ...tripData,
      id: `trip${trips.length + 1}`,
      createdAt: new Date().toISOString(),
      imageUrl: 'https://images.pexels.com/photos/3935702/pexels-photo-3935702.jpeg'
    };
    
    setTrips(prevTrips => [...prevTrips, newTrip]);
    return newTrip.id;
  };

  const joinTrip = async (inviteCode: string): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const tripToJoin = trips.find(trip => trip.id === inviteCode);
    
    if (tripToJoin) {
      setCurrentTrip(tripToJoin);
      return true;
    }
    
    return false;
  };

  const addStop = async (tripId: string, stopData: Omit<Stop, 'id'>): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newStop: Stop = {
      ...stopData,
      id: `stop${Math.random().toString(36).substr(2, 9)}`
    };
    
    setTrips(prevTrips => 
      prevTrips.map(trip => 
        trip.id === tripId 
          ? { ...trip, stops: [...trip.stops, newStop] } 
          : trip
      )
    );
    
    if (currentTrip && currentTrip.id === tripId) {
      setCurrentTrip({
        ...currentTrip,
        stops: [...currentTrip.stops, newStop]
      });
    }
    
    return true;
  };

  const value = {
    trips,
    currentTrip,
    createTrip,
    joinTrip,
    addStop,
    setCurrentTrip
  };

  return (
    <TripContext.Provider value={value}>
      {children}
    </TripContext.Provider>
  );
}