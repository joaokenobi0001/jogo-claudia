import React, { useState } from 'react';
import RouletteWheel from './RouletteWheel';
import SlotMachine from './SlotMachine';
import './App.css';

function App() {
  const [currentGame, setCurrentGame] = useState('roulette');

  return (
    <div className="App">
      <h1 className="header-text">A Casa Sempre Ganha</h1>
      
      <div className="game-selector">
        <button 
          onClick={() => setCurrentGame('roulette')}
          className={currentGame === 'roulette' ? 'active' : ''}
        >
          Roleta
        </button>
        <button 
          onClick={() => setCurrentGame('slots')}
          className={currentGame === 'slots' ? 'active' : ''}
        >
          Caça-Níqueis
        </button>
      </div>

      {currentGame === 'roulette' ? <RouletteWheel /> : <SlotMachine />}
      
      <div className="footer">
        <h3>Eu odeio github</h3>
      </div>
    </div>
  );
}

export default App;