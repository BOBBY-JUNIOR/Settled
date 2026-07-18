# Settled — Demo Video Plan & Voiceover

**Live app:** https://settled-six.vercel.app  
**GitHub:** https://github.com/BOBBY-JUNIOR/Settled  
**Contract:** `0x7c6976D0aBbbddfe1D4b0b4F98cf333e2EB9DB09`  
**Chain:** Monad Testnet (`10143`)

**Target length:** 2:15 – 2:45 (hard max 3:00)

---

## Tools

| Role | Options |
|---|---|
| Screen | Loom, OBS, Windows Game Bar |
| Voice | ElevenLabs, CapCut, Descript AI |
| Upload | YouTube (unlisted) or public Loom |

---

## Prep before recording

### Tabs to open

| Tab | URL |
|---|---|
| Live app | https://settled-six.vercel.app |
| Create | https://settled-six.vercel.app/create |
| Explorer (optional) | https://testnet.monadvision.com |

### Wallet prep

- [ ] Wallet A (creator) funded with testnet MON
- [ ] Wallet B (roommate) funded with testnet MON
- [ ] MetaMask on **Monad Testnet** (chain ID `10143`)
- [ ] Pre-create a **backup bill** and fully confirm both wallets (fallback if live create fails)

### Screen setup

- [ ] Browser zoom ~110% for readability
- [ ] Hide bookmarks bar
- [ ] Record 1080p
- [ ] Record screen **first without talking**, then drop AI VO and trim to match clicks

---

## Shot list

| # | Time | Screen | Action |
|---|---|---|---|
| 1 | 0:00–0:08 | Title card or landing | “Settled” / **Get settled.** |
| 2 | 0:08–0:28 | Landing only | Hold UI while problem VO plays (no clicking) |
| 3 | 0:28–0:40 | Landing → Create | Click **Create a bill** |
| 4 | 0:40–1:05 | Create form | Title “March rent”, amount, 2 wallets, 50/50 → submit → wallet confirm |
| 5 | 1:05–1:20 | Bill page | Show bill ID, total, **Copy share link** |
| 6 | 1:20–1:40 | Second wallet / browser | Open link → Connect → **Confirm bill** |
| 7 | 1:40–1:50 | Bill page | Both rows **Confirmed** |
| 8 | 1:50–2:15 | Settle | Click settle → approve MON → wait for success |
| 9 | 2:15–2:35 | Receipt | Scroll: title, total, payouts, tx link |
| 10 | 2:35–2:45 | End card | Live URL + GitHub on screen |

---

## Voice style (for AI)

- **Tone:** calm, clear, slightly personal — not salesy
- **Pace:** ~135 words/minute
- **Speed setting:** 0.95–1.0× if the model rushes
- **Pauses:** ~0.4s after “Just screenshots and trust.” and after the settle beat
- **Do not read aloud:** long wallet addresses or full contract hex — point on screen instead

---

## Timed voiceover script

### [0:00 – 0:08] Open

> Hi — I built Settled for a problem I actually have.

### [0:08 – 0:28] Problem

> Every month, my roommate and I split rent and utilities in crypto. And every month it’s the same fight: someone says “I already sent it,” the transaction hash is buried in Discord, and we spend twenty minutes digging through a block explorer.
>
> There’s no shared receipt. Just screenshots and trust.

### [0:28 – 0:42] Insight

> The issue isn’t sending money — it’s agreeing on the split and proving it afterward.
>
> So I built Settled: onchain receipts for shared expenses on Monad.

### [0:42 – 1:05] Create

> Here’s the flow. I create a bill — March rent, twelve MON, split fifty-fifty between me and Alex.
>
> I add both wallet addresses, set the shares, and hit create.
>
> That bill is stored onchain — not in a spreadsheet, not in a group chat.

### [1:05 – 1:25] Share & confirm

