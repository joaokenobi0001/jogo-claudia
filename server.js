const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors());
app.use(express.json());

const SYMBOLS = ["1", "2", "3", "4", "5", "6"];

function spinOnce() {

  const reels = [];
  for (let i = 0; i < 3; i++) {
    const idx = Math.floor(Math.random() * SYMBOLS.length);
    reels.push(SYMBOLS[idx]);
  }
  return reels;
}

function calculatePayout(reels, bet = 1) {
  const counts = {};
  for (const r of reels) counts[r] = (counts[r] || 0) + 1;

  let payout = 0;
  if (Object.values(counts).includes(3)) {
    payout = 10 * bet;
  } else if (Object.values(counts).includes(2)) {
    payout = 2 * bet;
  } else {
    payout = 0;
  }


  if (reels.includes("6")) payout += 1 * bet;

  return payout;
}

app.post("/spin", (req, res) => {
  const bet = Math.max(1, Number(req.body?.bet) || 1);
  const reels = spinOnce();
  const payout = calculatePayout(reels, bet);
  res.json({ reels, payout });
});

const PORT = process.env.PORT || 3333;
app.listen(PORT, () => {
  console.log(`Slot server rodando na porta ${PORT}`);
});
