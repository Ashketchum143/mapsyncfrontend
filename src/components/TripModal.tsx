import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTrip } from '../contexts/TripContext';
import { useAuth } from '../contexts/AuthContext';
import { X, Plus, MapPin } from 'lucide-react';

interface TripModalProps {
  onClose: () => void;
}

interface PlaceSuggestion {
  description: string;
  place_id: string;
}

const TripModal: React.FC<TripModalProps> = ({ onClose }) => {
  const { createTrip } = useTrip();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  const [tripName, setTripName] = useState('');
  const [destination, setDestination] = useState('');
  const [stops, setStops] = useState<string[]>([]);
  const [newStop, setNewStop] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [suggestions, setSuggestions] = useState<PlaceSuggestion[]>([]);
  const [currentLocation, setCurrentLocation] = useState<{lat: number, lng: number} | null>(null);

  useEffect(() => {
    // Get current location when component mounts
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error('Error getting location:', error);
          setError('Unable to get your current location. Please enable location services.');
        }
      );
    }
  }, []);

  // Mock function to simulate getting place suggestions
  const getPlaceSuggestions = async (input: string) => {
    if (!input.trim()) {
      setSuggestions([]);
      return;
    }
    
    // In a real app, this would call the Google Places API
    // For now, we'll simulate some suggestions
    const mockSuggestions = [
      { description: `${input}, New York, USA`, place_id: '1' },
      { description: `${input}, California, USA`, place_id: '2' },
      { description: `${input}, Texas, USA`, place_id: '3' },
    ];
    
    setSuggestions(mockSuggestions);
  };

  const handleDestinationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setDestination(value);
    getPlaceSuggestions(value);
  };

  const handleSuggestionClick = (suggestion: PlaceSuggestion) => {
    setDestination(suggestion.description);
    setSuggestions([]);
  };

  const handleAddStop = () => {
    if (newStop.trim()) {
      setStops([...stops, newStop.trim()]);
      setNewStop('');
    }
  };

  const handleRemoveStop = (index: number) => {
    setStops(stops.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!tripName || !destination || !currentLocation) {
      setError('Please fill in all required fields and ensure location services are enabled');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      // In a real app, we would use Google Maps API to get coordinates
      // Here we're using mock coordinates for destination
      const mockCoordinates = (place: string) => ({
        lat: 37.7749 + Math.random() * 5,
        lng: -122.4194 + Math.random() * 5
      });
      
      const stopsData = stops.map((stop, index) => ({
        id: `stop${index}`,
        name: stop,
        location: mockCoordinates(stop)
      }));
      
      const tripData = {
        name: tripName,
        origin: {
          name: 'Current Location',
          location: currentLocation
        },
        destination: {
          name: destination,
          location: mockCoordinates(destination)
        },
        stops: stopsData,
        participants: [currentUser?.uid || 'user123'],
        createdBy: currentUser?.uid || 'user123'
      };
      
      const tripId = await createTrip(tripData);
      onClose();
      navigate(`/trip/${tripId}`);
    } catch (err) {
      setError('Failed to create trip. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-800">Start a New Trip</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg">
              {error}
            </div>
          )}
          
          <div className="mb-6">
            <label htmlFor="tripName" className="block text-sm font-medium text-gray-700 mb-1">
              Trip Name
            </label>
            <input
              type="text"
              id="tripName"
              value={tripName}
              onChange={(e) => setTripName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-black focus:border-black"
              placeholder="e.g., Summer Road Trip 2025"
              required
            />
          </div>
          
          <div className="mb-6">
            <label htmlFor="destination" className="block text-sm font-medium text-gray-700 mb-1">
              Destination
            </label>
            <div className="relative">
              <input
                type="text"
                id="destination"
                value={destination}
                onChange={handleDestinationChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-black focus:border-black"
                placeholder="e.g., Los Angeles, CA"
                required
              />
              {suggestions.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
                  {suggestions.map((suggestion) => (
                    <button
                      key={suggestion.place_id}
                      type="button"
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="w-full px-4 py-2 text-left hover:bg-gray-100 focus:outline-none focus:bg-gray-100"
                    >
                      {suggestion.description}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Stops (Optional)
            </label>
            
            <div className="space-y-3 mb-3">
              {stops.map((stop, index) => (
                <div key={index} className="flex items-center bg-gray-50 p-3 rounded-lg">
                  <MapPin className="h-5 w-5 text-red-500 mr-2" />
                  <span className="flex-grow text-gray-800">{stop}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveStop(index)}
                    className="text-gray-400 hover:text-red-500"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              ))}
            </div>
            
            <div className="flex">
              <input
                type="text"
                value={newStop}
                onChange={(e) => setNewStop(e.target.value)}
                className="flex-grow px-4 py-2 border border-gray-300 rounded-l-lg focus:ring-black focus:border-black"
                placeholder="Add a stop"
              />
              <button
                type="button"
                onClick={handleAddStop}
                className="px-4 py-2 bg-black text-white rounded-r-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black"
              >
                <Plus className="h-5 w-5" />
              </button>
            </div>
          </div>
          
          <div className="flex justify-end space-x-4 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className={`px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black ${
                isLoading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? 'Creating...' : 'Create Trip'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TripModal;
