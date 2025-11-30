import React, { useState, useEffect } from 'react';
import './SlotMachine.css';
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
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const SlotMachine = () => {
  const [balance, setBalance] = useState(1000);
  const [betAmount, setBetAmount] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [reels, setReels] = useState(['🍒', '🍒', '🍒']);
  const [result, setResult] = useState('');
  const [balanceHistory, setBalanceHistory] = useState([1000]);
  const [betCount, setBetCount] = useState(1);
  const [winAmount, setWinAmount] = useState(0);

  // Símbolos do caça-níqueis com probabilidades diferentes
  const symbols = [
    { symbol: '🍒', multiplier: 2, probability: 0.4 },
    { symbol: '🍋', multiplier: 3, probability: 0.3 },
    { symbol: '🍊', multiplier: 5, probability: 0.15 },
    { symbol: '🔔', multiplier: 10, probability: 0.1 },
    { symbol: '⭐', multiplier: 20, probability: 0.04 },
    { symbol: '💎', multiplier: 50, probability: 0.01 }
  ];

  const getRandomSymbol = () => {
    const rand = Math.random();
    let cumulative = 0;
    
    for (const sym of symbols) {
      cumulative += sym.probability;
      if (rand <= cumulative) {
        return sym;
      }
    }
    return symbols[0];
  };

  const calculateWinnings = (reelSymbols) => {
    const [a, b, c] = reelSymbols;
    
    // Jackpot - todos iguais
    if (a === b && b === c) {
      const symbol = symbols.find(s => s.symbol === a);
      return betAmount * symbol.multiplier;
    }
    
    // Dois iguais
    if (a === b || a === c || b === c) {
      return betAmount * 1.5;
    }
    
    return 0;
  };

  const spinReels = () => {
    if (betAmount <= 0 || betAmount > balance) {
      alert('Aposta inválida! Verifique o valor.');
      return;
    }

    setIsSpinning(true);
    setResult('');
    setWinAmount(0);

    // Atualizar saldo inicial
    const newBalance = balance - betAmount;
    setBalance(newBalance);
    setBetCount(prev => prev + 1);

    // Animação dos rolos
    const spinDuration = 2000;
    const spinInterval = 100;
    const spins = spinDuration / spinInterval;
    let currentSpin = 0;

    const spinIntervalId = setInterval(() => {
      const newReels = [
        getRandomSymbol().symbol,
        getRandomSymbol().symbol,
        getRandomSymbol().symbol
      ];
      setReels(newReels);
      currentSpin++;

      if (currentSpin >= spins) {
        clearInterval(spinIntervalId);
        
        // Resultado final
        const finalReels = [
          getRandomSymbol().symbol,
          getRandomSymbol().symbol,
          getRandomSymbol().symbol
        ];
        setReels(finalReels);
        
        const winnings = calculateWinnings(finalReels);
        setWinAmount(winnings);
        
        setTimeout(() => {
          setIsSpinning(false);
          
          if (winnings > 0) {
            const finalBalance = newBalance + winnings;
            setBalance(finalBalance);
            setBalanceHistory(prev => [...prev, finalBalance]);
            setResult(`🎉 Você ganhou $${winnings}!`);
          } else {
            setBalanceHistory(prev => [...prev, newBalance]);
            setResult('😔 Tente novamente!');
            
            if (newBalance === 0) {
              alert('💸 Você perdeu tudo! A casa sempre ganha.');
            }
          }
        }, 500);
      }
    }, spinInterval);
  };

  const ChartComponent = () => {
    const data = {
      labels: Array.from(Array(betCount).keys()),
      datasets: [
        {
          label: 'Histórico do Saldo',
          data: balanceHistory,
          borderColor: 'rgba(75, 192, 192, 1)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderWidth: 2,
        },
      ],
    };

    const options = {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: 'Evolução do Seu Saldo',
        },
      },
      scales: {
        y: {
          beginAtZero: true
        }
      }
    };

    return <Line data={data} options={options} />;
  };

  return (
    <div className="slot-machine-container">
      <div className="slot-main-content">
        <div className="slot-machine">
          <div className="reels-container">
            <div className={`reel ${isSpinning ? 'spinning' : ''}`}>
              <div className="reel-symbol">{reels[0]}</div>
            </div>
            <div className={`reel ${isSpinning ? 'spinning' : ''}`}>
              <div className="reel-symbol">{reels[1]}</div>
            </div>
            <div className={`reel ${isSpinning ? 'spinning' : ''}`}>
              <div className="reel-symbol">{reels[2]}</div>
            </div>
          </div>
          
          <div className="payline"></div>
          
          <div className="slot-controls">
            <div className="betting-panel">
              <h3>Faça sua aposta</h3>
              <input
                type="number"
                placeholder="Valor da aposta"
                value={betAmount}
                onChange={(e) => setBetAmount(parseInt(e.target.value) || 0)}
                min="1"
                max={balance}
              />
              <button 
                onClick={spinReels} 
                disabled={isSpinning || betAmount <= 0}
                className="spin-button"
              >
                {isSpinning ? 'Girando...' : 'GIRAR!'}
              </button>
            </div>
            
            <div className="balance-info">
              <h3>Saldo: ${balance}</h3>
              {winAmount > 0 && (
                <div className="win-display">+${winAmount}</div>
              )}
            </div>
            
            {result && (
              <div className="result-message">
                {result}
              </div>
            )}
          </div>
        </div>

        <div className="probabilities-panel">
          <h4>Probabilidades de Pagamento</h4>
          <div className="probabilities-list">
            {symbols.map((sym, index) => (
              <div key={index} className="probability-item">
                <span className="symbol">{sym.symbol}</span>
                <span className="multiplier">{sym.multiplier}x</span>
                <span className="probability">{(sym.probability * 100).toFixed(1)}%</span>
              </div>
            ))}
            <div className="probability-item">
              <span className="symbol">🍒🍒🍒</span>
              <span className="multiplier">2x</span>
              <span className="probability">6.4%</span>
            </div>
            <div className="probability-item">
              <span className="symbol">🎯 Dois iguais</span>
              <span className="multiplier">1.5x</span>
              <span className="probability">~30%</span>
            </div>
          </div>
        </div>
      </div>

      <div className="slot-chart-container">
        <ChartComponent />
        <div className="educational-note">
          <h4>📊 A Casa Sempre Ganha</h4>
          <p>
            Mesmo com vitórias ocasionais, as probabilidades estão matematicamente 
            a favor da casa. Quanto mais você joga, maior a chance de perder tudo!
          </p>
          <p>
            <strong>Valor esperado por aposta:</strong> -5% a -15%
          </p>
        </div>
      </div>
    </div>
  );
};

export default SlotMachine;