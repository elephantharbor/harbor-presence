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
