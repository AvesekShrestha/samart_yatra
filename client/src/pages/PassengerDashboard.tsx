import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useUser } from '../context/UserContext';
import { useApp } from '../context/AppContext';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { busService, tripService } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import './Dashboard.css';

const PassengerDashboard = () => {
  const { user, logout } = useAuth();
  const { 
    walletBalance, 
    userLocation, 
    currentTrip, 
    startTrip, 
    endTrip,
    addFundsToWallet,
    refreshWalletBalance
  } = useUser();
  const { addNotification } = useApp();

  const [destinations, setDestinations] = useState(['Kathmandu', 'Bhaktapur', 'Lalitpur', 'Pokhara']);
  const [selectedDestination, setSelectedDestination] = useState('');
  const [nearbyBuses, setNearbyBuses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddFunds, setShowAddFunds] = useState(false);
  const [fundAmount, setFundAmount] = useState('');
  const [scanning, setScanning] = useState(false);
  const [scanType, setScanType] = useState(null);

  const findNearbyBuses = async () => {
    if (!selectedDestination) {
      addNotification({
        type: 'error',
        message: 'Please select a destination'
      });
      return;
    }

    setLoading(true);
    try {
      const response = await busService.getActiveBuses();
      const buses = response.data.data || [];
      setNearbyBuses(buses);
      
      if (buses.length === 0) {
        addNotification({
          type: 'info',
          message: 'No buses found for this destination'
        });
      }
    } catch (error) {
      addNotification({
        type: 'error',
        message: 'Failed to find buses'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddFunds = async () => {
    const amount = parseFloat(fundAmount);
    if (isNaN(amount) || amount <= 0) {
      addNotification({
        type: 'error',
        message: 'Please enter a valid amount'
      });
      return;
    }

    setLoading(true);
    const result = await addFundsToWallet(amount);
    setLoading(false);

    if (result.success) {
      addNotification({
        type: 'success',
        message: `₹${amount} added to wallet!`
      });
      setShowAddFunds(false);
      setFundAmount('');
    } else {
      addNotification({
        type: 'error',
        message: result.message
      });
    }
  };

  const handleScanQR = (type) => {
    setScanType(type);
    setScanning(true);
    addNotification({
      type: 'info',
      message: 'QR scanner feature coming soon!'
    });
    setTimeout(() => setScanning(false), 2000);
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="container">
          <div className="header-content">
            <div className="header-brand">
              <span className="logo-icon">🚌</span>
              <span className="logo-text">SMART YATRA</span>
            </div>
            <div className="header-actions">
              <div 
                className="wallet-display clickable" 
                onClick={() => setShowAddFunds(true)}
              >
                <span className="wallet-icon">💳</span>
                <span className="wallet-amount">₹ {walletBalance || 0}</span>
                <span className="wallet-add">+</span>
              </div>
              <div className="user-menu">
                <span className="user-name">{user?.name}</span>
                <button onClick={logout} className="btn btn-outline">Logout</button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="dashboard-main">
        <div className="container">
          <div className="dashboard-grid">
            <div className="dashboard-panel">
              <div className="panel-card">
                <h2 className="panel-title">Find Your Bus</h2>
                
                <div className="control-section">
                  <div className="input-group">
                    <label className="input-label">Choose Destination</label>
                    <select
                      className="input-field"
                      value={selectedDestination}
                      onChange={(e) => setSelectedDestination(e.target.value)}
                    >
                      <option value="">Select destination...</option>
                      {destinations.map((dest, index) => (
                        <option key={index} value={dest}>
                          {dest}
                        </option>
                      ))}
                    </select>
                  </div>

                  <button
                    onClick={findNearbyBuses}
                    className="btn btn-secondary btn-full btn-large"
                    disabled={loading || !selectedDestination}
                  >
                    {loading ? <LoadingSpinner size="small" /> : 'Find Bus'}
                  </button>
                </div>

                <div className="scan-section">
                  <h3 className="section-title">Scan QR Code</h3>
                  <div className="scan-buttons">
                    <button
                      onClick={() => handleScanQR('board')}
                      className="btn btn-primary btn-full"
                      disabled={scanning || currentTrip}
                    >
                      📷 Scan to Board
                    </button>
                    <button
                      onClick={() => handleScanQR('exit')}
                      className="btn btn-outline btn-full"
                      disabled={scanning || !currentTrip}
                    >
                      📷 Scan at Destination
                    </button>
                  </div>
                  {currentTrip && (
                    <div className="trip-active-notice">
                      <span className="notice-icon">🚌</span>
                      <span>Trip in progress</span>
                    </div>
                  )}
                </div>

                {nearbyBuses.length > 0 && (
                  <div className="buses-section">
                    <h3 className="section-title">Nearby Buses</h3>
                    <div className="buses-list">
                      {nearbyBuses.map((bus) => (
                        <div key={bus._id} className="bus-card">
                          <div className="bus-info">
                            <span className="bus-number">{bus.vehicleNumber || 'Bus'}</span>
                            <span className="bus-route">{bus.route || 'Unknown route'}</span>
                          </div>
                          <div className="bus-distance">
                            <span className="distance-value">2.5</span>
                            <span className="distance-unit">km away</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="dashboard-map">
              <div className="map-container">
                {userLocation ? (
                  <MapContainer
                    center={[userLocation.lat, userLocation.lng]}
                    zoom={15}
                    style={{ height: '100%', width: '100%' }}
                  >
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution='&copy; OpenStreetMap contributors'
                    />
                    <Marker position={[userLocation.lat, userLocation.lng]}>
                      <Popup>Your Location</Popup>
                    </Marker>
                  </MapContainer>
                ) : (
                  <div className="map-placeholder">
                    <div className="placeholder-content">
                      <span className="placeholder-icon">📍</span>
                      <h3>Location Unavailable</h3>
                      <p>Please enable GPS to find nearby buses</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {showAddFunds && (
        <div className="modal-overlay" onClick={() => setShowAddFunds(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3 className="modal-title">Add Funds to Wallet</h3>
            <div className="input-group">
              <label className="input-label">Amount (₹)</label>
              <input
                type="number"
                className="input-field"
                placeholder="Enter amount"
                value={fundAmount}
                onChange={(e) => setFundAmount(e.target.value)}
              />
            </div>
            <div className="modal-actions">
              <button
                onClick={handleAddFunds}
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? <LoadingSpinner size="small" /> : 'Add Funds'}
              </button>
              <button
                onClick={() => setShowAddFunds(false)}
                className="btn btn-outline"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PassengerDashboard;