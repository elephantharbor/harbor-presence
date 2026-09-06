/* Harbor Presence operating dashboard — read-only SPA */
(function () {
  "use strict";

  let SNAP = null;
  const app = document.getElementById("app");
  const nav = document.getElementById("nav");

  function esc(s) {
    return String(s ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function statusBadge(status) {
    const s = String(status || "");
    const key = s.toLowerCase().replace(/\s+/g, "-");
    const map = {
      operating: "badge-operating",
      building: "badge-building",
      researching: "badge-researching",
      "live-/-frozen": "badge-waiting",
      "live / frozen": "badge-waiting",
      frozen: "badge-paused",
      paused: "badge-paused",
      closed: "badge-closed",
    };
    const cls = map[key] || "badge-waiting";
    return `<span class="badge ${cls}">${esc(s)}</span>`;
  }

  function fmtUpdated(iso) {
    if (!iso) return "—";
    try {
      const d = new Date(iso);
      if (Number.isNaN(d.getTime())) return esc(iso);
      return d.toLocaleString("en-US", {
        timeZone: "America/Chicago",
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
        timeZoneName: "short",
      });
    } catch (_) {
      return esc(iso);
    }
  }

  function setActive(view) {
    nav.querySelectorAll("button").forEach((b) => {
      b.classList.toggle("active", b.dataset.view === view);
    });
  }

  function listItems(arr) {
    if (!arr || !arr.length) return `<p class="muted">None.</p>`;
    return `<ul class="list-plain">${arr.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>`;
  }


  function renderNextUp(s) {
    const nu = s.nextUp || {};
    const items = (nu.items || []).slice(0, 3);
    if (!items.length) {
      return `<div class="next-up empty" style="margin-top:10px"><div class="next-up-title">Next up</div><p class="next-up-empty">Nothing scheduled.</p></div>`;
    }
    const lis = items
      .map((it) => {
        const meta = [it.scheduleLabel, it.owner].filter(Boolean).map(esc).join(" · ");
        const when = it.nextRunAt ? fmtUpdated(it.nextRunAt) : "—";
        return `<li>
          <div class="nu-title">${esc(it.title || "—")}</div>
          <div class="nu-when">${esc(when)}</div>
          ${meta ? `<div class="nu-meta">${meta}</div>` : ""}
        </li>`;
      })
      .join("");
    return `<div class="next-up" style="margin-top:10px"><div class="next-up-title">Next up</div><p class="next-up-help">America/Chicago · refreshes after each routine run</p><ol>${lis}</ol></div>`;
  }

  function renderOverview(s) {
    const m = s.metrics || {};
    const attention = s.needsHumanAttention || [];
    let attentionHtml;
    if (!attention.length) {
      attentionHtml = `<div class="empty"><strong>Nothing needs your attention</strong>No genuine decisions, gates, or blockers right now.</div>`;
    } else {
      attentionHtml = `<ul class="list-plain">${attention.map((a) => `<li>${esc(a)}</li>`).join("")}</ul>`;
    }

    return `
      <h2 class="section-title">Overview</h2>
      <div class="card">
        <h2>Mission</h2>
        <p class="plain">${esc(s.mission)}</p>
      </div>
      <div class="kpi-row kpi-5">
        <div class="kpi"><div class="label">X followers</div><div class="val">${esc(m.xFollowers)}</div><div class="hint">Public count</div></div>
        <div class="kpi"><div class="label">Original views</div><div class="val">${esc(m.originalPostViews)}</div><div class="hint">Typical range so far</div></div>
        <div class="kpi"><div class="label">Reply reach</div><div class="val">${esc(m.replyReach)}</div><div class="hint">Busy-thread samples</div></div>
        <div class="kpi"><div class="label">Engagement</div><div class="val">${esc(m.likesRepliesReposts)}</div><div class="hint">Likes / replies / reposts</div></div>
        <div class="kpi"><div class="label">Public website</div><div class="val" style="font-size:15px">${esc(m.publicWebsite)}</div><div class="hint">Parent face only</div></div>
      </div>
      <div class="grid grid-2">
        <div class="card">
          <h2>Current objective</h2>
          <p class="plain">${esc(s.currentObjective)}</p>
        </div>
        <div class="card">
          <h2>Current status</h2>
          <p class="plain">${esc(s.currentStatus)}</p>
        </div>
      </div>
      <div class="card" style="margin-top:10px">
        <h2>Needs your attention</h2>
        <p class="dim" style="margin:0 0 8px;font-size:11px">Only genuine decisions, gates, or blockers — not routine activity.</p>
        ${attentionHtml}
      </div>
      ${renderNextUp(s)}
      <div class="callout info" style="margin-top:10px">
        <strong>Inputs vs outcomes.</strong> Posts, replies, and cadence are inputs. Followers, views, and engagement are outcomes. Do not confuse activity with growth.
      </div>
    `;
  }

  function renderContent(s) {
    const c = s.content || {};
    const originals = c.originals || [];
    const replies = c.replyExamples || [];
    let originalsHtml;
    if (originals.length) {
      originalsHtml = `<div class="table-wrap"><table class="data">
        <thead><tr><th>Date</th><th>Post</th><th>Link</th></tr></thead>
        <tbody>${originals
          .map(
            (o) => `<tr>
            <td>${esc(o.date)}</td>
            <td>${esc(o.title)}</td>
            <td><a href="${esc(o.url)}" target="_blank" rel="noopener noreferrer">Open</a></td>
          </tr>`
          )
          .join("")}</tbody></table></div>`;
    } else {
      originalsHtml = `<div class="empty"><strong>Detailed post log not published</strong>Original archive is not on this desk yet.</div>`;
    }

    return `
      <h2 class="section-title">Content</h2>
      <div class="callout info">Inputs are what we ship. Outcomes live on Growth — do not treat posting volume as success.</div>
      <div class="grid grid-2">
        <div class="card">
          <h2>Inputs</h2>
          ${listItems(c.inputs)}
        </div>
        <div class="card">
          <h2>Outcomes (summary)</h2>
          ${listItems(c.outcomes)}
        </div>
      </div>
      <div class="card" style="margin-top:10px">
        <h2>Originals (published)</h2>
        ${originalsHtml}
        <p class="dim" style="margin:8px 0 0;font-size:11px">${esc(c.note || "Detailed post-by-post archive not published on this desk yet.")}</p>
      </div>
      <div class="card" style="margin-top:10px">
        <h2>Selective replies (examples)</h2>
        ${
          replies.length
            ? listItems(replies)
            : `<p class="muted">No reply examples listed.</p>`
        }
        <p class="dim" style="margin:8px 0 0;font-size:11px">Examples only — not exhaustive. Prefer quality over volume; never reply purely for visibility.</p>
      </div>
    `;
  }

  function renderGrowth(s) {
    const g = s.growth || {};
    return `
      <h2 class="section-title">Growth</h2>
      <div class="card">
        <h2>Summary</h2>
        <p class="plain">${esc(g.summary)}</p>
      </div>
      <div class="kpi-row">
        <div class="kpi"><div class="label">Followers</div><div class="val">${esc(g.followers)}</div></div>
        <div class="kpi"><div class="label">Following</div><div class="val">${esc(g.following || "—")}</div></div>
        <div class="kpi"><div class="label">Original views</div><div class="val">${esc(g.originalViews)}</div></div>
        <div class="kpi"><div class="label">Reply views</div><div class="val">${esc(g.replyViews)}</div></div>
      </div>
      <div class="callout warn">
        <strong>Early sample.</strong> ${esc(g.observation || "Tiny early sample — do not overfit.")}
      </div>
      <div class="card">
        <h2>Analytics note</h2>
        <p class="plain muted">${esc(g.analyticsNote)}</p>
      </div>
      ${
        g.candidateNotStarted
          ? `<div class="card" style="margin-top:10px">
        <h2>Candidate (not started)</h2>
        <p class="plain">${esc(g.candidateNotStarted)}</p>
        <p class="dim" style="margin:8px 0 0;font-size:11px">Not an experiment — lives here until pre-registered. See Experiments for the empty formal list.</p>
      </div>`
          : ""
      }
    `;
  }

  function renderExperiments(s) {
    const ex = s.experiments || [];
    if (!ex.length) {
      return `
        <h2 class="section-title">Experiments</h2>
        <div class="empty">
          <strong>No pre-registered experiments</strong>
          Early activity is editorial learning, not labeled experiments. We are not inventing hindsight hypotheses onto past posts.
        </div>
        <div class="callout info">
          First real experiment should be hypothesis → change → measurement → result → conclusion → decision when baseline is enough. Candidate ideas (if any) appear under Growth — not here.
        </div>
      `;
    }
    const cards = ex
      .map(
        (e) => `<div class="ev-card">
        <h3 class="title" style="margin:0 0 4px;font-size:14px;font-weight:650">${esc(e.title || e.id || "Experiment")}</h3>
        <div class="step"><div class="k">Hypothesis</div><div class="v">${esc(e.hypothesis)}</div></div>
        <div class="step"><div class="k">Change</div><div class="v">${esc(e.change)}</div></div>
        <div class="step"><div class="k">Measurement</div><div class="v">${esc(e.measurement)}</div></div>
        <div class="step"><div class="k">Result</div><div class="v">${esc(e.result)}</div></div>
        <div class="step"><div class="k">Conclusion</div><div class="v">${esc(e.conclusion)}</div></div>
        <div class="step"><div class="k">Decision</div><div class="v">${esc(e.decision)}</div></div>
      </div>`
      )
      .join("");
    return `<h2 class="section-title">Experiments</h2><div class="stack">${cards}</div>`;
  }

  function renderChannels(s) {
    const channels = s.channels || [];
    const cards = channels
      .map(
        (ch) => `<div class="channel-card item-card">
        <div class="head">
          <h3 class="title">${esc(ch.name)}</h3>
          ${statusBadge(ch.status)}
          <a href="${esc(ch.url)}" target="_blank" rel="noopener noreferrer">${esc(ch.handle || ch.url)}</a>
        </div>
        <div class="meta-grid">
          <div class="k">Role</div><div class="v">${esc(ch.role)}</div>
          <div class="k">Cadence</div><div class="v">${esc(ch.cadence)}</div>
          <div class="k">Notes</div><div class="v">${esc(ch.notes)}</div>
        </div>
      </div>`
      )
      .join("");

    return `
      <h2 class="section-title">Channels</h2>
      <p class="dim" style="margin:0 0 10px;font-size:12px">Presence is not synonymous with X. Future surfaces (LinkedIn, Bluesky, newsletters, communities, …) can be added as cards without redesign.</p>
      <div class="stack">${cards || `<div class="empty"><strong>No channels listed</strong></div>`}</div>
    `;
  }

  function renderLessons(s) {
    const cards = (s.lessons || [])
      .map(
        (l) => `<div class="lesson">
        <div class="conclusion">${esc(l.learning)}</div>
        <div class="row"><div class="k">Experience</div><div class="v">${esc(l.experience)}</div></div>
        <div class="row"><div class="k">Evidence</div><div class="v">${esc(l.evidence)}</div></div>
        <div class="row"><div class="k">Learning</div><div class="v">${esc(l.learning)}</div></div>
        <div class="row"><div class="k">Change</div><div class="v">${esc(l.change)}</div></div>
      </div>`
      )
      .join("");
    return `
      <h2 class="section-title">Lessons</h2>
      <p class="dim" style="margin:0 0 10px;font-size:12px">Experience → Evidence → Learning → Change. Decision-relevant only.</p>
      <div class="stack">${cards || `<div class="empty"><strong>No lessons yet</strong></div>`}</div>
    `;
  }

  function renderDocs(s) {
    const d = s.docs || {};
    const how = (d.howItWorks || []).map((x) => `<li>${esc(x)}</li>`).join("");
    const team = (d.team || [])
      .map(
        (t) => `<tr><td><strong>${esc(t.name)}</strong></td><td>${esc(t.role)}</td><td>${esc(t.owns)}</td></tr>`
      )
      .join("");
    return `
      <h2 class="section-title">Docs</h2>
      <details class="doc-sec" open>
        <summary>How Harbor Presence works</summary>
        <ul>${how}</ul>
      </details>
      <details class="doc-sec" open>
        <summary>Team (Cycle 4)</summary>
        <div class="table-wrap">
          <table class="data">
            <thead><tr><th>Name</th><th>Role</th><th>Owns</th></tr></thead>
            <tbody>${team}</tbody>
          </table>
        </div>
      </details>
      <details class="doc-sec">
        <summary>Provenance</summary>
        <p class="plain muted">${esc(d.provenance)}</p>
      </details>
    `;
  }

  const VIEWS = {
    overview: renderOverview,
    content: renderContent,
    growth: renderGrowth,
    experiments: renderExperiments,
    channels: renderChannels,
    lessons: renderLessons,
    docs: renderDocs,
  };

  function show(view) {
    const fn = VIEWS[view] || VIEWS.overview;
    setActive(view);
    app.innerHTML = fn(SNAP);
    try {
      history.replaceState(null, "", "#" + view);
    } catch (_) {}
  }

  nav.addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-view]");
    if (!btn || !SNAP) return;
    show(btn.dataset.view);
  });

  async function boot() {
    try {
      const res = await fetch("data/snapshot.json", { cache: "no-store" });
      if (!res.ok) throw new Error("HTTP " + res.status);
      SNAP = await res.json();
      const el = document.getElementById("last-updated");
      if (el) el.textContent = "Updated " + fmtUpdated(SNAP.lastUpdated);
      const hash = (location.hash || "#overview").slice(1);
      show(VIEWS[hash] ? hash : "overview");
    } catch (err) {
      app.innerHTML = `<div class="error">Could not load snapshot.json (${esc(err.message)}). Serve this folder over HTTP (python3 -m http.server) — file:// will block fetch.</div>`;
    }
  }

  boot();
})();
