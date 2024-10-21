import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const App = () => {
  const [cryptos, setCryptos] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCrypto, setSelectedCrypto] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [loadingChart, setLoadingChart] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd')
      .then((response) => response.json())
      .then((data) => setCryptos(data))
      .catch((error) => console.error('Error fetching cryptos:', error));
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSelectCrypto = (crypto) => {
    setSelectedCrypto(crypto);
    fetchChartData(crypto.id);
  };

  const fetchChartData = async (cryptoId) => {
    setLoadingChart(true);
    try {
      const response = await fetch(
        `https://api.coingecko.com/api/v3/coins/${cryptoId}/market_chart?vs_currency=usd&days=7`
      );
      const data = await response.json();

      const labels = data.prices.map((price) => {
        const date = new Date(price[0]);
        return `${date.getMonth() + 1}/${date.getDate()}`;
      });

      const prices = data.prices.map((price) => price[1]);

      setChartData({
        labels,
        datasets: [
          {
            label: 'Price (Last 7 Days)',
            data: prices,
            borderColor: 'rgba(75, 192, 192, 1)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
          },
        ],
      });
      setLoadingChart(false);
    } catch (error) {
      console.error('Error fetching chart data:', error);
      setLoadingChart(false);
    }
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div
      style={{
        backgroundColor: darkMode ? '#333' : '#fff',
        color: darkMode ? '#fff' : '#000', // Text outside divs
        minHeight: '100vh',
        textAlign: 'center',
        padding: '20px',
      }}
    >
      <h1 style={{ color: darkMode ? '#fff' : '#000' }}>Cryptocurrency Tracker</h1>
      <button
        onClick={toggleDarkMode}
        style={{
          padding: '10px',
          marginBottom: '20px',
          borderRadius: '5px',
          backgroundColor: darkMode ? '#555' : '#007bff',
          color: darkMode ? '#fff' : '#fff',
          border: 'none',
          cursor: 'pointer',
          fontSize: '16px',
        }}
      >
        {darkMode ? 'Light Mode' : 'Dark Mode'}
      </button>

      <input
        type="text"
        placeholder="Search cryptocurrency..."
        value={searchTerm}
        onChange={handleSearch}
        style={{
          padding: '10px',
          margin: '20px 0',
          width: '300px',
          borderRadius: '5px',
          border: '1px solid #ccc',
        }}
      />

      {!selectedCrypto ? (
        <div>
          <h2 style={{ color: darkMode ? '#fff' : '#000' }}>Popular Cryptocurrencies</h2>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              flexWrap: 'wrap',
              gap: '10px',
            }}
          >
            {cryptos
              .filter((crypto) =>
                crypto.name.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map((crypto) => (
                <div
                  key={crypto.id}
                  onClick={() => handleSelectCrypto(crypto)}
                  style={{
                    border: '1px solid #ccc',
                    padding: '10px',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    width: '150px',
                    textAlign: 'center',
                    backgroundColor: '#fff',
                    color: '#000', // Text inside div stays black
                  }}
                >
                  <h3>{crypto.name}</h3>
                  <p>Price: ${crypto.current_price}</p>
                </div>
              ))}
          </div>
        </div>
      ) : (
        <div>
          <h2 style={{ color: darkMode ? '#fff' : '#000' }}>{selectedCrypto.name} Price Chart</h2>
          {loadingChart ? (
            <p>Loading chart...</p>
          ) : (
            chartData && <Line data={chartData} />
          )}
          <button
            onClick={() => setSelectedCrypto(null)}
            style={{
              padding: '10px',
              marginTop: '20px',
              borderRadius: '5px',
              backgroundColor: '#007bff',
              color: '#fff',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            Back to Home
          </button>
        </div>
      )}
    </div>
  );
};

export default App;
