import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { MapPin, Map, Users, Car } from 'lucide-react';

const LandingPage: React.FC = () => {
  const { login, currentUser } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async () => {
    await login();
    navigate('/home');
  };

  React.useEffect(() => {
    if (currentUser) {
      navigate('/home');
    }
  }, [currentUser, navigate]);

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-10 md:mb-0">
            <div className="flex items-center mb-6">
              <Map className="h-10 w-10 text-black mr-3" />
              <h1 className="text-4xl md:text-5xl font-bold text-black">MapSync</h1>
            </div>
            <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-6">
              Plan road trips and sync your route in real-time
            </h2>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Plan road trips and sync your route in real-time across multiple cars — using Google Maps.
              Never lose track of your travel companions again.
            </p>
            <button
              onClick={handleLogin}
              className="flex items-center px-6 py-3 bg-black text-white font-medium rounded-lg hover:bg-gray-900 transition duration-300"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"
                />
              </svg>
              Login with Google
            </button>
          </div>
          <div className="md:w-1/2 md:pl-10">
            <div className="relative">
              <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
                <div className="bg-black h-16 flex items-center px-6">
                  <Map className="h-6 w-6 text-white mr-2" />
                  <span className="text-white font-semibold">MapSync Route</span>
                </div>
                <div className="p-4">
                  <div className="bg-gray-50 rounded-lg h-64 relative overflow-hidden">
                    <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('https://images.pexels.com/photos/1252500/pexels-photo-1252500.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')" }}></div>
                    <div className="absolute inset-0 bg-black bg-opacity-10"></div>
                    <div className="absolute bottom-4 left-4 right-4 bg-white rounded-lg p-3 shadow-lg">
                      <div className="flex items-center mb-2">
                        <MapPin className="h-4 w-4 text-black mr-2" />
                        <span className="text-sm font-medium">San Francisco → Los Angeles</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Car className="h-4 w-4 text-gray-600 mr-2" />
                          <span className="text-xs text-gray-600">3 stops</span>
                        </div>
                        <div className="flex items-center">
                          <Users className="h-4 w-4 text-gray-600 mr-2" />
                          <span className="text-xs text-gray-600">4 travelers</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-black rounded-full flex items-center justify-center shadow-lg transform rotate-12 z-0">
                <span className="font-bold text-white text-lg">LIVE</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-black">Why Choose MapSync?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="bg-gray-50 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <Map className="h-6 w-6 text-black" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-black">Real-time Syncing</h3>
              <p className="text-gray-600">Keep everyone on the same page with live route updates across all devices.</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="bg-gray-50 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-black" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-black">Group Planning</h3>
              <p className="text-gray-600">Collaborate on trip planning with friends and family in real-time.</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="bg-gray-50 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <Car className="h-6 w-6 text-black" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-black">Multi-Vehicle Support</h3>
              <p className="text-gray-600">Perfect for road trips with multiple cars traveling together.</p>
            </div>
          </div>
        </div>
      </div>

      <footer className="bg-black text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <Map className="h-6 w-6 text-white mr-2" />
              <span className="text-xl font-semibold">MapSync</span>
            </div>
            <div className="text-gray-400 text-sm">
              © {new Date().getFullYear()} MapSync. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;