import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/footer';
import { cryptoApi } from '../services/api';

const fmtPrice = (val) => (val == null ? '--' : `$ ${val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`);
const fmtPct = (pct) => (pct == null ? '0.00' : Math.abs(pct).toFixed(2));

const ChangeIndicator = ({ value, className = '' }) => {
	if (value == null) return <span className={`text-gray-40 ${className}`}>0.00%</span>;
	const isNeg = value < 0;
	const color = isNeg ? 'text-red-60' : value > 0 ? 'text-green-60' : 'text-gray-60';
	return (
		<span className={`inline-flex items-center gap-0.5 ${color} ${className}`}>
			{isNeg ? <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M9.5 8.5L2.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /><path d="M9.5 3.5V8.5H4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg> : <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2.5 3.5L9.5 8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /><path d="M2.5 8.5V3.5H7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>}
			{fmtPct(value)}%
		</span>
	);
};

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [portfolioTab, setPortfolioTab] = useState('all');
  const [cryptos, setCryptos] = useState([]);
  const [cryptoLoading, setCryptoLoading] = useState(true);
  const [cryptoError, setCryptoError] = useState(null);

  const [cryptoForm, setCryptoForm] = useState({
    name: '', symbol: '', price: '', image: '', priceChange24h: ''
  });
  const [cryptoStatus, setCryptoStatus] = useState({ type: '', message: '' });

  useEffect(() => {
    if (!user) {
      navigate('/signin');
    }
  }, [user, navigate]);

  useEffect(() => {
    const fetchCryptos = async () => {
      try {
        setCryptoLoading(true);
        setCryptoError(null);

        let res;
        if (portfolioTab === 'gainers') res = await cryptoApi.getGainers();
        else if (portfolioTab === 'new') res = await cryptoApi.getNew();
        else res = await cryptoApi.getAll();

        if (res.data) {
          setCryptos(res.data);
        } else {
          setCryptoError('Failed to load portfolio data');
        }
      } catch (err) {
        setCryptoError('Failed to load portfolio data. Make sure the backend is running.');
      } finally {
        setCryptoLoading(false);
      }
    };
    fetchCryptos();
  }, [portfolioTab]);

  const handleLogout = async () => {
    await logout();
    navigate('/signin');
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
      const res = await cryptoApi.add(payload);
      if (res.success || res.data) {
        setCryptoStatus({ type: 'success', message: 'Cryptocurrency added successfully!' });
        setCryptoForm({ name: '', symbol: '', price: '', image: '', priceChange24h: '' });
        const refreshRes = await cryptoApi.getAll();
        if (refreshRes.data) setCryptos(refreshRes.data);
      }
    } catch (err) {
      setCryptoStatus({ type: 'error', message: err.message || 'Failed to add cryptocurrency' });
    }
  };

  const joined = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : '—';

  if (!user) return null;

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-1 flex items-start justify-center py-16 px-4">
        <div className="w-full max-w-[960px]">

          {/* Profile Header */}
          <div className="flex items-center gap-4 mb-8">
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #0052FF 0%, #00A3FF 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                fontSize: '1.5rem',
                fontWeight: 700,
                color: '#fff',
              }}
            >
              {user?.name?.[0]?.toUpperCase() ?? '?'}
            </div>
            <div>
              <h1
                style={{
                  margin: 0,
                  fontSize: '1.5rem',
                  fontWeight: 700,
                  color: '#0A0B0D',
                  lineHeight: 1.2,
                }}
              >
                {user?.name}
              </h1>
              <p style={{ margin: 0, fontSize: '0.9rem', color: '#5B616E', marginTop: 2 }}>
                Member since {joined}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Left side: Account Info & Buttons */}
            <div className="lg:col-span-1 flex flex-col gap-6">
              <div
                style={{
                  background: '#F8F9FA',
                  border: '1px solid #E8EAED',
                  borderRadius: 16,
                  padding: '24px',
                }}
              >
                <h2
                  style={{
                    margin: '0 0 16px',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    color: '#5B616E',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}
                >
                  Account Information
                </h2>

                {[
                  { label: 'Full Name', value: user?.name },
                  { label: 'Email', value: user?.email },
                  { label: 'Account ID', value: user?.id || user?._id },
                ].map((row) => (
                  <div
                    key={row.label}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      padding: '12px 0',
                      borderBottom: '1px solid #E8EAED',
                    }}
                  >
                    <span style={{ fontSize: '0.9rem', color: '#5B616E', fontWeight: 500 }}>
                      {row.label}
                    </span>
                    <span
                      style={{
                        fontSize: '0.9rem',
                        color: '#0A0B0D',
                        fontWeight: 500,
                        wordBreak: 'break-all',
                        marginTop: 4
                      }}
                    >
                      {row.value || '—'}
                    </span>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <button
                  onClick={() => navigate('/explore')}
                  style={{
                    width: '100%',
                    height: 52,
                    borderRadius: 9999,
                    background: '#0052FF',
                    color: '#fff',
                    fontWeight: 600,
                    fontSize: '0.9375rem',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'opacity 0.15s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.88')}
                  onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
                >
                  Explore Crypto
                </button>

                <button
                  onClick={handleLogout}
                  style={{
                    width: '100%',
                    height: 52,
                    borderRadius: 9999,
                    background: '#F8F9FA',
                    border: '1px solid #E8EAED',
                    color: '#0A0B0D',
                    fontWeight: 600,
                    fontSize: '0.9375rem',
                    cursor: 'pointer',
                    transition: 'background 0.15s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = '#E8EAED')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = '#F8F9FA')}
                >
                  Sign Out
                </button>
              </div>
            </div>

            {/* Right side: Portfolio Table & Add Form */}
            <div className="lg:col-span-2">
              <section className="mb-12">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-title-1 text-gray-100">My Portfolio</h2>
                  <span className="bg-gray-5 text-gray-100 px-3 py-1 rounded-full text-label-2 border border-gray-10">
                    {cryptos.length} Assets
                  </span>
                </div>
                
                {/* Tabs */}
                <div className="flex gap-4 border-b border-gray-10 mb-4">
                  {[
                    { key: 'all', label: 'All assets' },
                    { key: 'gainers', label: 'Gainers' },
                    { key: 'new', label: 'New' }
                  ].map(tab => (
                    <button
                      key={tab.key}
                      onClick={() => setPortfolioTab(tab.key)}
                      className={`pb-3 text-label-1 transition-colors relative ${portfolioTab === tab.key ? 'text-blue-60' : 'text-gray-60 hover:text-gray-100'}`}
                    >
                      {tab.label}
                      {portfolioTab === tab.key && (
                        <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-60"></div>
                      )}
                    </button>
                  ))}
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-gray-10">
                        <th className="py-3 px-3 w-10"></th>
                        <th className="py-3 px-3 text-label-2 text-gray-60">Asset</th>
                        <th className="py-3 px-3 text-label-2 text-gray-60 text-right">Market price</th>
                        <th className="py-3 px-3 text-label-2 text-gray-60 text-right">Change</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cryptoLoading && (
                        <tr><td colSpan="4" className="py-8 text-center text-body text-gray-40">Loading...</td></tr>
                      )}
                      {cryptoError && (
                        <tr><td colSpan="4" className="py-8 text-center text-red-60 text-body">{cryptoError}</td></tr>
                      )}
                      {!cryptoLoading && !cryptoError && cryptos.length === 0 && (
                        <tr><td colSpan="4" className="py-12 text-center text-body text-gray-40">No assets found</td></tr>
                      )}
                      {!cryptoLoading && !cryptoError && cryptos.map((coin) => (
                        <tr key={coin._id} className="border-b border-gray-10 hover:bg-gray-5 transition-colors cursor-pointer">
                          <td className="py-4 px-3">
                            <button className="text-gray-20 hover:text-yellow-30 transition-colors">
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                            </button>
                          </td>
                          <td className="py-4 px-3">
                            <div className="flex items-center gap-3">
                              <img src={coin.image} alt={coin.symbol} className="w-8 h-8 rounded-full bg-gray-10" onError={(e) => { e.currentTarget.src = `https://placehold.co/32x32/e5e7eb/666?text=${coin.symbol.slice(0, 2)}`; }} />
                              <div>
                                <p className="text-headline text-gray-100">{coin.name}</p>
                                <p className="text-label-2 text-gray-40 uppercase">{coin.symbol}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-3 text-body text-gray-100 text-right">{fmtPrice(coin.price)}</td>
                          <td className="py-4 px-3 text-right"><ChangeIndicator value={coin.priceChange24h} className="text-body" /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              {/* Add Crypto Section */}
              <section>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-title-1 text-gray-100">Add Asset</h2>
                </div>
                <div className="bg-gray-5 border border-gray-10 rounded-2xl p-6">
                  {cryptoStatus.message && (
                    <div className={`p-3 mb-6 rounded-lg text-label-2 ${cryptoStatus.type === 'success' ? 'bg-green-60/10 text-green-60' : 'bg-red-60/10 text-red-60'}`}>
                      {cryptoStatus.message}
                    </div>
                  )}
                  <form onSubmit={handleAddCrypto} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-label-2 text-gray-100 mb-1">Name</label>
                      <input type="text" required value={cryptoForm.name} onChange={e => setCryptoForm({...cryptoForm, name: e.target.value})} placeholder="e.g. Bitcoin" className="w-full px-4 py-3 rounded-lg border border-gray-20 bg-white text-body text-gray-100 outline-none focus:border-blue-60 transition-colors" />
                    </div>
                    <div>
                      <label className="block text-label-2 text-gray-100 mb-1">Symbol</label>
                      <input type="text" required value={cryptoForm.symbol} onChange={e => setCryptoForm({...cryptoForm, symbol: e.target.value})} placeholder="e.g. BTC" className="w-full px-4 py-3 rounded-lg border border-gray-20 bg-white text-body text-gray-100 outline-none focus:border-blue-60 transition-colors" />
                    </div>
                    <div>
                      <label className="block text-label-2 text-gray-100 mb-1">Price (USD)</label>
                      <input type="number" step="any" required value={cryptoForm.price} onChange={e => setCryptoForm({...cryptoForm, price: e.target.value})} placeholder="e.g. 60000" className="w-full px-4 py-3 rounded-lg border border-gray-20 bg-white text-body text-gray-100 outline-none focus:border-blue-60 transition-colors" />
                    </div>
                    <div>
                      <label className="block text-label-2 text-gray-100 mb-1">24h Change (%)</label>
                      <input type="number" step="any" required value={cryptoForm.priceChange24h} onChange={e => setCryptoForm({...cryptoForm, priceChange24h: e.target.value})} placeholder="e.g. 2.5" className="w-full px-4 py-3 rounded-lg border border-gray-20 bg-white text-body text-gray-100 outline-none focus:border-blue-60 transition-colors" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-label-2 text-gray-100 mb-1">Image URL</label>
                      <input type="url" required value={cryptoForm.image} onChange={e => setCryptoForm({...cryptoForm, image: e.target.value})} placeholder="https://..." className="w-full px-4 py-3 rounded-lg border border-gray-20 bg-white text-body text-gray-100 outline-none focus:border-blue-60 transition-colors" />
                    </div>
                    <button type="submit" className="md:col-span-2 mt-2 w-full h-[52px] rounded-full bg-blue-60 text-white font-semibold text-[0.9375rem] hover:opacity-90 transition-opacity">
                      Add Asset
                    </button>
                  </form>
                </div>
              </section>

            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Profile;
