import React, { useEffect, useState } from 'react';

const API_BASE = 'http://localhost:5173/api'; // Change if your API runs elsewhere

const daysOfWeek = [
  { value: 1, label: 'Monday' },
  { value: 2, label: 'Tuesday' },
  { value: 3, label: 'Wednesday' },
  { value: 4, label: 'Thursday' },
  { value: 5, label: 'Friday' },
  { value: 6, label: 'Saturday' },
  { value: 7, label: 'Sunday' },
];

function App() {
  const [airports, setAirports] = useState([]);
  const [origin, setOrigin] = useState('');
  const [dest, setDest] = useState('');
  const [day, setDay] = useState(1);
  const [result, setResult] = useState(null);

  useEffect(() => {
    fetch(`${API_BASE}/airports`)
      .then(res => res.json())
      .then(data => setAirports(data));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setResult(null);
    if (!origin || !dest || !day) return;
    const url = `${API_BASE}/predict?DayOfWeek=${day}&OriginAirportID=${origin}&DestAirportID=${dest}`;
    const res = await fetch(url);
    const data = await res.json();
    setResult(data);
  };

  return (
    <div style={{ maxWidth: 500, margin: '2rem auto', fontFamily: 'sans-serif' }}>
      <h2>Flight Delay Predictor</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Origin Airport:</label>
          <select value={origin} onChange={e => setOrigin(e.target.value)} required>
            <option value="">Select Origin</option>
            {airports.map(a => (
              <option key={a.code} value={a.code}>{a.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label>Destination Airport:</label>
          <select value={dest} onChange={e => setDest(e.target.value)} required>
            <option value="">Select Destination</option>
            {airports.map(a => (
              <option key={a.code} value={a.code}>{a.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label>Day of Week:</label>
          <select value={day} onChange={e => setDay(e.target.value)} required>
            {daysOfWeek.map(d => (
              <option key={d.value} value={d.value}>{d.label}</option>
            ))}
          </select>
        </div>
        <button type="submit" style={{ marginTop: '1rem' }}>Predict</button>
      </form>
      {result && (
        <div style={{ marginTop: '2rem' }}>
          <h2>Prediction Result</h2>
          {'error' in result ? (
            <div style={{ color: 'red' }}>{result.error}</div>
          ) : (
            <>
              <div><h3>Will it be delayed?: <b>{result.delayed_over_15 ? 'Yes' : 'No'}</b></h3></div>
              <div>Chance of delay: <b>{result.chance_percent}%</b></div>
              <div>Confidence in prediction: <b>{result.confidence_percent}%</b></div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default App;