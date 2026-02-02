"use client";

import { useEffect, useState } from "react";

const BASE_RPC = "https://mainnet.base.org";

export default function Home() {
  const [current, setCurrent] = useState<number | null>(null);
  const [low, setLow] = useState<number | null>(null);
  const [avg, setAvg] = useState<number | null>(null);
  const [high, setHigh] = useState<number | null>(null);
  const [status, setStatus] = useState("Loading...");

  useEffect(() => {
    loadGas();
  }, []);

  async function loadGas() {
    try {
      const res = await fetch(BASE_RPC, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: 1,
          method: "eth_feeHistory",
          params: ["0x500", "latest", []], // recent blocks
        }),
      });

      const json = await res.json();
      const fees = json.result.baseFeePerGas.map(
        (v: string) => parseInt(v, 16) / 1e9
      );

      const cur = fees[fees.length - 1];
      const min = Math.min(...fees);
      const max = Math.max(...fees);
      const average = fees.reduce((a: number, b: number) => a + b, 0) / fees.length;

      setCurrent(+cur.toFixed(2));
      setLow(+min.toFixed(2));
      setHigh(+max.toFixed(2));
      setAvg(+average.toFixed(2));

      if (cur <= average) setStatus("🟢 SEND NOW");
      else if (cur < max) setStatus("🟡 WAIT");
      else setStatus("🔴 EXPENSIVE");
    } catch (e) {
      setStatus("Failed to load gas");
    }
  }

  return (
    <main style={{ padding: 20, fontFamily: "sans-serif" }}>
      <h1>⛽ Base Gas Buddy</h1>
      <p>Is now a good time to transact?</p>

      <hr />

      <h2>{status}</h2>

      <p><strong>Current:</strong> {current ?? "-"} gwei</p>
      <p><strong>Low:</strong> {low ?? "-"} gwei</p>
      <p><strong>Average:</strong> {avg ?? "-"} gwei</p>
      <p><strong>High:</strong> {high ?? "-"} gwei</p>

      <button onClick={loadGas} style={{ marginTop: 20 }}>
        Refresh
      </button>
    </main>
  );
}
