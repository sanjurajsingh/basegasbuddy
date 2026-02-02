export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { JsonRpcProvider } from "ethers";

const BASE_RPC = "https://mainnet.base.org";

export async function GET() {
  try {
    const provider = new JsonRpcProvider(BASE_RPC);
    const block = await provider.getBlock("latest");

    if (!block || !block.baseFeePerGas) {
      throw new Error("No base fee");
    }

    const current = Number(block.baseFeePerGas) / 1e9;

    // simple derived stats (MVP)
    const low = current * 0.85;
    const high = current * 1.15;
    const average = (low + high) / 2;

    return NextResponse.json({
      current,
      low,
      average,
      high,
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to fetch gas" },
      { status: 500 }
    );
  }
}
