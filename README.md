# Harbor Presence — Operating dashboard

Dedicated repo target: **harbor-presence** (GitHub Pages).

**Live URL:** https://elephantharbor.github.io/harbor-presence/

Public-safe Cycle 4 operating view for Thomas. Plain English. No secrets. Snapshot is the only data source for the SPA.

## Local preview

```bash
cd /path/to/harbor-presence
python3 -m http.server 8080
```

Open http://localhost:8080 — `file://` will not load `data/snapshot.json` (fetch requires HTTP).

## GitHub Pages

1. Contents live at repo root on **main**.
2. Settings → Pages → Build from branch **main** → folder **/ (root)**.
3. Confirm https://elephantharbor.github.io/harbor-presence/

Do **not** invent followers, views, engagement, or experiments. Real metrics only; unknowns stay unknown. Empty `experiments[]` means none pre-registered — not a prompt to invent hindsight experiments.

## Portfolio tile

Wells updates portfolio `data/segments/presence.json` from `data/segment-summary.json` (contract fields: `mission`, `dashboardState`, `publicLinks`, headline metrics, lesson Experience→Evidence→Learning→Change, `needsHumanAction` genuine-only).

## Structure

```
index.html
static/styles.css
static/app.js
data/snapshot.json
data/segment-summary.json
README.md
```

Views: Overview · Content · Growth · Experiments · Channels · Lessons · Docs.

## Session log & lessons (Thomas standard, 2026-09-09)
- Every lesson needs `originationDate` (backfill if missing).
- After each material session, append to `data/session-log/presence.json` (mirrored on `snapshot.sessionLog`) and refresh the desk.
- Log tab on the desk; Wells owns shared UI conventions — Presence owns entry truth.

## Active Ventures (Thomas standard, 2026-09-11)
- Substantive live growth initiatives/experiments with measurable objectives — not every daily post.
- Canonical: `data/active-ventures/presence.json` (also `snapshot.activeVentures`).
- Wells owns shared UI; Presence owns truth. Ping Wells to mirror.
