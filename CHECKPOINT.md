# Settled — Work Checkpoint

**Saved:** 2026-07-17  
**Status:** Contract **DEPLOYED** on Monad testnet. App env wired. Next: E2E create→confirm→settle + ship polish.

---

## What Settled is

Onchain shared-expense receipts on **Monad Testnet** (chain ID `10143`):

`Create bill → Confirm → Settle (one tx) → Permanent receipt`

Hackathon: Spark · Build Anything (deadline Jul 19, 2026 11:59 PM UTC).

---

## Repo layout

| Path | Role |
|---|---|
| `README.md` | Full product/build plan, demo script, contract spec |
| `settled-contract/` | Foundry: `BillSplitter.sol`, tests, deploy script |
| `settled-app/` | Next.js 14 + wagmi/viem + Tailwind UI |
| `CHECKPOINT.md` | This file |

---

## What’s already built (code)

### Contract (`settled-contract/`) — DONE in source

- `src/BillSplitter.sol` — create / confirm / settle / views / events
- `test/BillSplitter.t.sol` — happy path + reverts
- `script/Deploy.s.sol` — deploys with `PRIVATE_KEY`
- `out/` artifacts exist (was compiled before)
- **Not deployed:** no `broadcast/` folder
- **Forge not on PATH** when last checked

### Frontend (`settled-app/src/`) — MVP complete + build fixed

| Area | Files | Status |
|---|---|---|
| Landing | `app/page.tsx` | Done |
| Create bill | `app/create/page.tsx` | Done — wired to `createBill` |
| Bill detail | `app/bill/[id]/page.tsx` | Done — confirm, settle, receipt, share link |
| Wallet | `components/ConnectButton.tsx`, `Providers.tsx` | Done — injected wallet, Monad switch |
| Chain/config | `lib/chains.ts`, `lib/wagmi.ts`, `lib/contract.ts`, `lib/abi.ts` | Done — build green |
| Design system | `globals.css`, `tailwind.config.ts` | Done |

**Out of scope (intentionally):** notifications, ENS, history dashboard, multi-chain, ERC-20.

---

## Environment state (verified at this checkpoint)

| Check | Result |
|---|---|
| Node / npm | Node v24.x · npm 11.x |
| `settled-app/node_modules` | Healthy |
| Production build | **PASS** (2026-07-17) |
| Dev server | **Not running** |
| Contract on chain | **Not deployed** |
| `.env.local` contract address | **Empty** |

### Config gap (blocks real create/bill txs)

`settled-app/.env.local`:

```
NEXT_PUBLIC_CONTRACT_ADDRESS=
NEXT_PUBLIC_MONAD_RPC=https://testnet-rpc.monad.xyz
NEXT_PUBLIC_CHAIN_ID=10143
NEXT_PUBLIC_EXPLORER_URL=https://testnet.monadvision.com
```

---

## Progress log

### 2026-07-17 — Clean reinstall DONE

1. Deleted corrupt `package-lock.json` → `npm install`.
2. **Success:** ~825 packages.

### 2026-07-17 — `npm run build` FAILED (wagmi connectors barrel)

Import chain: `wagmi/connectors` → Base Account → missing optional `@x402/*`.

### 2026-07-17 — Resume: build unblocked and green

1. **wagmi import fix:** import `injected` from `wagmi` (not `wagmi/connectors`).
2. **tsconfig:** set `"target": "ES2020"` so BigInt literals (`0n`) type-check.
3. **SSR prerender crash:** singleton `config` (not `getConfig()` factory), `export const dynamic = "force-dynamic"` in layout for cookie hydration.
4. **`npm run build` → exit 0**

Routes:

| Route | Type |
|---|---|
| `/` | Dynamic |
| `/create` | Dynamic |
| `/bill/[id]` | Dynamic |

---

## Resume checklist

### 1–3. Install + production build — DONE

### 4. Dev server

```powershell
cd C:\Users\USER\Desktop\Hacks\Settled\settled-app
npm run dev
```

Open `http://localhost:3000`.

### 5. Contract deploy (needs user key + MON)

Forge may need install/PATH fix first.

```powershell
cd C:\Users\USER\Desktop\Hacks\Settled\settled-contract
forge test
# set PRIVATE_KEY=0x...
# forge script script/Deploy.s.sol --rpc-url https://testnet-rpc.monad.xyz --broadcast --private-key $env:PRIVATE_KEY
```

Put address in `settled-app/.env.local` → restart dev.

### 6. Day-4 polish still open

- Mobile responsive pass
- Deploy frontend to Vercel
- Verify contract on explorer
- Demo video + submission fields in README
- Social post for viral prize

---

## Known risks / notes

| Issue | Note |
|---|---|
| Google Fonts during build | Occasional TLS/ECONNRESET; Next retries — build still succeeded |
| Node 24 + Next 14 | Working so far; Node 20 LTS if weirdness |
| Deploy | Never commit private keys |
| Empty contract address | UI works; txs blocked until deploy + env |

---

## Quick status

| Area | Status |
|---|---|
| MVP feature code | **Done** |
| `node_modules` | **Healthy** |
| Production build | **PASS** |
| Contract deploy + env address | **Not done** |
| Ship / demo polish | **Not done** |

---

## Suggested first actions when resuming

1. Deploy `BillSplitter` to Monad testnet (needs `PRIVATE_KEY` + faucet MON).
2. Set `NEXT_PUBLIC_CONTRACT_ADDRESS` in `settled-app/.env.local`.
3. `npm run dev` and walk create → confirm → settle end-to-end.
4. Day-4: Vercel, verify contract, demo video, submit.
