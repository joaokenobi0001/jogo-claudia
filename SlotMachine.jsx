import React, { useState } from "react";

export default function SlotMachine() {
  const [reels, setReels] = useState(["?","?","?"]);
  const [spinning, setSpinning] = useState(false);
  const [message, setMessage] = useState("");
  const [credits, setCredits] = useState(100); 
  const [bet, setBet] = useState(1);

  async function handleSpin() {
    if (spinning) return;
    if (bet <= 0 || bet > credits) {
      setMessage("Aposte um valor válido (<= seus créditos).");
      return;
    }

    setSpinning(true);
    setMessage("Girando...");
    setCredits(c => c - bet); 

    const localAnim = ["1","2","3","4","5","6"];
    let animIndex = 0;
    const animInterval = setInterval(() => {
      setReels([localAnim[(animIndex)%6], localAnim[(animIndex+2)%6], localAnim[(animIndex+4)%6]]);
      animIndex++;
    }, 80);

    try {
      const resp = await fetch("http://localhost:3333/spin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bet }),
      });
      const data = await resp.json();
      clearInterval(animInterval);

      const final = data.reels;
      
      for (let i = 0; i < 3; i++) {
        await new Promise(r => setTimeout(r, 250));
        setReels(prev => {
          const copy = [...prev];
          copy[i] = final[i];
          return copy;
        });
      }

      if (data.payout > 0) {
        setMessage(`Você ganhou ${data.payout} créditos!`);
        setCredits(c => c + data.payout);
      } else {
        setMessage("Não ganhou desta vez. Tente de novo!");
      }
    } catch (err) {
      clearInterval(animInterval);
      setMessage("Erro no servidor. Confira se o backend está rodando.");
      setCredits(c => c + bet);
    } finally {
      setSpinning(false);
    }
  }

  function resetGame() {
    setCredits(100);
    setBet(1);
    setReels(["?","?","?"]);
    setMessage("");
  }

  return (
    <div style={{fontFamily:"Arial, sans-serif", maxWidth:420, margin:"20px auto", textAlign:"center", padding:20, border:"1px solid #ddd", borderRadius:8}}>
      <h2>Caça-níquel simples</h2>
      <div style={{display:"flex", justifyContent:"center", gap:10, fontSize:48, marginBottom:12}}>
        <div style={{width:90, height:90, display:"flex", alignItems:"center", justifyContent:"center", background:"#f7f7f7", borderRadius:8}}>{reels[0]}</div>
        <div style={{width:90, height:90, display:"flex", alignItems:"center", justifyContent:"center", background:"#f7f7f7", borderRadius:8}}>{reels[1]}</div>
        <div style={{width:90, height:90, display:"flex", alignItems:"center", justifyContent:"center", background:"#f7f7f7", borderRadius:8}}>{reels[2]}</div>
      </div>

      <div style={{marginBottom:8}}>
        <label>Créditos: <b>{credits}</b></label>
      </div>

      <div style={{marginBottom:12}}>
        <label>Aposta: </label>
        <input type="number" min="1" value={bet} onChange={e => setBet(Number(e.target.value)||1)} disabled={spinning} style={{width:80}} />
      </div>

      <div style={{display:"flex", gap:8, justifyContent:"center", marginBottom:12}}>
        <button onClick={handleSpin} disabled={spinning || credits < 1} style={{padding:"8px 16px", cursor: spinning ? "not-allowed":"pointer"}}>Girar</button>
        <button onClick={resetGame} disabled={spinning} style={{padding:"8px 12px"}}>Reset</button>
      </div>

      <div style={{minHeight:24}}>
        <small>{message}</small>
      </div>

      <div style={{marginTop:14, fontSize:12, color:"#666"}}>
        <div>Regras rápidas:</div>
        <div>3 iguais → x10 | 2 iguais → x2 | presença do 7️⃣ → +1</div>
      </div>
    </div>
  );
}
