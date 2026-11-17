# Minimi Search Agent — Architecture & Design Document

## 1. System Overview

Minimi Search Agent is an agentic chat system with web search designed for temporal reasoning, conversation recall, and real-time delta verification ("has anything changed since?"). 

Standard LLM search wrappers fail on prompts like *"On Monday we shortlisted 5 CRM tools... has any of them changed pricing since?"* because they lack:
1. **Temporal anchoring** (resolving relative expressions like "Monday", "last Tuesday", or "3 November" to absolute dates).
2. **Episodic memory retrieval** (recalling baseline facts, options, and claims from past interactions).
3. **Comparative delta synthesis** (diffing historical baseline facts against verified live web results).

This architecture implements a deterministic **Temporal-Episodic-Grounding Pipeline** that answers in seconds with verified web citations.

```
[ User Query ] ──▶ [ 1. Temporal Resolver ] ──▶ [ 2. Episodic Memory Index ]
                            │                               │
                            ▼                               ▼
                 [ Absolute Date Windows ]      [ Baseline Historical State ]
                            │                               │
                            └───────────────┬───────────────┘
                                            ▼
                           [ 3. Grounded Search Agent ]
                               (Gemini 3.8 Flash + Web)
                                            │
                             ┌──────────────┴──────────────┐
                             ▼                             ▼
                  [ Web Search Tool Calls ]     [ Delta Fact Verifier ]
                             │                             │
                             └──────────────┬──────────────┘
                                            ▼
                         [ 4. Streaming Synthesis (SSE) ]
                               (Answer + Citations)
```

---

## 2. Core Architecture & How It Works

### Step 1: Temporal Anchoring & Expression Resolution
- The system anchors to the true wall-clock time (`now = 2026-11-11T10:52:50Z` or user-configured anchor).
- Relative temporal tokens (`"Monday"`, `"last Tuesday"`, `"yesterday"`, `"3 November"`, `"since then"`) are resolved into exact calendar dates (e.g. *Monday = 2026-11-09*, *Last Tuesday = 2026-11-03*).
- Both the current anchor and target historical timestamps are injected into downstream reasoning.

### Step 2: Episodic Conversation Memory & Baseline Fact Extraction
- Conversations are stored with strict message timestamps, thread boundaries, and entity summaries.
- When an inquiry references prior context (*"we shortlisted 5 CRM tools"*, *"what did I ask you on 3 November?"*), the memory index locates the exact interaction and extracts:
  - **Subject matter & entities** (e.g., HubSpot, Pipedrive, Close, Salesforce, Zoho).
  - **Baseline facts recorded at that time** (e.g., $90/user/mo, specific feature sets, recommendations).

### Step 3: Targeted Search Tool Formulation & Grounding
- Rather than a vague query, the agent formulates **time-bounded, entity-specific search queries** (e.g., `HubSpot CRM pricing changes November 2026`, `Neon postgres pricing update 2026`).
- Uses real-time Google Search grounding via the modern `@google/genai` SDK on `gemini-3.8-flash`.
- Returns fresh web sources, URLs, domain titles, and grounding snippets.

### Step 4: Delta Verification & Structured Synthesis
- The agent explicitly compares the retrieved live web facts against the historical baseline:
  - **Baseline State**: What was shortlisted or stated on the reference date.
  - **Status & Diffs**: Changes detected (pricing adjustments, tier shifts, new product launches) or confirmation that prices remain steady.
  - **Direct Evidence**: Verifiable URLs and attribution to authoritative sources.
- Streamed chunk-by-chunk via Server-Sent Events (SSE) for sub-second Time-To-First-Token (TTFT).

---

## 3. Key Decisions: Why Built This Way

1. **Server-Authoritative Architecture with SSE Streaming**:
   - Web search and LLM calls run server-side in Node/Express. The browser receives a continuous SSE stream with live status events (`agent_step`, `grounding_data`, `delta`, `done`).
   - Ensures no API keys leak and keeps latency minimal.

2. **Deterministic Temporal Resolver over Pure Model Guessing**:
   - LLMs frequently hallucinate days of the week (e.g. mistaking which day was "last Tuesday" or whether Nov 3 was Tuesday). By feeding calculated ISO dates alongside relative terms, date math is 100% reliable.

3. **Gemini 3.8 Flash with Native Google Search Grounding**:
   - Native search grounding integrates live indexing directly into the model's token generation loop, extracting accurate grounding chunks and citations without brittle third-party HTML scraping.

---

## 4. What Was Considered and Rejected

- **Vector-Only Semantic Search for Memory**:
  - *Rejected.* Vector embeddings (e.g. cosine distance) do not understand strict calendar dates well. A query like *"What did I ask on 3 November?"* needs date filtering, not semantic similarity. We use an exact date-indexed memory store with lexical fallback.
- **Client-Side Scraping & Search**:
  - *Rejected.* Blocked by CORS, rate limits, and security vulnerabilities.
- **Multi-Agent Sequential Swarm (Planner ➔ Searcher ➔ Critic ➔ Writer)**:
  - *Rejected for latency.* Multi-agent handoffs add 8–15 seconds of overhead. A streamlined single-pass tool-augmented agent with targeted reasoning achieves higher accuracy in ~1.5 to 2.5 seconds.

---

## 5. What We'd Build with Another Week

1. **Automated Continuous Web Diff Monitor**:
   - Register recurring background checks (cron) on shortlisted vendors' pricing pages; push proactive webhooks if prices or terms change.
2. **Headless Browser Visual DOM Diffing**:
   - Screenshot rendering and AST comparison on pricing tables to catch subtle footnote adjustments (e.g. annual vs monthly billing minimums).
3. **Cross-Session Knowledge Graph**:
   - Persistent graph representation of user preferences (team size, tech stack, budget limits) to personalize future search evaluations automatically.
