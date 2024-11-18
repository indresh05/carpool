import React, { useState } from 'react';
import { useWallet } from '@aptos-labs/wallet-adapter-react';
import { Aptos, AptosConfig, Network } from '@aptos-labs/ts-sdk';
import { Car, Calendar, Users, DollarSign, MapPin, LogOut } from 'lucide-react';

const CONTRACT_ADDRESS = "0x82cc89e747697f4a8d44d7e32cb5ad0e0c784d0dddefff16cf74fcff7462c6a6";

const CarpoolingApp = () => {
  const { account, signAndSubmitTransaction, connect, disconnect, connected } = useWallet();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('create'); // 'create' or 'book'
  
  const [rideForm, setRideForm] = useState({
    fromLocation: '',
    toLocation: '',
    departureTime: '',
    availableSeats: '',
    pricePerSeat: ''
  });
  const [rideId, setRideId] = useState('');

  const client = new Aptos(new AptosConfig({ network: Network.DEVNET }));

  const createRide = async (e) => {
    e.preventDefault();
    if (!account) return;
    
    try {
      setLoading(true);
      const payload = {
        function: `${CONTRACT_ADDRESS}::carpooling::create_ride`,
        type_arguments: [],
        arguments: [
          Array.from(new TextEncoder().encode(rideForm.fromLocation)),
          Array.from(new TextEncoder().encode(rideForm.toLocation)),
          Math.floor(new Date(rideForm.departureTime).getTime() / 1000),
          parseInt(rideForm.availableSeats),
          parseInt(rideForm.pricePerSeat)
        ]
      };

      const response = await signAndSubmitTransaction({
        sender: account.address,
        data: payload
      });
      
      await client.waitForTransaction({ transactionHash: response.hash });
      setRideForm({
        fromLocation: '',
        toLocation: '',
        departureTime: '',
        availableSeats: '',
        pricePerSeat: ''
      });
      alert('Ride created successfully!');
      
    } catch (error) {
      console.error('Error creating ride:', error);
      alert('Error creating ride. Check console for details.');
    } finally {
      setLoading(false);
    }
  };

  const bookRide = async (e) => {
    e.preventDefault();
    if (!account) return;
    
    try {
      setLoading(true);
      const payload = {
        function: `${CONTRACT_ADDRESS}::carpooling::book_ride`,
        type_arguments: [],
        arguments: [parseInt(rideId)]
      };

      const response = await signAndSubmitTransaction({
        sender: account.address,
        data: payload
      });
      
      await client.waitForTransaction({ transactionHash: response.hash });
      setRideId('');
      alert('Ride booked successfully!');
      
    } catch (error) {
      console.error('Error booking ride:', error);
      alert('Error booking ride. Check console for details.');
    } finally {
      setLoading(false);
    }
  };

  const completeRide = async (e) => {
    e.preventDefault();
    if (!account) return;
    
    try {
      setLoading(true);
      const payload = {
        function: `${CONTRACT_ADDRESS}::carpooling::complete_ride`,
        type_arguments: [],
        arguments: [parseInt(rideId)]
      };

      const response = await signAndSubmitTransaction({
        sender: account.address,
        data: payload
      });
      
      await client.waitForTransaction({ transactionHash: response.hash });
      setRideId('');
      alert('Ride completed successfully!');
      
    } catch (error) {
      console.error('Error completing ride:', error);
      alert('Error completing ride. Check console for details.');
    } finally {
      setLoading(false);
    }
  };

  if (!connected) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-500 to-purple-600">
        <div className="p-8 bg-white rounded-xl shadow-2xl max-w-md w-full">
          <div className="text-center mb-8">
            <Car size={48} className="mx-auto mb-4 text-blue-500" />
            <h1 className="text-3xl font-bold text-gray-800">Welcome to RideShare</h1>
            <p className="text-gray-600 mt-2">Connect your wallet to start carpooling</p>
          </div>
          <button
            onClick={() => connect("Petra")}
            className="w-full bg-blue-500 text-white p-4 rounded-lg hover:bg-blue-600 transition-all transform hover:scale-105 font-medium flex items-center justify-center gap-2"
          >
            <img src="/api/placeholder/24/24" alt="Petra" className="w-6 h-6 rounded-full" />
            Connect Petra Wallet
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-md">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Car className="text-blue-500" />
              <span className="text-xl font-bold text-gray-800">RideShare</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-gray-100 px-4 py-2 rounded-lg">
                <span className="text-sm text-gray-600">
                  {account?.address?.slice(0, 6)}...{account?.address?.slice(-4)}
                </span>
              </div>
              <button
                onClick={disconnect}
                className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                <LogOut size={18} />
                Disconnect
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="flex border-b">
            <button
              className={`flex-1 px-6 py-4 text-center font-medium ${
                activeTab === 'create'
                  ? 'text-blue-500 border-b-2 border-blue-500'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('create')}
            >
              Create a Ride
            </button>
            <button
              className={`flex-1 px-6 py-4 text-center font-medium ${
                activeTab === 'book'
                  ? 'text-blue-500 border-b-2 border-blue-500'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('book')}
            >
              Book or Complete Ride
            </button>
          </div>

          <div className="p-6">
            {activeTab === 'create' ? (
              <form onSubmit={createRide} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                      <MapPin size={16} />
                      From Location
                    </label>
                    <input
                      type="text"
                      placeholder="Enter pickup location"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={rideForm.fromLocation}
                      onChange={(e) => setRideForm({...rideForm, fromLocation: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                      <MapPin size={16} />
                      To Location
                    </label>
                    <input
                      type="text"
                      placeholder="Enter destination"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={rideForm.toLocation}
                      onChange={(e) => setRideForm({...rideForm, toLocation: e.target.value})}
                    />
                  </div>
                </div>
                
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <Calendar size={16} />
                    Departure Time
                  </label>
                  <input
                    type="datetime-local"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={rideForm.departureTime}
                    onChange={(e) => setRideForm({...rideForm, departureTime: e.target.value})}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                      <Users size={16} />
                      Available Seats
                    </label>
                    <input
                      type="number"
                      placeholder="Number of seats"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={rideForm.availableSeats}
                      onChange={(e) => setRideForm({...rideForm, availableSeats: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                      <DollarSign size={16} />
                      Price per Seat
                    </label>
                    <input
                      type="number"
                      placeholder="Price in APT"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={rideForm.pricePerSeat}
                      onChange={(e) => setRideForm({...rideForm, pricePerSeat: e.target.value})}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-500 text-white p-4 rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Creating...
                    </>
                  ) : (
                    <>
                      <Car size={20} />
                      Create Ride
                    </>
                  )}
                </button>
              </form>
            ) : (
              <div className="space-y-6">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Ride ID
                  </label>
                  <input
                    type="number"
                    placeholder="Enter ride ID"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={rideId}
                    onChange={(e) => setRideId(e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={bookRide}
                    disabled={loading}
                    className="bg-green-500 text-white p-4 rounded-lg hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        Booking...
                      </>
                    ) : (
                      <>
                        <Users size={20} />
                        Book Ride
                      </>
                    )}
                  </button>
                  <button
                    onClick={completeRide}
                    disabled={loading}
                    className="bg-purple-500 text-white p-4 rounded-lg hover:bg-purple-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        Completing...
                      </>
                    ) : (
                      <>
                        <Calendar size={20} />
                        Complete Ride
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarpoolingApp;