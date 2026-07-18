# Settled

**Onchain receipts for shared crypto expenses.**

Create a bill, everyone confirms the split, settle in one transaction — permanent proof on [Monad Testnet](https://docs.monad.xyz).

**Live app:** [https://settled-six.vercel.app](https://settled-six.vercel.app)  
**Contract:** [`0x7c6976D0aBbbddfe1D4b0b4F98cf333e2EB9DB09`](https://testnet.monadvision.com/address/0x7c6976D0aBbbddfe1D4b0b4F98cf333e2EB9DB09)  
**GitHub:** [github.com/BOBBY-JUNIOR/Settled](https://github.com/BOBBY-JUNIOR/Settled)  
**Demo / X:** [x.com/i/status/2078502391947878636](https://x.com/i/status/2078502391947878636)  
**Submission:** [buildanything.so/showcase/billsplitter-caa8](https://buildanything.so/showcase/billsplitter-caa8)

---

## The problem

Splitting rent or utilities in crypto has no shared receipt:

- Transaction hashes get buried in chat
- Split percentages stay verbal
- “I already sent it” can’t be settled without explorer archaeology

## The solution

Settled turns a shared bill into a simple onchain flow:

```
Create bill → Everyone confirms → Settle in one tx → Permanent receipt
```

The contract holds the agreement. The chain holds the proof.

---

## Features

| Feature | Description |
|---|---|
| **Create bill** | Title, total in MON, 2–5 wallets, custom split % |
| **Share link** | `/bill/[id]` — participants open and connect |
| **Confirm** | Each listed wallet signs off onchain |
| **Settle** | Deposit total once; contract pays each share |
| **Receipt** | Settled state, amounts, explorer links |
| **Receipts tab** | List open + settled bills for your wallet |

---

## How it works

1. **Create** — enter title, amount, participants, and share percentages (must sum to 100%).
2. **Confirm** — share the bill link; each participant calls `confirm()`.
3. **Settle** — anyone deposits `totalAmount` MON; the contract distributes by share and marks the bill settled forever.

---

## Tech stack

| Layer | Stack |
|---|---|
| Contract | Solidity 0.8.24 + Foundry |
| Chain | Monad Testnet (`10143`) |
| App | Next.js 14, TypeScript, Tailwind |
| Wallet | wagmi v2 + viem |
| Hosting | Vercel |

### Monad Testnet

| Setting | Value |
|---|---|
| Chain ID | `10143` |
| Currency | MON |
| RPC | `https://testnet-rpc.monad.xyz` |
| Faucet | [faucet.monad.xyz](https://faucet.monad.xyz) |
| Explorer | [testnet.monadvision.com](https://testnet.monadvision.com) |

---

## Repository layout

```
Settled/
├── README.md
├── settled-contract/          # Foundry
│   ├── src/BillSplitter.sol
│   ├── test/BillSplitter.t.sol
│   └── script/Deploy.s.sol
└── settled-app/               # Next.js
    └── src/app/
        ├── page.tsx           # landing
        ├── create/page.tsx
        ├── bill/[id]/page.tsx
        └── receipts/page.tsx
```

---

## Smart contract

**`BillSplitter.sol`**

| Function | Role |
|---|---|
| `createBill(title, totalAmount, participants, shares)` | Create bill; shares in basis points (sum `10000`) |
| `confirm(billId)` | Participant signs off |
| `settle(billId)` payable | Requires full confirmation + `msg.value == totalAmount`; distributes payouts |
| `getBill` / `isConfirmed` / `isFullyConfirmed` / `nextBillId` | Views |

**Rules:** only listed participants can confirm; settle once; last participant gets rounding dust so the contract holds nothing.

**Tests:** `cd settled-contract && forge test` (11 tests).

---

## Run locally

### Prerequisites

- Node.js 18+
- [Foundry](https://book.getfoundry.sh/getting-started/installation) (for contract tests/deploy)
- MetaMask (or similar) + [testnet MON](https://faucet.monad.xyz)

### Frontend

```bash
cd settled-app
npm install
cp .env.example .env.local
```

```env
NEXT_PUBLIC_CONTRACT_ADDRESS=0x7c6976D0aBbbddfe1D4b0b4F98cf333e2EB9DB09
NEXT_PUBLIC_MONAD_RPC=https://testnet-rpc.monad.xyz
NEXT_PUBLIC_CHAIN_ID=10143
NEXT_PUBLIC_EXPLORER_URL=https://testnet.monadvision.com
```

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Contract

```bash
cd settled-contract
forge test
# deploy (set PRIVATE_KEY in settled-contract/.env — never commit it)
forge script script/Deploy.s.sol \
  --rpc-url https://testnet-rpc.monad.xyz \
  --broadcast \
  --private-key $PRIVATE_KEY
```

---

## Try it

1. Open the [live app](https://settled-six.vercel.app)
2. Connect a wallet on **Monad Testnet**
3. **Create a bill** with two addresses
4. Confirm from each wallet via the share link
5. **Settle** and open the receipt
6. Check **Receipts** for your open and settled bills

---

## License

MIT
