"use client";

import { useEffect, useState } from "react";

type GasData = {
  current: number;
  low: number;
  average: number;
  high: number;
};

export default function Home() {
  const [gas, setGas] = useState<GasData | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch("/api/gas")
      .then((res) => {
        if (!res.ok) throw new Error("Failed");
        return res.json();
      })
      .then((data) => setGas(data))
      .catch(() => setError(true));
  }, []);

  if (error) {
    return (
      <div style={{ padding: 24 }}>
        <h1>⛽ Base Gas Buddy</h1>
        <p>Unable to load gas data</p>
        <button onClick={() => location.reload()}>Refresh</button>
      </div>
    );
  }

  if (!gas) {
    return (
      <div style={{ padding: 24 }}>
        <h1>⛽ Base Gas Buddy</h1>
        <p>Loading gas data…</p>
      </div>
    );
  }

  const shouldSend = gas.current <= gas.average;

  return (
    <div style={{ padding: 24 }}>
      <h1>⛽ Base Gas Buddy</h1>
<p><strong>Live Base gas insights - optimized for everyday transactions</strong></p>
<p>Is now a good time to transact?</p>


      <h2>{gas.current.toFixed(4)} gwei</h2>

      <ul>
        <li>Low (24h): {gas.low.toFixed(4)}</li>
        <li>Average: {gas.average.toFixed(4)}</li>
        <li>High: {gas.high.toFixed(4)}</li>
      </ul>

      <h2>{shouldSend ? "✅ SEND NOW" : "⏳ WAIT"}</h2>
    </div>
  );
}
