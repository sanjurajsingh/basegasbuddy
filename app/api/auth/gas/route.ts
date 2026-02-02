import { NextResponse } from "next/server";

const BASE_RPC = "https://mainnet.base.org";

export async function GET() {
  try {
    const res = await fetch(BASE_RPC, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method: "eth_gasPrice",
        params: [],
      }),
    });

    const json = await res.json();

    const gasWei = parseInt(json.result, 16);
    const gasGwei = gasWei / 1e9;

    return NextResponse.json({
      current: Number(gasGwei.toFixed(2)),
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch gas" },
      { status: 500 }
    );
  }
}
