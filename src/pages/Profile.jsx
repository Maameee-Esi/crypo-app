import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import API_BASE from '../lib/api';

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Portfolio state
  const [portfolioTab, setPortfolioTab] = useState('all');
  const [cryptos, setCryptos] = useState([]);
  const [cryptoLoading, setCryptoLoading] = useState(true);
  const [cryptoError, setCryptoError] = useState(null);

  // Add Crypto Form State
  const [cryptoForm, setCryptoForm] = useState({
    name: '', symbol: '', price: '', image: '', priceChange24h: ''
  });
  const [cryptoStatus, setCryptoStatus] = useState({ type: '', message: '' });
  
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`${API_BASE}/users/profile`, {
          withCredentials: true
        });
        if (response.data.success) {
          setUser(response.data.data);
        } else {
          navigate('/signin');
        }
      } catch (err) {
        navigate('/signin');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [navigate]);

  // Fetch portfolio cryptos based on active tab
  useEffect(() => {
    const fetchCryptos = async () => {
      try {
        setCryptoLoading(true);
        setCryptoError(null);

        let url = `${API_BASE}/crypto`;
        if (portfolioTab === 'gainers') url = `${API_BASE}/crypto/gainers`;
        else if (portfolioTab === 'new') url = `${API_BASE}/crypto/new`;

        const response = await axios.get(url);
        if (response.data.success) {
          setCryptos(response.data.data);
        } else {
          setCryptoError('Failed to load portfolio data');
        }
      } catch (err) {
        console.error('Error fetching cryptos:', err);
        setCryptoError('Failed to load portfolio data. Make sure the backend is running.');
      } finally {
        setCryptoLoading(false);
      }
    };
    fetchCryptos();
  }, [portfolioTab]);

  const handleLogout = async () => {
    try {
      await axios.post(`${API_BASE}/auth/logout`, {}, { withCredentials: true });
      navigate('/signin');
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddCrypto = async (e) => {
    e.preventDefault();
    setCryptoStatus({ type: '', message: '' });
    try {
      const payload = {
        ...cryptoForm,
        price: Number(cryptoForm.price),
        priceChange24h: Number(cryptoForm.priceChange24h)
      };
      const res = await axios.post(`${API_BASE}/crypto`, payload, { withCredentials: true });
      if (res.data.success) {
        setCryptoStatus({ type: 'success', message: 'Cryptocurrency added successfully!' });
        setCryptoForm({ name: '', symbol: '', price: '', image: '', priceChange24h: '' });
        // Refresh portfolio list
        const refreshRes = await axios.get(`${API_BASE}/crypto`);
        if (refreshRes.data.success) setCryptos(refreshRes.data.data);
      }
    } catch (err) {
      setCryptoStatus({ type: 'error', message: err.response?.data?.error || 'Failed to add cryptocurrency' });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '40px', height: '40px', border: '4px solid #e5e7eb',
            borderTopColor: '#2563eb', borderRadius: '50%',
            animation: 'spin 0.8s linear infinite'
          }} />
          <p style={{ color: '#6b7280', fontSize: '14px' }}>Loading profile...</p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const portfolioTabs = [
    { key: 'all', label: 'All Assets' },
    { key: 'gainers', label: 'Top Gainers' },
    { key: 'new', label: 'New Listings' }
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f0f4ff 0%, #f9fafb 50%, #f0fdf4 100%)' }}>
      {/* Top Nav Bar */}
      <nav style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '16px 24px', background: 'white', borderBottom: '1px solid #e5e7eb',
        position: 'sticky', top: 0, zIndex: 50
      }}>
        <Link to="/" style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          textDecoration: 'none', color: '#1f2937', fontWeight: 700, fontSize: '18px'
        }}>
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <circle cx="14" cy="14" r="14" fill="#0052FF"/>
            <path d="M14 6C9.58 6 6 9.58 6 14s3.58 8 8 8 8-3.58 8-8-3.58-8-8-8zm-1.5 11.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5c1.25 0 2.35.66 2.97 1.65l-1.27.74c-.37-.6-1.02-1-1.7-1-1.1 0-2 .9-2 2s.9 2 2 2c.68 0 1.33-.4 1.7-1l1.27.74c-.62.99-1.72 1.65-2.97 1.65z" fill="white"/>
          </svg>
          <span>Crypto App</span>
        </Link>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <Link to="/explore" style={{
            textDecoration: 'none', color: '#4b5563', fontSize: '14px', fontWeight: 500,
            padding: '8px 16px', borderRadius: '8px', transition: 'all 0.2s'
          }}>Explore</Link>
          <button onClick={handleLogout} style={{
            background: '#ef4444', color: 'white', border: 'none', padding: '8px 20px',
            borderRadius: '8px', fontWeight: 600, fontSize: '14px', cursor: 'pointer',
            transition: 'all 0.2s'
          }}>Log Out</button>
        </div>
      </nav>

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '32px 16px' }}>
        {/* Profile Header Card */}
        <div style={{
          background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 50%, #3b82f6 100%)',
          borderRadius: '20px', padding: '32px', marginBottom: '24px',
          color: 'white', position: 'relative', overflow: 'hidden',
          boxShadow: '0 20px 60px rgba(37, 99, 235, 0.3)'
        }}>
          {/* Decorative circles */}
          <div style={{
            position: 'absolute', top: '-30px', right: '-30px', width: '120px', height: '120px',
            borderRadius: '50%', background: 'rgba(255,255,255,0.1)'
          }} />
          <div style={{
            position: 'absolute', bottom: '-20px', left: '40%', width: '80px', height: '80px',
            borderRadius: '50%', background: 'rgba(255,255,255,0.05)'
          }} />
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', position: 'relative', zIndex: 1 }}>
            <div style={{
              width: '64px', height: '64px', borderRadius: '50%',
              background: 'rgba(255,255,255,0.2)', display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              fontSize: '24px', fontWeight: 700, backdropFilter: 'blur(10px)',
              border: '2px solid rgba(255,255,255,0.3)'
            }}>
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 style={{ fontSize: '24px', fontWeight: 700, margin: 0 }}>{user.name}</h1>
              <p style={{ margin: '4px 0 0 0', opacity: 0.8, fontSize: '14px' }}>{user.email}</p>
              <p style={{ margin: '4px 0 0 0', opacity: 0.6, fontSize: '12px' }}>
                Member since {new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
          </div>
        </div>

        {/* Portfolio Section */}
        <div style={{
          background: 'white', borderRadius: '16px', overflow: 'hidden',
          boxShadow: '0 4px 24px rgba(0,0,0,0.06)', marginBottom: '24px'
        }}>
          <div style={{
            padding: '24px 24px 0', borderBottom: '1px solid #f3f4f6'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 700, color: '#111827' }}>
                📊 My Portfolio
              </h2>
              <span style={{
                background: '#eff6ff', color: '#2563eb', padding: '4px 12px',
                borderRadius: '20px', fontSize: '12px', fontWeight: 600
              }}>
                {cryptos.length} Assets
              </span>
            </div>

            {/* Portfolio Tabs */}
            <div style={{ display: 'flex', gap: '4px' }}>
              {portfolioTabs.map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setPortfolioTab(tab.key)}
                  style={{
                    padding: '10px 20px', border: 'none', cursor: 'pointer',
                    fontSize: '13px', fontWeight: 600, borderRadius: '8px 8px 0 0',
                    transition: 'all 0.2s',
                    background: portfolioTab === tab.key ? '#2563eb' : 'transparent',
                    color: portfolioTab === tab.key ? 'white' : '#6b7280'
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Crypto List */}
          <div style={{ padding: '0' }}>
            {cryptoLoading && (
              <div style={{ padding: '40px', textAlign: 'center', color: '#9ca3af' }}>
                <div style={{
                  width: '32px', height: '32px', border: '3px solid #e5e7eb',
                  borderTopColor: '#2563eb', borderRadius: '50%',
                  animation: 'spin 0.8s linear infinite', margin: '0 auto 12px'
                }} />
                Loading portfolio...
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
              </div>
            )}
            {cryptoError && (
              <div style={{
                padding: '24px', margin: '16px', background: '#fef2f2',
                borderRadius: '12px', color: '#dc2626', fontSize: '14px',
                display: 'flex', alignItems: 'center', gap: '8px'
              }}>
                ⚠️ {cryptoError}
              </div>
            )}
            {!cryptoLoading && !cryptoError && cryptos.length === 0 && (
              <div style={{ padding: '40px', textAlign: 'center', color: '#9ca3af' }}>
                <p style={{ fontSize: '32px', margin: '0 0 8px' }}>📭</p>
                <p style={{ fontWeight: 600 }}>No assets found</p>
                <p style={{ fontSize: '13px' }}>Add your first cryptocurrency below!</p>
              </div>
            )}
            {!cryptoLoading && !cryptoError && cryptos.length > 0 && (
              <div>
                {/* Table Header */}
                <div style={{
                  display: 'grid', gridTemplateColumns: '2fr 1fr 1fr',
                  padding: '12px 24px', background: '#f9fafb',
                  fontSize: '11px', fontWeight: 600, color: '#9ca3af',
                  textTransform: 'uppercase', letterSpacing: '0.05em'
                }}>
                  <span>Asset</span>
                  <span style={{ textAlign: 'right' }}>Price</span>
                  <span style={{ textAlign: 'right' }}>24h Change</span>
                </div>
                {cryptos.map((crypto, index) => (
                  <div
                    key={crypto._id}
                    style={{
                      display: 'grid', gridTemplateColumns: '2fr 1fr 1fr',
                      padding: '16px 24px', alignItems: 'center',
                      borderBottom: index < cryptos.length - 1 ? '1px solid #f3f4f6' : 'none',
                      transition: 'background 0.15s',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = '#f9fafb'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <img
                        src={crypto.image}
                        alt={crypto.name}
                        style={{
                          width: '36px', height: '36px', borderRadius: '50%',
                          objectFit: 'cover', background: '#f3f4f6'
                        }}
                        onError={e => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                      <div style={{
                        width: '36px', height: '36px', borderRadius: '50%',
                        background: '#e5e7eb', display: 'none', alignItems: 'center',
                        justifyContent: 'center', fontSize: '14px', fontWeight: 700,
                        color: '#6b7280'
                      }}>
                        {crypto.symbol.charAt(0)}
                      </div>
                      <div>
                        <p style={{ margin: 0, fontWeight: 600, fontSize: '14px', color: '#111827' }}>
                          {crypto.name}
                        </p>
                        <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#9ca3af' }}>
                          {crypto.symbol.toUpperCase()}
                        </p>
                      </div>
                    </div>
                    <p style={{
                      margin: 0, textAlign: 'right', fontWeight: 600,
                      fontSize: '14px', color: '#111827'
                    }}>
                      ${crypto.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 })}
                    </p>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{
                        display: 'inline-flex', alignItems: 'center', gap: '4px',
                        padding: '4px 10px', borderRadius: '20px', fontSize: '13px', fontWeight: 600,
                        background: crypto.priceChange24h >= 0 ? '#f0fdf4' : '#fef2f2',
                        color: crypto.priceChange24h >= 0 ? '#16a34a' : '#dc2626'
                      }}>
                        {crypto.priceChange24h >= 0 ? '▲' : '▼'}
                        {Math.abs(crypto.priceChange24h).toFixed(2)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Add Cryptocurrency Form */}
        <div style={{
          background: 'white', borderRadius: '16px', padding: '24px',
          boxShadow: '0 4px 24px rgba(0,0,0,0.06)'
        }}>
          <h3 style={{ margin: '0 0 20px', fontSize: '18px', fontWeight: 700, color: '#111827' }}>
            ➕ Add New Cryptocurrency
          </h3>
          {cryptoStatus.message && (
            <div style={{
              padding: '12px 16px', marginBottom: '16px', borderRadius: '10px', fontSize: '14px',
              background: cryptoStatus.type === 'success' ? '#f0fdf4' : '#fef2f2',
              color: cryptoStatus.type === 'success' ? '#16a34a' : '#dc2626',
              border: `1px solid ${cryptoStatus.type === 'success' ? '#bbf7d0' : '#fecaca'}`
            }}>
              {cryptoStatus.type === 'success' ? '✅' : '❌'} {cryptoStatus.message}
            </div>
          )}
          <form onSubmit={handleAddCrypto}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>Name</label>
                <input type="text" required value={cryptoForm.name} onChange={e => setCryptoForm({...cryptoForm, name: e.target.value})}
                  placeholder="e.g. Bitcoin"
                  style={{
                    width: '100%', padding: '10px 14px', border: '1.5px solid #e5e7eb',
                    borderRadius: '10px', fontSize: '14px', outline: 'none',
                    transition: 'border-color 0.2s', boxSizing: 'border-box'
                  }}
                  onFocus={e => e.target.style.borderColor = '#2563eb'}
                  onBlur={e => e.target.style.borderColor = '#e5e7eb'}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>Symbol</label>
                <input type="text" required value={cryptoForm.symbol} onChange={e => setCryptoForm({...cryptoForm, symbol: e.target.value})}
                  placeholder="e.g. BTC"
                  style={{
                    width: '100%', padding: '10px 14px', border: '1.5px solid #e5e7eb',
                    borderRadius: '10px', fontSize: '14px', outline: 'none',
                    transition: 'border-color 0.2s', boxSizing: 'border-box'
                  }}
                  onFocus={e => e.target.style.borderColor = '#2563eb'}
                  onBlur={e => e.target.style.borderColor = '#e5e7eb'}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>Price (USD)</label>
                <input type="number" step="any" required value={cryptoForm.price} onChange={e => setCryptoForm({...cryptoForm, price: e.target.value})}
                  placeholder="e.g. 60000"
                  style={{
                    width: '100%', padding: '10px 14px', border: '1.5px solid #e5e7eb',
                    borderRadius: '10px', fontSize: '14px', outline: 'none',
                    transition: 'border-color 0.2s', boxSizing: 'border-box'
                  }}
                  onFocus={e => e.target.style.borderColor = '#2563eb'}
                  onBlur={e => e.target.style.borderColor = '#e5e7eb'}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>24h Change (%)</label>
                <input type="number" step="any" required value={cryptoForm.priceChange24h} onChange={e => setCryptoForm({...cryptoForm, priceChange24h: e.target.value})}
                  placeholder="e.g. 2.5"
                  style={{
                    width: '100%', padding: '10px 14px', border: '1.5px solid #e5e7eb',
                    borderRadius: '10px', fontSize: '14px', outline: 'none',
                    transition: 'border-color 0.2s', boxSizing: 'border-box'
                  }}
                  onFocus={e => e.target.style.borderColor = '#2563eb'}
                  onBlur={e => e.target.style.borderColor = '#e5e7eb'}
                />
              </div>
              <div style={{ gridColumn: 'span 2' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>Image URL</label>
                <input type="url" required value={cryptoForm.image} onChange={e => setCryptoForm({...cryptoForm, image: e.target.value})}
                  placeholder="https://..."
                  style={{
                    width: '100%', padding: '10px 14px', border: '1.5px solid #e5e7eb',
                    borderRadius: '10px', fontSize: '14px', outline: 'none',
                    transition: 'border-color 0.2s', boxSizing: 'border-box'
                  }}
                  onFocus={e => e.target.style.borderColor = '#2563eb'}
                  onBlur={e => e.target.style.borderColor = '#e5e7eb'}
                />
              </div>
            </div>
            <button type="submit" style={{
              width: '100%', marginTop: '20px', padding: '12px',
              background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
              color: 'white', border: 'none', borderRadius: '10px',
              fontWeight: 700, fontSize: '15px', cursor: 'pointer',
              transition: 'all 0.2s', boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)'
            }}
              onMouseEnter={e => e.target.style.transform = 'translateY(-1px)'}
              onMouseLeave={e => e.target.style.transform = 'translateY(0)'}
            >
              Add Cryptocurrency
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
