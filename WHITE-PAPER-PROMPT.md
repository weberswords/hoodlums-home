# Kickoff prompt — Classroom OS white paper (paste into a new conversation)

---

I want to write the **Classroom OS white paper** for The Intelligent Hoodlums.
Work on branch **`claude/magical-clarke-19H9A`** — it already has the retrospective
`/classroom-os` page and all the source notes.

**Start by reading these files on that branch:**
- `WHITE-PAPER-NOTES.md` — running notes: pedagogy, full Pulse Check data, the
  voice principle, the thesis line, theorist citations to confirm, gating plan
- `CONTENT-TIERING.md` — what belongs in the white paper vs the public page vs the
  paid PD. The paper is the "what + why, in depth" tier.
- `FACILITATOR-REFLECTIONS.md` — Webs' raw first-person reflections from the week
- `TESTIMONIALS.md` — released participant testimonials
- `classroom-os.html` + `styles.css` — the public retrospective page (the
  appetizer) and our design system

**Context & goals:**
- The white paper is the gated "meal" in our funnel. `/classroom-os` is the
  appetizer; the paper goes deeper and justifies budget. **Audience: school /
  district administrators deciding whether to spend PD budget.**
- It will be **gated behind a self-built form** (our own mini-CRM: static HTML
  form → Google Apps Script → Google Sheet, matching `/release`, `/survey`,
  `/for-the-record`). The form build may be a separate task — focus on the paper
  content first, but keep gating in mind.
- **Voice principle (non-negotiable):** the teacher is the hero. Meet them where
  they are. They arrive as experts on their own context; the program gives their
  expertise new range — it does not supply it. Never denigrate, no "well, duh."
- **Tiering:** the paper should carry what we deliberately HELD BACK from the
  public page — the framework architecture and *why* it's sequenced, the theory
  and *how* it's interleaved, the full Pulse methodology + Monday→Friday data, the
  human → analog → digital "right tool for the job" method, the full (anonymized)
  case study. But do NOT make it a runnable playbook — hold templates, exact
  prompts, "Slopped" mechanics, and facilitation moves for the paid room. A reader
  should finish thinking *"this is rigorous and I want it,"* not *"I can run this
  myself Monday."*
- **Brand:** build on the existing design system (Avocado Sans; Ink / Bone /
  Rufous / Tuscany palette; tokens in `styles.css`). If the paper is a web page,
  reuse those tokens.

**Confirm before printing:** the theorist citations — cognitive load (Sweller?),
Chi, Schlechty — with real sources. Don't print a name we haven't verified.

**Real data to anchor it (details in `WHITE-PAPER-NOTES.md`):**
- Pulse: "runs without me" 3.7 → 4.4; "runs on systems, not my presence"
  3.3 → 4.4; 86% of teachers rose, none dropped; n ≈ 7–8 matched of ~15 attendees,
  4 crews. Small pilot — be honest about n.
- Key beats: the mirror thesis ("what if the machine wasn't the enemy? what if it
  was a mirror?"); the day-one Marcus Aurelius moment; the Thursday A/B test
  ("create a lesson plan template that meets the requirements for my district" —
  generic Gemini vs. Gemini + Course Brain — it reflects back what you put in);
  the anonymized expert case study ("earned, not sold"); "Slopped" (Friday).

**First step:** propose an outline/structure for the paper and a recommended
format (web page vs PDF vs both), and ask me any clarifying questions. Do NOT
draft the whole thing until we agree on the skeleton.
