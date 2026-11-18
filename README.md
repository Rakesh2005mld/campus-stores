# Campus Stores — Product Engineering Practical Submission

## Overview & Where to Review Changes
All improvements are implemented directly inside the existing Campus Stores single-page application without altering its core layout or theme:
- **`app.js`**: Added cryptographic Laser-QR unit serialization, anti-swap return verification, 3-point accessory sign-off, `/` Omni-Search with predictive quick-matches, 1-click event kit checkout, club trust scores with automatic borrow holds, and per-unit audit logs.
- **`styles.css`**: Added styling for the inline verification panel, omni-search bar, filter pills, club trust cards, and printable `@media print` Laser-QR engraving sheet.

---

## Product Evaluation (Evidence from the Shift)

### 1. What the Product Handles Well
- **Per-unit slip accountability & request guardrails:** In `Loan register` and `Requests`, issuing one slip per physical unit (`L-401` for `MI-09`) prevents over-issuing beyond an approved form (`RQ-214`) or issuing equipment currently marked `In repair` (`PR-06`).
- **Cross-shift context in the Desk book:** When Kabir returns `PR-04` and `SP-02` on Friday at 7:30 pm while Leela keeps the adapter until Saturday 9:00 am, the Desk book preserves that handoff context for the morning shift.

### 2. What Needed to Change
- **Vulnerability to lookalike hardware swaps on partial returns:** Between Friday night and Saturday morning, a club member returning an adapter (`AD-12`, Belkin AVC002) could accidentally or intentionally hand back a similar unit (`AD-15`, Anker A8312) or miss accessories (velcro tie, cables), and the original desk could close the slip with a single unverified click.
- **High friction during peak counter pickups:** Issuing a 3-item kit (`RQ-214`) required filling out three separate forms, and finding specific units or slips across tabs required manual scanning.

---

## Decisions Made & How to Walk Through the Prototype

1. **Cryptographic Laser-QR Anti-Swap Verification (`Loan register` → `Verify & Return`):**
   - Each physical unit carries a deterministic signature (`UNIT:AD-12|SN:BLK-002-9914|SIG:...`) tied to its laser-etched serial number.
   - **Walkthrough:** Advance to **Saturday · 9:00 am**, click **Verify & Return** on `AD-12`, and click **Simulate Swapped / Old Adapter** to see the immediate **SWAP ALERT**. Click **Scan Authentic Laser-QR** (or use the live webcam scanner), check off the laser engraving location and "What's in the box" accessories, and close the slip.
2. **1-Click Event Kit Checkout & Handover Gate-Pass (`Requests` → `RQ-214`):**
   - Groups approved items into a single serialized checkout action that generates a 4-digit Open-Box Handover PIN and exit gate-pass while still logging individual slips per unit.
3. **Instant Omni-Search (`/` Shortcut), Filter Pills & Printable Laser-Tags (`Inventory`):**
   - Press `/` from anywhere to filter units or slips in real time by Unit ID (`AD-12`), serial (`BLK-002`), model, or borrower name, inspect per-unit **Audit logs**, or open **Printable Laser-Tags**.
4. **Club Trust Scores & Auto-Hold (`Requests`):**
   - Tracks on-time returns, overdue items, and swap/damage flags per club, automatically placing clubs with unresolved flags or overdue gear on borrow hold until cleared.

---

## Real-Counter Observation Metric
To verify whether this change helps at an actual campus equipment counter, observe **two metrics across 50 consecutive shift handoffs**:
1. **Discrepancy & swap rate at shift reconciliation:** Whether mismatched serial numbers or missing accessories (cables, SD cards, ties) drop to near zero compared to unverified check-ins.
2. **Median counter transaction time (seconds):** Whether 1-click kit checkout and `/` Omni-Search offset the added seconds spent scanning the Laser-QR during return check-in.