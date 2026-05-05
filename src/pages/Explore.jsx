import NavBar from "../components/layout/NavBar";
import Footer from "../components/layout/Footer";
import { useState, useEffect } from "react";
import axios from "axios";
import API_BASE from "../lib/api";

const Explore = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [cryptos, setCryptos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchCryptos = async () => {
      try {
        setLoading(true);
        setError(null);

        let url = `${API_BASE}/crypto`;
        if (activeTab === "gainers") url = `${API_BASE}/crypto/gainers`;
        else if (activeTab === "new") url = `${API_BASE}/crypto/new`;

        const response = await axios.get(url);
        if (response.data.success) {
          setCryptos(response.data.data);
        } else {
          setError("Failed to load crypto data");
        }
      } catch (err) {
        console.error("Error fetching cryptos:", err);
        setError("Failed to load crypto data. Make sure the backend is running.");
      } finally {
        setLoading(false);
      }
    };
    fetchCryptos();
  }, [activeTab]);

  const filteredCryptos = cryptos.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const tabs = [
    { key: "all", label: "All markets" },
    { key: "gainers", label: "Top gainers" },
    { key: "new", label: "New listings" },
  ];

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <header>
        <NavBar />
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 md:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-serif font-bold">Explore</h1>
          <p className="text-gray-600 mt-2">
            Browse assets, markets, and discover opportunities.
          </p>
        </div>

        {/* Search / Filters */}
        <div className="flex flex-col sm:flex-row items-center gap-3 mb-8">
          <div className="w-full sm:w-2/3">
            <label htmlFor="explore-search" className="sr-only">
              Search assets
            </label>
            <div className="relative">
              <input
                id="explore-search"
                type="search"
                placeholder="Search assets, e.g. Bitcoin, ETH, SOL"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full border border-gray-300 rounded-full px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                🔍
              </span>
            </div>
          </div>

          <div className="w-full sm:w-1/3 flex justify-end">
            <div className="flex gap-2">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    activeTab === tab.key
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Asset list */}
        <section aria-labelledby="explore-assets">
          <h2 id="explore-assets" className="sr-only">
            Assets
          </h2>

          {loading && (
            <div className="text-center py-12 text-gray-400">
              <div
                style={{
                  width: "32px",
                  height: "32px",
                  border: "3px solid #e5e7eb",
                  borderTopColor: "#2563eb",
                  borderRadius: "50%",
                  animation: "spin 0.8s linear infinite",
                  margin: "0 auto 12px",
                }}
              />
              Loading assets...
              <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
          )}

          {error && (
            <div className="text-center py-12">
              <p className="text-red-500 mb-2">⚠️ {error}</p>
              <button
                onClick={() => setActiveTab(activeTab)}
                className="text-blue-600 hover:underline text-sm"
              >
                Try again
              </button>
            </div>
          )}

          {!loading && !error && filteredCryptos.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              <p className="text-3xl mb-2">🔍</p>
              <p className="font-medium">No assets found</p>
              {searchTerm && (
                <p className="text-sm mt-1">
                  Try a different search term
                </p>
              )}
            </div>
          )}

          {!loading && !error && filteredCryptos.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredCryptos.map((crypto) => (
                <a
                  key={crypto._id}
                  href={`/asset/${crypto._id}`}
                  className="flex items-center gap-4 p-4 border border-gray-100 rounded-lg hover:shadow-sm transition-shadow bg-white"
                >
                  <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center shrink-0 overflow-hidden">
                    {crypto.image ? (
                      <img
                        src={crypto.image}
                        alt={crypto.name}
                        className="w-10 h-10 rounded-full object-cover"
                        onError={(e) => {
                          e.target.style.display = "none";
                          e.target.parentElement.innerHTML = `<span class="text-sm font-bold text-gray-700">${crypto.symbol.charAt(0)}</span>`;
                        }}
                      />
                    ) : (
                      <span className="text-sm font-bold text-gray-700">
                        {crypto.symbol.charAt(0)}
                      </span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div className="min-w-0">
                        <p className="font-semibold text-sm truncate">
                          {crypto.name}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {crypto.symbol.toUpperCase()}
                        </p>
                      </div>
                      <div className="text-right ml-4">
                        <p className="font-medium text-sm">
                          $
                          {crypto.price.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 6,
                          })}
                        </p>
                        <p
                          className={`text-xs mt-1 font-semibold ${
                            crypto.priceChange24h >= 0
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {crypto.priceChange24h >= 0 ? "▲" : "▼"}{" "}
                          {Math.abs(crypto.priceChange24h).toFixed(2)}%
                        </p>
                      </div>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Explore;
