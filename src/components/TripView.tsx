import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTrip } from '../contexts/TripContext';
import { useAuth } from '../contexts/AuthContext';
import { Map, ArrowLeft, Plus, Users, Share2, MapPin } from 'lucide-react';
import GroupMap from './GroupMap';
import AddStopModal from './AddStopModal';

const TripView: React.FC = () => {
  const { tripId } = useParams<{ tripId: string }>();
  const { trips, currentTrip, setCurrentTrip } = useTrip();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  const [showAddStopModal, setShowAddStopModal] = useState(false);
  const [isShareMenuOpen, setIsShareMenuOpen] = useState(false);
  
  useEffect(() => {
    if (tripId) {
      const trip = trips.find(t => t.id === tripId);
      if (trip) {
        setCurrentTrip(trip);
      } else {
        // Trip not found, redirect to dashboard
        navigate('/home');
      }
    }
    
    return () => {
      // Clean up when component unmounts
      setCurrentTrip(null);
    };
  }, [tripId, trips, setCurrentTrip, navigate]);

  if (!currentTrip) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const copyInviteCode = () => {
    navigator.clipboard.writeText(currentTrip.id);
    setIsShareMenuOpen(false);
    // Show toast notification (simplified)
    alert('Invite code copied to clipboard!');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <button 
                onClick={() => navigate('/home')}
                className="mr-4 p-2 rounded-full hover:bg-gray-100"
              >
                <ArrowLeft className="h-5 w-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-xl font-bold text-gray-800">{currentTrip.name}</h1>
                <div className="flex items-center text-sm text-gray-500">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>{currentTrip.origin.name} → {currentTrip.destination.name}</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="relative">
                <button
                  onClick={() => setIsShareMenuOpen(!isShareMenuOpen)}
                  className="p-2 rounded-full hover:bg-gray-100"
                >
                  <Share2 className="h-5 w-5 text-gray-600" />
                </button>
                
                {isShareMenuOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg py-1 z-10">
                    <div className="px-4 py-3 border-b">
                      <p className="text-sm font-medium text-gray-700">Share this trip</p>
                      <p className="text-xs text-gray-500">Invite code: {currentTrip.id}</p>
                    </div>
                    <button 
                      onClick={copyInviteCode}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <span>Copy invite code</span>
                    </button>
                  </div>
                )}
              </div>
              
              <div className="flex -space-x-2">
                {currentTrip.participants.map((participant, index) => (
                  <div 
                    key={index}
                    className="w-8 h-8 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center overflow-hidden"
                  >
                    {index === 0 ? (
                      <img 
                        src={currentUser?.photoURL || 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'} 
                        alt="User" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Users className="h-4 w-4 text-gray-600" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex flex-col md:flex-row">
        {/* Map Container */}
        <div className="flex-grow relative">
          <GroupMap trip={currentTrip} />
          
          {/* Floating Action Button */}
          <button
            onClick={() => setShowAddStopModal(true)}
            className="absolute bottom-6 right-6 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition duration-300 z-10"
          >
            <Plus className="h-6 w-6" />
          </button>
        </div>
        
        {/* Side Panel */}
        <div className="w-full md:w-80 bg-white border-t md:border-t-0 md:border-l border-gray-200 overflow-y-auto">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">Trip Details</h2>
          </div>
          
          <div className="p-4">
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Origin</h3>
              <div className="flex items-start">
                <div className="bg-red-100 p-1 rounded-full mr-3 mt-1">
                  <MapPin className="h-4 w-4 text-red-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-800">{currentTrip.origin.name}</p>
                </div>
              </div>
            </div>
            
            {currentTrip.stops.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Stops</h3>
                <div className="space-y-3">
                  {currentTrip.stops.map((stop, index) => (
                    <div key={stop.id} className="flex items-start">
                      <div className="bg-blue-100 p-1 rounded-full mr-3 mt-1">
                        <span className="block h-4 w-4 text-xs font-bold text-blue-600 text-center">
                          {index + 1}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{stop.name}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Destination</h3>
              <div className="flex items-start">
                <div className="bg-green-100 p-1 rounded-full mr-3 mt-1">
                  <MapPin className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-800">{currentTrip.destination.name}</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="p-4 border-t border-gray-200">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Travelers</h3>
            <div className="space-y-3">
              {currentTrip.participants.map((participant, index) => (
                <div key={index} className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-gray-200 mr-3 overflow-hidden">
                    {index === 0 ? (
                      <img 
                        src={currentUser?.photoURL || 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'} 
                        alt="User" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Users className="h-4 w-4 text-gray-600" />
                      </div>
                    )}
                  </div>
                  <p className="text-gray-800">
                    {index === 0 ? (currentUser?.displayName || 'You') : `Traveler ${index + 1}`}
                    {index === 0 && <span className="ml-2 text-xs text-blue-600 font-medium">(You)</span>}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Modals */}
      {showAddStopModal && (
        <AddStopModal 
          tripId={currentTrip.id} 
          onClose={() => setShowAddStopModal(false)} 
        />
      )}
    </div>
  );
};

export default TripView;