> Settled gives me a shareable link. I send it to Alex.
>
> He opens it, connects his wallet, and confirms the bill.
>
> Now both of us have signed off on the exact amount and the exact split. No ambiguity.

### [1:25 – 1:55] Settle

> Once everyone has confirmed, I deposit the total and hit settle.
>
> The contract distributes the funds automatically — fifty percent to each of us — in a single transaction.

### [1:55 – 2:20] Receipt

> And here’s the receipt: bill title, participants, amounts, transaction hash, timestamp.
>
> This lives onchain permanently. Next month, when someone asks “did you pay rent?” — I just send them this link.

### [2:20 – 2:40] Close

> Settled doesn’t try to be a bank or a DeFi protocol. It’s one thing done well: shared expenses with proof.
>
> Live app and GitHub are in the submission. Built for the Spark hackathon on Monad. Thanks.

---

## Paste-ready block (ElevenLabs / CapCut / Descript)

Copy everything below into your AI voice tool:

```
Hi — I built Settled for a problem I actually have.

Every month, my roommate and I split rent and utilities in crypto. And every month it’s the same fight: someone says “I already sent it,” the transaction hash is buried in Discord, and we spend twenty minutes digging through a block explorer. There’s no shared receipt. Just screenshots and trust.

The issue isn’t sending money — it’s agreeing on the split and proving it afterward. So I built Settled: onchain receipts for shared expenses on Monad.

Here’s the flow. I create a bill — March rent, twelve MON, split fifty-fifty between me and Alex. I add both wallet addresses, set the shares, and hit create. That bill is stored onchain — not in a spreadsheet, not in a group chat.

Settled gives me a shareable link. I send it to Alex. He opens it, connects his wallet, and confirms the bill. Now both of us have signed off on the exact amount and the exact split. No ambiguity.

Once everyone has confirmed, I deposit the total and hit settle. The contract distributes the funds automatically — fifty percent to each of us — in a single transaction.

And here’s the receipt: bill title, participants, amounts, transaction hash, timestamp. This lives onchain permanently. Next month, when someone asks “did you pay rent?” — I just send them this link.

Settled doesn’t try to be a bank or a DeFi protocol. It’s one thing done well: shared expenses with proof. Live app and GitHub are in the submission. Built for the Spark hackathon on Monad. Thanks.
```

---

## End card (on screen, not spoken)

```
Settled
https://settled-six.vercel.app
github.com/BOBBY-JUNIOR/Settled
Monad Testnet · Spark
```

---

## Recording checklist

- [ ] Two wallets funded with MON
- [ ] Backup bill already fully confirmed
- [ ] One clean take: create → confirm → settle → receipt
- [ ] Drop AI VO, cut dead air, export MP4
- [ ] Upload unlisted YouTube or public Loom
- [ ] Copy public video URL into Spark submission + README

---

## If something breaks mid-demo

1. Cut to the **backup bill** already in confirmed state  
2. Jump straight to **settle + receipt**  
3. Optional: flash explorer tx from a previous successful run  
4. Never apologize more than ~5 seconds — pivot to the receipt  

---

## Optional shorter cut (~90s for X/Twitter)

Use this paste block if you need a social clip:

```
I got tired of arguing with my roommate about who paid rent in crypto. Transaction hashes lost in Discord. “I already sent it.” Repeat.

So I built Settled — onchain receipts on Monad.

Create a bill. Everyone confirms. Settle in one transaction. Permanent proof.

No more arguments. Just a link.

Live: settled-six.vercel.app
```

---

## Submission fields (when video is ready)

| Field | Value |
|---|---|
| Project URL | https://settled-six.vercel.app |
| GitHub | https://github.com/BOBBY-JUNIOR/Settled |
| Contract | `0x7c6976D0aBbbddfe1D4b0b4F98cf333e2EB9DB09` |
| Demo video | _[paste YouTube/Loom URL]_ |
| Post URL | _[paste X post URL for viral prize]_ |
