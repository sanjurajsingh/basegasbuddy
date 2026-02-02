const ROOT_URL =
  process.env.NEXT_PUBLIC_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : 'http://localhost:3000');

/**
 * MiniApp configuration object. Must follow the Farcaster MiniApp specification.
 *
 * @see {@link https://miniapps.farcaster.xyz/docs/guides/publishing}
 */
export const farcasterConfig = {
  accountAssociation: {
    header: "",
    payload: "",
    signature: ""
  },
 miniapp: {
  version: "1",
  name: "Base Gas Buddy",
  subtitle: "Is now a good time to transact?",
  description: "Real-time Base gas tracker with send or wait guidance.",
  primaryCategory: "finance",
  tags: ["base", "gas", "fees", "tools"],
}

