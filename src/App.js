import React, { useState } from 'react';
import './App.css';
import axios from 'axios';
const windowSize = 10;

function App() {
  const [response, setResponse] = useState({
    windowPrevState: [],
    windowCurrState: [],
    numbers: [],
    avg: null,
  });

  const [numberId, setNumberId] = useState('');

  const fetchData = async () => {
    try {
      let url = `http://20.244.56.144/numbers/`;
      switch (numberId) {
        case 'r':
          url += 'rand';
          break;
        case 'e':
          url += 'even';
          break;
        case 'f':
          url += 'fibo';
          break;
        case 'p':
          url += 'primes';
          break;
        default:
          console.error('Invalid number ID');
          return;
      }
      const res = await axios.get(url);
      const numbers = res.data.numbers;
      const sum = numbers.reduce((acc, num) => acc + num, 0);
      const avg = parseFloat((sum / numbers.length).toFixed(2));

      setResponse((prevState) => {
        const windowCurrState =
          prevState.windowCurrState.length < windowSize
            ? [...prevState.windowCurrState, ...numbers]
            : [...prevState.windowCurrState.slice(1), ...numbers.slice(0, 1)];
        const windowPrevState = [...windowCurrState];
        return {
          windowPrevState,
          windowCurrState,
          numbers,
          avg,
        };
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="App">
      <h1>Average Calculator</h1>
      <div className="input-container">
        <input
          type="text"
          value={numberId}
          onChange={(e) => setNumberId(e.target.value)}
          placeholder="Enter number ID (p, f, e, r)"
        />
        <button onClick={fetchData}>Fetch Data</button>
      </div>

      {response && (
        <div className="response-container">
          <h2>Window Previous State: {JSON.stringify(response.windowPrevState.slice(-windowSize))}</h2>
          <h2>Window Current State: {JSON.stringify(response.windowCurrState)}</h2>
          <h2>Numbers: {JSON.stringify(response.numbers)}</h2>
          <h2>Average: {response.avg}</h2>
        </div>
      )}
    </div>
  )
}

export default App;
