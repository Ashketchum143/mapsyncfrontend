import React, { useState } from 'react';
import { useTrip } from '../contexts/TripContext';
import { X, MapPin } from 'lucide-react';

interface AddStopModalProps {
  tripId: string;
  onClose: () => void;
}

const AddStopModal: React.FC<AddStopModalProps> = ({ tripId, onClose }) => {
  const { addStop } = useTrip();
  
  const [stopName, setStopName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!stopName.trim()) {
      setError('Please enter a stop name');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      // In a real app, we would use Google Maps API to get coordinates
      // Here we're using mock coordinates
      const mockCoordinates = {
        lat: 37.7749 + Math.random() * 5,
        lng: -122.4194 + Math.random() * 5
      };
      
      const success = await addStop(tripId, {
        name: stopName,
        location: mockCoordinates
      });
      
      if (success) {
        onClose();
      } else {
        setError('Failed to add stop. Please try again.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-800">Add a Stop</h2>
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
            <div className="flex justify-center mb-6">
              <div className="bg-blue-100 p-4 rounded-full">
                <MapPin className="h-10 w-10 text-blue-600" />
              </div>
            </div>
            
            <p className="text-center text-gray-600 mb-6">
              Add a new stop to your trip route
            </p>
            
            <label htmlFor="stopName" className="block text-sm font-medium text-gray-700 mb-1">
              Stop Name or Address
            </label>
            <input
              type="text"
              id="stopName"
              value={stopName}
              onChange={(e) => setStopName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., Monterey Bay Aquarium"
              required
            />
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
              className={`px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                isLoading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? 'Adding...' : 'Add Stop'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddStopModal;