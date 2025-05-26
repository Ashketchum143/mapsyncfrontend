import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTrip } from '../contexts/TripContext';
import { X, Users } from 'lucide-react';

interface JoinTripFormProps {
  onClose: () => void;
}

const JoinTripForm: React.FC<JoinTripFormProps> = ({ onClose }) => {
  const { joinTrip } = useTrip();
  const navigate = useNavigate();
  
  const [inviteCode, setInviteCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inviteCode.trim()) {
      setError('Please enter an invite code');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      const success = await joinTrip(inviteCode);
      
      if (success) {
        onClose();
        navigate(`/trip/${inviteCode}`);
      } else {
        setError('Invalid invite code. Please check and try again.');
      }
    } catch (err) {
      setError('Failed to join trip. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-800">Join a Trip</h2>
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
              <div className="bg-purple-100 p-4 rounded-full">
                <Users className="h-10 w-10 text-purple-600" />
              </div>
            </div>
            
            <p className="text-center text-gray-600 mb-6">
              Enter the invite code shared with you to join an existing trip
            </p>
            
            <label htmlFor="inviteCode" className="block text-sm font-medium text-gray-700 mb-1">
              Invite Code
            </label>
            <input
              type="text"
              id="inviteCode"
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
              placeholder="e.g., trip123"
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
              className={`px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                isLoading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? 'Joining...' : 'Join Trip'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JoinTripForm;