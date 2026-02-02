export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { JsonRpcProvider } from "ethers";

const BASE_RPC = "https://mainnet.base.org";

export async function GET() {
  try {
    const provider = new JsonRpcProvider(BASE_RPC);
    const feeData = await provider.getFeeData();

    const current = feeData.maxFeePerGas
      ? Number(feeData.maxFeePerGas) / 1e9
      : 0;

    return NextResponse.json({
      current,
      low: current * 0.8,
      average: current,
      high: current * 1.3,
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to fetch Base gas" },
      { status: 500 }
    );
  }
}
