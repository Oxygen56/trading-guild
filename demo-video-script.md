# Demo Video Script — Casper Autonomous Trading Guild

> **Target length:** 4 minutes (range: 3–5 min)
> **Language:** English narration, bilingual subtitles (EN/CN optional)
> **Recording:** Screen capture at 1080p 30fps + voiceover
> **Export:** MP4 (H.264), 1080p, stereo audio

---

## Video Structure (6 Segments)

```
[0:00–0:25]  Segment 1: Hook & Problem
[0:25–1:00]  Segment 2: Dashboard & Architecture
[1:00–2:15]  Segment 3: Strategy → Risk Audit → Execution (Happy Path)
[2:15–3:00]  Segment 4: Risk Rejection & Agent Economy
[3:00–3:45]  Segment 5: Analytics & Transparency
[3:45–4:00]  Segment 6: Closing & Call to Action
```

---

## Segment 1: Hook & Problem (0:00–0:25)

### Visual
- Fade in from black
- Show a split screen: left side = stressed human trader staring at 6 monitors; right side = Trading Guild logo with three agent avatars (Purple/Athena, Gold/Guardian, Cyan/Mercury) pulsing with activity
- Text overlay appears word by word:

### Narration
> "DeFi trading is exhausting. You watch markets 24/7. You second-guess every trade. You're the strategist, the risk manager, and the executor — all at once.
>
> What if you didn't have to be?
>
> What if AI agents could do it all — collaborate, pay each other, and trade autonomously — with every decision verifiable on-chain?
>
> This is the Casper Autonomous Trading Guild."

### Transition
- Split screen collapses into the Trading Guild logo
- Zoom into the Dashboard view

---

## Segment 2: Dashboard & Architecture (0:25–1:00)

### Visual
- Show the Guild Dashboard (dark theme, emerald accents)
- Mouse cursor moves across the UI pointing out elements as narrated
- Animated architecture diagram overlays at ~0:40

### Narration
> "Here's the Guild Dashboard. At a glance, you see the vault — currently holding 50,000 CSPR in managed assets. Three AI agents are live and active.
>
> Athena — the Strategy Agent — scans markets and proposes trades.
> Guardian — the Risk Agent — audits every strategy before execution.
> Mercury — the Execution Agent — executes approved trades on-chain.
>
> These aren't just chatbots. They're autonomous economic actors — each with their own wallet, their own pricing, and their own reputation at stake.
>
> Let me show you how they work together."

### Key UI Elements to Show
1. VaultOverview stat cards (TVL, 24h PnL, active strategies, agent count)
2. AgentList grid (3 agent cards with status indicators)
3. RecentActivity timeline (scrolling trade history)

### Transition
- Click on "Terminal" in the sidebar
- Screen transitions to the AI Chat Terminal

---

## Segment 3: Strategy → Risk → Execution (1:00–2:15)

### Visual
- Chat Terminal: user types a natural language command
- Show the message being sent
- Split into three panels showing each agent's processing in sequence
- Transaction flow diagram animates at the bottom

### Narration
> "Here's the core flow. I type a simple instruction in the Terminal:
>
> 'Find the best yield opportunity on CSPR.trade under 5% slippage.'
>
> Athena — the Strategy Agent — scans CSPR.trade's liquidity pools. It finds the CSPR-USDT pool: $2.1 million in TVL, 35% APY. Athena generates a swap strategy — 5,000 CSPR into USDT, expected 2.3% gain after fees.
>
> But before any money moves, Athena must get approval. It sends the strategy to Guardian, the Risk Agent — and pays for the audit via x402. That's 0.005 CSPR, settled on-chain. No API keys, no subscription — just a direct agent-to-agent payment.
>
> Guardian runs a 6-dimension risk check: token security, liquidity depth, slippage simulation, pool concentration, historical volatility, and recent activity. Score: 8 out of 100. Low risk. Approved.
>
> Athena now pays Mercury — the Execution Agent — 0.01 CSPR to execute the trade. Mercury calls CSPR.trade's DEX via the MCP protocol, submits the swap, and returns a transaction hash. Confirmed on Casper Testnet.
>
> From natural language to on-chain trade — no human intervention beyond the initial request."

### Key UI Elements to Show
1. Chat Terminal: user input bubbles and agent response bubbles (color-coded by agent)
2. AgentStatusBar: showing agent state transitions (IDLE → PROCESSING → DONE)
3. Strategy card expanding to show audit trail
4. On-chain transaction link appearing with Casper Testnet explorer URL

### Transition
- Screen focuses on the payment ledger
- Overlay: "What happens when a strategy is too risky?"

---

## Segment 4: Risk Rejection & Agent Economy (2:15–3:00)

### Visual
- Another Terminal input
- Guardian's risk assessment panel — red indicators, score climbing above 50
- Payment ledger showing audit fee earned but strategy rejected
- Treasury remains unchanged (highlight with green border pulse)

### Narration
> "Not every strategy passes. Here, I ask Athena to analyze a newly listed token — and Guardian catches the red flags.
>
> The token has a 90% sell tax, the liquidity pool was created 2 hours ago, and the deployer wallet funded it from a mixer. Guardian scores this 51 out of 100 — above the rejection threshold.
>
> Result: the strategy is blocked. The 0.005 CSPR audit fee is still paid — Guardian earned it for doing its job — but zero guild capital was put at risk.
>
> This is the key innovation: agents have skin in the game. Guardian gets paid more when it saves the guild from bad trades. Mercury earns fees proportional to successful executions. Every agent's economic incentive aligns with the guild's performance."

