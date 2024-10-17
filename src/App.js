import React, { useState, useEffect } from 'react';
import './App.css';

const App = () => {
  const [cryptos, setCryptos] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [selectedCrypto, setSelectedCrypto] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false');
      const data = await response.json();
      setCryptos(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handleSelectCrypto = (crypto) => {
    setSelectedCrypto(crypto);
  };

  const handleBackHome = () => {
    setSelectedCrypto(null);
  };

  const filteredCryptos = cryptos.filter(crypto =>
    crypto.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={`app ${darkMode ? 'dark-mode' : ''}`}>
      <header>
        <h1>Cryptocurrency Tracker</h1>
        <button onClick={toggleDarkMode}>
          Toggle Dark/Light Mode
        </button>
        <input
          type="text"
          placeholder="Search for a cryptocurrency..."
          value={searchTerm}
          onChange={handleSearch}
        />
      </header>
      <main>
        {loading ? (
          <p>Loading...</p>
        ) : selectedCrypto ? (
          <div className="crypto-detail">
            <h2>{selectedCrypto.name}</h2>
            <p>Current Price: ${selectedCrypto.current_price}</p>
            <p>Market Cap: ${selectedCrypto.market_cap}</p>
            <button onClick={handleBackHome}>Back to Home</button>
          </div>
        ) : (
          <div className="crypto-list">
            {filteredCryptos.map(crypto => (
              <div key={crypto.id} className="crypto-item" onClick={() => handleSelectCrypto(crypto)}>
                <h2>{crypto.name}</h2>
                <p>Price: ${crypto.current_price}</p>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
