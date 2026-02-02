import { Errors, createClient } from "@farcaster/quick-auth";
import { NextRequest, NextResponse } from "next/server";

const client = createClient();

// Helper function to determine the correct domain for JWT verification
function getUrlHost(request: NextRequest): string {
  const origin = request.headers.get("origin");
  if (origin) {
    try {
      const url = new URL(origin);
      return url.host;
    } catch {
      // ignore invalid origin
    }
  }

  const host = request.headers.get("host");
  if (host) {
    return host;
  }

  let urlValue: string;
  if (process.env.VERCEL_ENV === "production") {
    urlValue = process.env.NEXT_PUBLIC_URL!;
  } else if (process.env.VERCEL_URL) {
    urlValue = `https://${process.env.VERCEL_URL}`;
  } else {
    urlValue = "http://localhost:3000";
  }

  const url = new URL(urlValue);
  return url.host;
}

export async function GET(request: NextRequest) {
  const authorization = request.headers.get("Authorization");

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return NextResponse.json({ message: "Missing token" }, { status: 401 });
  }

  try {
    const payload = await client.verifyJwt({
      token: authorization.split(" ")[1] as string,
      domain: getUrlHost(request),
    });

    return NextResponse.json({
      success: true,
      user: {
        fid: payload.sub,
        issuedAt: payload.iat,
        expiresAt: payload.exp,
      },
    });
  } catch (error) {
    if (error instanceof Errors.InvalidTokenError) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

    if (error instanceof Error) {
      return NextResponse.json(
        { message: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Unknown error" },
      { status: 500 }
    );
  }
}

