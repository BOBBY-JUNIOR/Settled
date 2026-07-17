# Settled

**Onchain shared-expense receipts for people who pay each other in crypto.**

> *"We stopped arguing about who sent rent. Now there's a receipt on Monad that can't be disputed."*

---

## Table of Contents

1. [Hackathon Submission](#hackathon-submission)
2. [Demo Speech Script](#demo-speech-script)
3. [Demo Video Shot List](#demo-video-shot-list)
4. [Live Demo Runbook](#live-demo-runbook)
5. [The Problem & Solution](#the-problem--solution)
6. [Product Scope (MVP)](#product-scope-mvp)
7. [Tech Stack](#tech-stack)
8. [Build Plan](#build-plan)
9. [Smart Contract Spec](#smart-contract-spec)
10. [UI Design System](#ui-design-system)
11. [Project Setup](#project-setup)
12. [Submission Checklist](#submission-checklist)
13. [Social Post Draft](#social-post-draft)

---

## Hackathon Submission

| Field | Value |
|---|---|
| **Hackathon** | [Spark · Build Anything](https://buildanything.so/hackathons/spark) |
| **Name** | Settled |
| **Description** | Onchain receipts for shared crypto expenses |
| **Problem** | Splitting rent/utilities in crypto has no shared receipt — hashes get lost in chat and splits stay verbal |
| **Solution** | Create a bill onchain, everyone confirms the split, settle in one tx, keep a permanent receipt on Monad |
| **Category** | Monad Testnet |
| **Project URL** | _[Add Vercel URL after deploy]_ |
| **GitHub** | _[Add public repo URL]_ |
| **Contract Address** | _[Add after deploy to Monad testnet]_ |
| **Demo Video** | _[Add public YouTube/Loom URL, max 3 min]_ |
| **Post URL** | _[Add X/Twitter post URL — required for viral prize]_ |

| | |
|---|---|
| **Dates** | Jul 13, 2026 1:00 PM UTC → Jul 19, 2026 11:59 PM UTC |
| **Deadline** | Jul 19, 2026 · 11:59 PM UTC |
| **Format** | Solo hackathon (teams not allowed) |
| **Prize pool** | $2,000 total — 3× $500 winners + $500 most viral solution |

---

## Demo Speech Script

**Target length:** 2 minutes 30 seconds  
**Tone:** Calm, personal, confident — not salesy. Speak like you're explaining this to a friend who splits rent with you.

---

### [0:00 – 0:25] The Problem

> "Hey — I'm [your name], and I built Settled for a problem I actually have.
>
> Every month, my roommate and I split rent and utilities. We pay in crypto. And every single month, the same thing happens: someone says *'I already sent it,'* someone else can't find the transaction hash in Discord, and we end up in a 20-minute back-and-forth trying to figure out who owes what.
>
> There's no receipt. There's no single source of truth. Just screenshots and trust."

---

### [0:25 – 0:40] The Insight

> "I realized the issue isn't sending money — it's proving you sent it, and agreeing on the split *before* anyone pays.
>
> So I built Settled: a simple way to create a shared bill, have everyone confirm it onchain, and settle it in one transaction. When it's done, you have a permanent receipt on Monad that nobody can argue with."

---

### [0:40 – 1:10] Create a Bill *(screen: landing → create form)*

> "Let me show you. I'm creating a bill for March rent — twelve hundred dollars, split fifty-fifty between me and my roommate Alex.
>
> I enter the title, the total, our wallet addresses, and the split percentages. I hit create — and that bill is now stored onchain. Not in a spreadsheet. Not in a group chat. On Monad."

**Action:** Fill form → submit → show tx confirming on explorer (optional quick flash)

---

### [1:10 – 1:35] Share & Confirm *(screen: bill detail page)*

> "Settled gives me a shareable link. I send it to Alex. He opens it, connects his wallet, and confirms the bill.
>
> You can see my row is confirmed, his row is confirmed. Both of us have now signed off on the exact amount and the exact split. No ambiguity."

**Action:** Show status chips updating → both rows green / confirmed

---

### [1:35 – 2:05] Settle *(screen: settle button → wallet popup → receipt)*

> "Once everyone's confirmed, I deposit the total into the contract and hit settle. The contract distributes the funds automatically — fifty percent to me, fifty percent to Alex — in a single transaction.
>
> And here's the receipt: bill title, participants, amounts, transaction hashes, timestamps. This lives onchain permanently. Next month, when someone asks *'did you pay rent?'* — I just send them this link."

**Action:** Click Settle → approve tx → show receipt page with hashes

---

### [2:05 – 2:30] Close

> "Settled doesn't try to be a bank, a DAO, or a DeFi protocol. It's one thing done well: shared expenses with proof.
>
> I built it because I was tired of arguing with my roommate. If you've ever lost a transaction hash in a Discord scroll, this is for you.
>
> Thanks — repo and live app are in the submission. I'd love your feedback."

---

### Speech Tips

- **Pace:** ~130 words/minute. Don't rush the problem setup — judges need to feel it.
- **Pause** for 1 second after "permanent receipt on Monad" — that's the money line.
- **Don't read** wallet addresses aloud. Point at the screen instead.
- **Record audio separately** if live screen recording is noisy, then sync in editing.
- **Total word count:** ~340 words → fits comfortably in 2:30 at natural pace.

---

## Demo Video Shot List

Use this as a recording checklist. Total runtime target: **2:00 – 2:45** (hard max: **3:00**).

| # | Time | Shot | What to show |
|---|---|---|---|
| 1 | 0:00 | Face cam or title card | "Settled — onchain expense receipts" |
| 2 | 0:05 | Talking head or voiceover | Problem script (0:00–0:25) |
| 3 | 0:25 | App: landing page | Clean UI, one CTA: "Create a bill" |
| 4 | 0:40 | App: `/create` form | Fill title, amount, 2 wallets, 50/50 |
| 5 | 0:55 | Wallet popup | Confirm `createBill` transaction |
| 6 | 1:05 | App: `/bill/[id]` | Pending state, share link visible |
| 7 | 1:15 | Second wallet (or tab) | Connect → Confirm |
| 8 | 1:25 | App: bill page | Both participants confirmed |
| 9 | 1:35 | Wallet popup | Settle with correct MON amount |
| 10 | 1:50 | App: receipt section | Tx hashes, explorer links, settled badge |
| 11 | 2:05 | Talking head or end card | Close script + GitHub / live URL |

**Recording tools:** Loom, OBS, or QuickTime. Upload to YouTube (unlisted is fine) or a public Loom link.

---

## Live Demo Runbook

If judges or DevRel ask for a live walkthrough at submission review:

### Before the demo (5 min prep)

- [ ] Two wallets funded with Monad testnet MON ([faucet](https://faucet.monad.xyz))
- [ ] Contract deployed and address in `.env.local`
- [ ] App open at production URL (not localhost)
- [ ] Pre-create a **backup bill** in case live create fails
- [ ] Explorer tab open: [testnet.monadvision.com](https://testnet.monadvision.com) or [testnet.monadexplorer.com](https://testnet.monadexplorer.com)

### During the demo (3 min max)

1. **30 sec** — State the problem (use script 0:00–0:25)
2. **60 sec** — Create bill OR open pre-created bill
3. **45 sec** — Confirm from second wallet
4. **45 sec** — Settle and show receipt
5. **20 sec** — "One feature, fully onchain, solves my actual problem"

### If something breaks

- Fall back to the **backup bill** already in "confirmed" state — jump straight to settle
- Show the **explorer** transaction from a previous successful run
- Never apologize for more than 5 seconds — pivot to the receipt

---

## The Problem & Solution

### Problem

Splitting shared expenses in crypto has no standard receipt:

- Transaction hashes get buried in chat
- Split percentages are agreed verbally, not verifiably
- "I already sent it" is impossible to settle without block explorer archaeology
- Spreadsheets don't connect to actual onchain payments

### Solution

**Settled** turns a shared bill into a three-step onchain workflow:

```
Create bill → Everyone confirms → Settle in one tx → Permanent receipt
```

The contract holds the agreement. The chain holds the proof.

---

## Product Scope (MVP)

Build **only** this. One real feature beats five fake ones.

| Feature | Description |
|---|---|
| Create bill | Title, total amount, 2–5 wallets, custom split % |
| Share link | `/bill/[id]` — participants open and connect wallet |
| Confirm | Each participant calls `confirm()` onchain |
| Settle & receipt | Deposit MON, auto-distribute, show tx record |

**Out of scope for hackathon:** notifications, ENS, history dashboard, multi-chain, ERC-20 token support.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Smart contract | Solidity + Foundry |
| Chain | Monad Testnet (chain ID `10143`) |
| Frontend | Next.js 14 (App Router) + TypeScript |
| Web3 | wagmi v2 + viem |
| Styling | Tailwind CSS (custom design tokens) |
| Hosting | Vercel |
| Deploy skill | [Monskills](https://buildanything.so/hackathons/spark) (optional, for coding agents) |

### Monad Testnet network

| Setting | Value |
|---|---|
| Network name | Monad Testnet |
| Chain ID | `10143` |
| Currency | MON |
| Public RPC | `https://testnet-rpc.monad.xyz` |
| Faucet | [faucet.monad.xyz](https://faucet.monad.xyz) |
| Explorer | [testnet.monadvision.com](https://testnet.monadvision.com) · [testnet.monadexplorer.com](https://testnet.monadexplorer.com) |

**Docs:**

- [Deploy a smart contract](https://docs.monad.xyz/guides/deploy-smart-contract/index)
- [Deploy with Foundry](https://docs.monad.xyz/guides/deploy-smart-contract/foundry)
- [Verify a smart contract](https://docs.monad.xyz/guides/verify-smart-contract/index)
- [Network information](https://docs.monad.xyz/developer-essentials/testnets)

---

## Build Plan

Hackathon window: **Jul 13 – Jul 19, 2026**. Suggested 5-day ship plan (adjust to when you start):

### Day 1 — Contract + design foundation
- Scaffold Foundry project (`settled-contract/`)
- Write `BillSplitter.sol` + tests
- Deploy to Monad testnet
- Scaffold Next.js (`settled-app/`) with fonts and color tokens
- Commit: `feat: add BillSplitter contract`

### Day 2 — Create flow
- Create bill form UI
- Wire `createBill` contract call
- Bill detail page (read contract state)
- Commit: `feat: create bill flow`

### Day 3 — Confirm + settle
- `confirm()` for participants
- `settle()` with MON deposit + distribution
- Receipt view with explorer links
- Share link copy button
- Commit: `feat: confirm and settle`

### Day 4 — Polish + ship
- Loading and error states (real, not toast-only)
- Mobile responsive pass
- README finalized, demo video recorded
- Deploy frontend to Vercel
- Verify contract on Monad explorer
- Submit + social post

### Day 5 — Buffer + submit before 11:59 PM UTC on Jul 19

---

## Smart Contract Spec

**File:** `settled-contract/src/BillSplitter.sol`

```solidity
struct Bill {
    address creator;
    string title;
    uint256 totalAmount;
    address[] participants;
    uint256[] shares;        // basis points, must sum to 10000
    mapping(address => bool) confirmed;
    bool settled;
}

function createBill(
    string calldata title,
    uint256 totalAmount,
    address[] calldata participants,
    uint256[] calldata shares
) external returns (uint256 billId);

function confirm(uint256 billId) external;
function settle(uint256 billId) external payable;

function getBill(uint256 billId) external view returns (
    address creator,
    string memory title,
    uint256 totalAmount,
    address[] memory participants,
    uint256[] memory shares,
    bool settled
);

function isFullyConfirmed(uint256 billId) external view returns (bool);
function isConfirmed(uint256 billId, address participant) external view returns (bool);
```

**Rules:**
- Only listed participants can `confirm()`
- `settle()` requires all confirmed + `msg.value == totalAmount`
- Distribution: `amount * shares[i] / 10000` per participant
- Events: `BillCreated`, `BillConfirmed`, `BillSettled`

**Tests to write:**
- Happy path: create → confirm all → settle → correct balances
- Revert if wrong participant confirms
- Revert if settle before all confirmed
- Revert if `msg.value` does not match total
- Revert if shares do not sum to 10000
- Revert if settle is called twice

---

## UI Design System

Designed to look like a **quiet fintech app**, not a generic Web3 template.

### Tokens

| Token | Value |
|---|---|
| Background | `#FAFAF8` |
| Text primary | `#1A1A1A` |
| Text secondary | `#6B6B6B` |
| Accent | `#2D5A3D` (forest green) |
| Border | `#E8E8E4` |
| Font heading | Instrument Serif |
| Font body | IBM Plex Sans |
| Font mono | IBM Plex Mono (amounts, addresses) |
| Max width | `480px` centered |
| Border radius | `8px` cards, `6px` buttons |

### Anti-patterns (do NOT use)

- Purple/blue gradients
- Glassmorphism cards
- 6-feature icon grid on landing
- "Powered by Web3" hero
- Generic shadcn default theme
- Lorem ipsum or placeholder data
- Success toasts without real contract state behind them

### Landing page copy

**Headline:** Get settled.  
**Subhead:** Onchain receipts for shared expenses. Create a bill, everyone confirms, settle once.  
**CTA:** Create a bill  
**Empty state:** "No bills yet. Create one before your roommate asks again."

---

## Project Setup

### Prerequisites

- Node.js 18+
- Foundry ([install guide](https://book.getfoundry.sh/getting-started/installation))
  - macOS/Linux: `curl -L https://foundry.paradigm.xyz | bash && foundryup`
  - Windows: use WSL2 or the [Foundry Windows instructions](https://book.getfoundry.sh/getting-started/installation)
- Monad testnet MON from the [faucet](https://faucet.monad.xyz)
- Wallet (MetaMask or compatible) with Monad Testnet added

### Repository structure (target)

```
Settled/
├── README.md                 ← this file
├── settled-contract/         ← Foundry project
│   ├── src/BillSplitter.sol
│   ├── test/BillSplitter.t.sol
│   └── script/Deploy.s.sol
└── settled-app/              ← Next.js frontend
    ├── src/app/
    │   ├── page.tsx          ← landing
    │   ├── create/page.tsx   ← create bill
    │   └── bill/[id]/page.tsx← bill detail + receipt
    └── .env.example
```

### Contract setup

```bash
cd settled-contract
forge init . --force   # if starting fresh inside folder
forge test
forge script script/Deploy.s.sol \
  --rpc-url https://testnet-rpc.monad.xyz \
  --broadcast \
  --private-key $PRIVATE_KEY
```

### Frontend setup

```bash
cd settled-app
npm install
cp .env.example .env.local
# Fill in values from the env section below
npm run dev
```

### Environment variables

```env
# settled-app/.env.local
NEXT_PUBLIC_CONTRACT_ADDRESS=0x...
NEXT_PUBLIC_MONAD_RPC=https://testnet-rpc.monad.xyz
NEXT_PUBLIC_CHAIN_ID=10143
NEXT_PUBLIC_EXPLORER_URL=https://testnet.monadvision.com
```

```env
# settled-contract/.env (never commit)
PRIVATE_KEY=0x...
MONAD_TESTNET_RPC=https://testnet-rpc.monad.xyz
```

### Deploy frontend

```bash
cd settled-app
npm run build
# Deploy to Vercel — connect the public GitHub repo, add env vars in the dashboard
```

---

## Submission Checklist

### Before you submit

- [ ] App is live at a public URL (not localhost)
- [ ] GitHub repo is public with clean, incremental commit history
- [ ] Contract deployed on Monad testnet
- [ ] Contract verified on explorer
- [ ] Demo video ≤ 3 minutes, publicly accessible
- [ ] All buttons do real onchain actions (judges click twice)
- [ ] README has setup instructions a stranger can follow
- [ ] No placeholder or hardcoded success data
- [ ] Social post published (required for viral prize)
- [ ] Submission fields filled: Name, Description, Problem, Solution, Project URL, GitHub, Category, Contract address, Demo video, Post URL

### Submit at

[https://buildanything.so/hackathons/spark](https://buildanything.so/hackathons/spark)

### What wins

| Criteria | How Settled delivers |
|---|---|
| Personal problem | Rent/utility splits with roommates — relatable in 10 sec |
| Elegant solution | One contract, three write functions, one UI flow |
| Real onchain | create → confirm → settle, all on Monad testnet |
| Clean UI | Fintech aesthetic, not AI template |
| No vaporware | Every button triggers a real transaction |
| Good repo hygiene | Incremental commits, clear README |

### What judges reject

- AI slop UI (generic gradients, template identity)
- Tutorial-level demos with no personal problem
- Mystery-box repos (no README, one giant commit)
- Vaporware (success toast with no chain state)

---

## Social Post Draft

**For the "Most viral solution" prize ($500).** Post on X/Twitter with a screen recording or demo video clip. **Post URL is a required submission field** for this prize.

---

**Option A — Story hook**

> Every month my roommate and I argue about who paid rent in crypto.
>
> Transaction hashes lost in Discord. "I already sent it." Repeat.
>
> So I built Settled for the @buildanythingso Spark hackathon — onchain receipts on @monad.
>
> Create a bill → everyone confirms → settle in one tx → permanent proof.
>
> No more arguments. Just a link.
>
> 🔗 [live app URL]
> 📹 [demo video URL]
>
> #Monad #SparkHackathon #BuildInPublic

---

**Option B — Build in public thread**

> 🧵 I got tired of losing crypto payment receipts in group chats. So I'm building Settled.
>
> 1/ The problem: splitting rent in crypto with no proof
> 2/ The fix: onchain bill → confirm → settle → receipt forever
> 3/ Built on @monad testnet for the @buildanythingso Spark hackathon
> 4/ One feature. Fully working. Judges can click it twice.
>
> Live demo: [URL]
> Repo: [GitHub URL]

---

**Post timing:** Publish once the settle flow works end-to-end. Quote-tweet or reply with the demo clip when the video is ready.

---

## License

MIT

---

*Built for [Spark · Build Anything](https://buildanything.so/hackathons/spark) — Jul 13–19, 2026*