### Key UI Elements to Show
1. Strategy card with REJECTED status badge (red)
2. Risk audit breakdown panel (6 factors with scores)
3. Payment ledger entry: "audit: 0.005 CSPR | result: rejected"
4. Vault balance: unchanged (green confirmation)

### Transition
- Click on "Analytics" in the sidebar
- Dashboard transitions to the Analytics page

---

## Segment 5: Analytics & Transparency (3:00–3:45)

### Visual
- PnL chart animating (Recharts composed chart — profit bars in green, loss bars in red, cumulative line in emerald)
- Scroll to AgentPerformanceTable
- Highlight distribution rounds

### Narration
> "Every decision, every payment, every trade — fully transparent on the Analytics page.
>
> The PnL chart tracks guild performance over time. You can see exactly which strategies generated profit and which ones cost money.
>
> The Agent Performance table shows each agent's track record: strategies proposed, approved, executed — and most importantly, profit generated. This isn't just a dashboard — it's a reputation system. Better agents earn more trust and more capital allocation.
>
> Profit distribution is algorithmic. When the guild closes a profitable position, earnings flow back to the vault and are distributed proportionally to each agent's contribution weight. All on-chain. All auditable.
>
> This is what an all-agent company looks like."

### Key UI Elements to Show
1. PnLChart: profit bars, loss bars, cumulative line
2. AgentPerformanceTable: sortable columns (profit, approval rate, strategies, distribution share)
3. DistributionHistory: round-by-round breakdown

### Transition
- Fade to black
- Trading Guild logo fades in

---

## Segment 6: Closing & Call to Action (3:45–4:00)

### Visual
- Trading Guild logo centered
- Three agent avatars orbiting the logo (Athena purple, Guardian gold, Mercury cyan)
- Text overlays:
  - "Built with Casper AI Toolkit"
  - "x402 · MCP · Odra · CSPR.cloud"
  - "Open source on GitHub"
- Fade to black

### Narration
> "Casper Autonomous Trading Guild. A glimpse of the agentic economy — where AI agents don't just assist humans, they transact, collaborate, and create value on their own.
>
> Built entirely on Casper's AI Toolkit: x402 for agent payments, MCP for tool integration, Odra for smart contracts, and CSPR.cloud for on-chain data.
>
> The code is open source. The architecture is extensible. This is just the beginning.
>
> Thank you for watching."

### Transition
- End screen: GitHub URL + team name
- Fade out

---

## Recording Checklist

### Before Recording
- [ ] All agents running (`npm run demo` successful)
- [ ] Frontend running (`npm run dev` in frontend/)
- [ ] Mock mode enabled for clean demo (`NEXT_PUBLIC_CASPER_USE_MOCK=true`)
- [ ] Browser window sized to 1920×1080
- [ ] Browser extensions hidden, bookmarks bar off
- [ ] Terminal window hidden (or positioned off-screen)
- [ ] Dark mode confirmed (macOS + browser)
- [ ] Test recording: audio levels, screen resolution, frame rate

### During Recording
- [ ] Speak slowly and clearly (target ~140 words/minute)
- [ ] Pause briefly between segments for editing flexibility
- [ ] Move mouse deliberately — no jitter
- [ ] If you stumble, pause 2 seconds and restart the sentence (easier to edit)
- [ ] Keep the cursor visible on elements being described

### After Recording
- [ ] Trim silences and retakes
- [ ] Add intro/outro title cards
- [ ] Add architecture diagram overlay at Segment 2
- [ ] Add agent payment flow overlay at Segment 3
- [ ] Burn subtitles (English required, Chinese optional)
- [ ] Export: 1080p MP4 (H.264), AAC 192kbps audio

### Upload
- [ ] Upload to YouTube (unlisted or public)
- [ ] Upload mirror to Bilibili (for Chinese judges)
- [ ] Add links to README.md

---

## Tools for Recording

| Tool | Platform | Use |
|------|----------|-----|
| OBS Studio | Mac/Windows/Linux | Screen + audio capture (free, open source) |
| QuickTime Player | Mac | Built-in screen recorder (basic, no overlay support) |
| DaVinci Resolve | Mac/Windows/Linux | Video editing (free version is full-featured) |
| iMovie | Mac | Simple editing if no complex overlays needed |
| CapCut | All platforms | Quick edits, auto-subtitles (free tier available) |

---

## Narration Notes

- **Pace:** Calm and confident. Not rushed. This is a technical demo, not a pitch competition.
- **Pause:** After each major UI transition — let the viewer absorb what they're seeing.
- **Emphasis on innovation:** When mentioning x402 payments or agent-to-agent economy, slow down slightly. These are the novel concepts.
- **Pronunciation:**
  - "Casper" = "CASS-per" (not "CASE-per")
  - "x402" = "ex four-oh-two"
  - "Athena" / "Guardian" / "Mercury" — standard English pronunciation
  - "Odra" = "OH-drah"
