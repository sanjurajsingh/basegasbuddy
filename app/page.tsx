"use client";

import { useEffect, useState } from "react";

type GasData = {
  current: number;
  low: number;
  average: number;
  high: number;
};

export default function HomePage() {
  const [gas, setGas] = useState<GasData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function fetchGas() {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch("/api/gas", { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to fetch gas data");

      const data = await res.json();
      setGas(data);
    } catch (err) {
      setError("Unable to load gas data");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchGas();
  }, []);

  const decision =
    gas && gas.current <= gas.average ? "SEND NOW 🚀" : "WAIT ⏳";

  return (
    <main style={{ padding: "16px", fontFamily: "monospace" }}>
      <h1>⛽ Base Gas Buddy</h1>
      <p>Is now a good time to transact?</p>

      {loading && <p>Loading gas data…</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {gas && (
        <>
          <h2>{decision}</h2>

          <p>Current: {gas.current.toFixed(4)} gwei</p>
          <p>Low: {gas.low.toFixed(4)} gwei</p>
          <p>Average: {gas.average.toFixed(4)} gwei</p>
          <p>High: {gas.high.toFixed(4)} gwei</p>
        </>
      )}

      <button onClick={fetchGas} style={{ marginTop: "12px" }}>
        Refresh
      </button>
    </main>
  );
}
