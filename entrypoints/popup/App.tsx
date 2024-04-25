import { useState } from 'react';
import reactLogo from '@/assets/react.svg';
import wxtLogo from '/wxt.svg';
import './App.css';

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div>

      </div>
      <h1>Carmentis</h1>
        <div className="card">
            <button onClick={() => setCount((count) => count + 1)}>
                Create a new Carmentis Wallet
            </button>
            <br/>
            <button onClick={() => setCount((count) => count + 1)} className={"mt-1"}>
                Import a Carmentis Wallet
            </button>
        </div>
        <p className="read-the-docs">
        </p>
    </>
  );
}

export default App;
