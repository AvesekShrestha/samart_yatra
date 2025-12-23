import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useUser } from '../context/UserContext';
import { useApp } from '../context/AppContext';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { tripService, routeService } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import './Dashboard.css';

const DriverDashboard = () => {
  const { user, logout } = useAuth();
  const { walletBalance, userLocation, currentTrip, startTrip, endTrip } = useUser();
  const { addNotification } = useApp();

  const [routes, setRoutes] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState('');
  const [loading, setLoading] = useState(false);
  const [tripActive, setTripActive] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState('');

  useEffect(() => {
    loadRoutes();
    checkCurrentTrip();
  }, []);

  const loadRoutes = async () => {
    try {
      const response = await routeService.getAllRoutes();
      setRoutes(response.data.data || []);
    } catch (error) {
      console.error('Failed to load routes:', error);
    }
  };

  const checkCurrentTrip = async () => {
    try {
      const response = await tripService.getCurrentTrip();
      if (response.data.data?.trip) {
        setTripActive(true);
        generateQRCode(response.data.data.trip._id);
      }
    } catch (error) {
      console.log('No active trip');
    }
  };

  const handleStartTrip = async () => {
    if (!selectedRoute) {
      addNotification({
        type: 'error',
        message: 'Please select a route first'
      });
      return;
    }

    setLoading(true);
    try {
      const response = await tripService.startTrip({
        routeId: selectedRoute,
        startLocation: userLocation
      });

      if (response.data.data?.trip) {
        setTripActive(true);
        startTrip(response.data.data.trip);
        generateQRCode(response.data.data.trip._id);
        addNotification({
          type: 'success',
          message: 'Trip started successfully!'
        });
      }
    } catch (error) {
      addNotification({
        type: 'error',
        message: error.response?.data?.message || 'Failed to start trip'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEndTrip = async () => {
    if (!currentTrip) return;
    
    setLoading(true);
    try {
      await tripService.endTrip(currentTrip._id);
      setTripActive(false);
      endTrip();
      setQrCodeUrl('');
      addNotification({
        type: 'success',
        message: 'Trip ended successfully!'
      });
    } catch (error) {
      addNotification({
        type: 'error',
        message: 'Failed to end trip'
      });
    } finally {
      setLoading(false);
    }
  };

  const generateQRCode = async (tripId) => {
    try {
      const QRCode = await import('qrcode');
      const qrData = JSON.stringify({ tripId, type: 'trip', timestamp: Date.now() });
      QRCode.toDataURL(qrData, (err, url) => {
        if (!err) setQrCodeUrl(url);
      });
    } catch (error) {
      console.error('Failed to generate QR code:', error);
    }
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
              <div className="wallet-display">
                <span className="wallet-icon">💳</span>
                <span className="wallet-amount">₹ {walletBalance || 0}</span>
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
                <h2 className="panel-title">Trip Control</h2>
                
                <div className="control-section">
                  <div className="input-group">
                    <label className="input-label">Select Your Route</label>
                    <select
                      className="input-field"
                      value={selectedRoute}
                      onChange={(e) => setSelectedRoute(e.target.value)}
                      disabled={tripActive}
                    >
                      <option value="">Choose a route...</option>
                      {routes.map((route) => (
                        <option key={route._id} value={route._id}>
                          {route.startLocation} → {route.endLocation}
                        </option>
                      ))}
                    </select>
                  </div>

                  {!tripActive ? (
                    <button
                      onClick={handleStartTrip}
                      className="btn btn-primary btn-full btn-large"
                      disabled={loading || !selectedRoute}
                    >
                      {loading ? <LoadingSpinner size="small" /> : 'Start Trip'}
                    </button>
                  ) : (
                    <button
                      onClick={handleEndTrip}
                      className="btn btn-secondary btn-full btn-large"
                      disabled={loading}
                    >
                      {loading ? <LoadingSpinner size="small" /> : 'End Trip'}
                    </button>
                  )}
                </div>

                {tripActive && qrCodeUrl && (
                  <div className="qr-section">
                    <h3 className="section-title">Passenger Scan Code</h3>
                    <div className="qr-code-display">
                      <img src={qrCodeUrl} alt="QR Code" className="qr-image" />
                    </div>
                    <p className="qr-instruction">
                      Passengers should scan this code when boarding and upon arrival
                    </p>
                  </div>
                )}

                <div className="status-section">
                  <div className="status-item">
                    <span className="status-label">Status</span>
                    <span className={`status-badge ${tripActive ? 'active' : 'inactive'}`}>
                      {tripActive ? '🟢 Active' : '⚫ Inactive'}
                    </span>
                  </div>
                  <div className="status-item">
                    <span className="status-label">Location</span>
                    <span className="status-value">
                      {userLocation ? '📍 GPS Active' : '📍 GPS Inactive'}
                    </span>
                  </div>
                </div>
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
                      <Popup>Your Current Location</Popup>
                    </Marker>
                  </MapContainer>
                ) : (
                  <div className="map-placeholder">
                    <div className="placeholder-content">
                      <span className="placeholder-icon">📍</span>
                      <h3>Location Unavailable</h3>
                      <p>Please enable GPS to see your location</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DriverDashboard;
