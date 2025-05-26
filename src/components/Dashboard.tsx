import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTrip } from '../contexts/TripContext';
import { Map, LogOut, Plus, Users, Calendar, MapPin } from 'lucide-react';
import TripModal from './TripModal';
import JoinTripForm from './JoinTripForm';

const Dashboard: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const { trips, setCurrentTrip } = useTrip();
  const navigate = useNavigate();
  
  const [showTripModal, setShowTripModal] = useState(false);
  const [showJoinForm, setShowJoinForm] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const handleTripSelect = (trip: any) => {
    setCurrentTrip(trip);
    navigate(`/trip/${trip.id}`);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  return (
    <div className="min-h-screen bg-[#f8f8f8]">
      <header className="bg-black">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Map className="h-8 w-8 text-white mr-2" />
              <h1 className="text-2xl font-bold text-white">MapSync</h1>
            </div>
            
            <div className="relative">
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="flex items-center space-x-3 focus:outline-none"
              >
                <span className="text-white hidden md:block">
                  {currentUser?.displayName || 'User'}
                </span>
                <img 
                  src={currentUser?.photoURL || 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'} 
                  alt="Profile" 
                  className="w-10 h-10 rounded-full object-cover border-2 border-white/10"
                />
              </button>
              
              {isMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-10">
                  <button 
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <button
            onClick={() => setShowTripModal(true)}
            className="bg-black text-white p-8 rounded-xl hover:bg-gray-900 transition duration-300"
          >
            <div className="flex items-center mb-4">
              <Plus className="h-6 w-6 mr-2" />
              <h3 className="text-xl font-medium">Start a Trip</h3>
            </div>
            <p className="text-gray-300">Create a new road trip and invite others to join</p>
          </button>
          
          <button
            onClick={() => setShowJoinForm(true)}
            className="bg-white text-black p-8 rounded-xl border border-gray-200 hover:bg-gray-50 transition duration-300"
          >
            <div className="flex items-center mb-4">
              <Users className="h-6 w-6 mr-2" />
              <h3 className="text-xl font-medium">Join a Trip</h3>
            </div>
            <p className="text-gray-600">Enter an invite code to join an existing trip</p>
          </button>
        </div>

        <div>
          <h2 className="text-2xl font-semibold text-black mb-6">Recent Trips</h2>
          
          {trips.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {trips.map(trip => (
                <div 
                  key={trip.id}
                  onClick={() => handleTripSelect(trip)}
                  className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition duration-300 cursor-pointer group"
                >
                  <div className="h-48 relative overflow-hidden">
                    <div 
                      className="absolute inset-0 bg-cover bg-center transform group-hover:scale-105 transition duration-500" 
                      style={{ backgroundImage: `url('${trip.imageUrl}')` }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-white text-xl font-bold mb-2">{trip.name}</h3>
                      <div className="flex items-center text-white/90 text-sm">
                        <MapPin className="h-4 w-4 mr-1" />
                        <span>{trip.origin.name} → {trip.destination.name}</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 border-t border-gray-100">
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span>{formatDate(trip.createdAt)}</span>
                      </div>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        <span>{trip.participants.length} travelers</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
              <div className="bg-gray-50 p-3 rounded-full inline-block mb-4">
                <Map className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-medium text-gray-700 mb-2">No trips yet</h3>
              <p className="text-gray-500">Start a new trip or join an existing one</p>
            </div>
          )}
        </div>
      </main>

      {showTripModal && (
        <TripModal onClose={() => setShowTripModal(false)} />
      )}
      
      {showJoinForm && (
        <JoinTripForm onClose={() => setShowJoinForm(false)} />
      )}
    </div>
  );
};

export default Dashboard;