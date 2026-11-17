import React from 'react';
import { X, FileText, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';

interface DesignDocModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DesignDocModal: React.FC<DesignDocModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="relative w-full max-w-3xl max-h-[88vh] flex flex-col bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 rounded-lg">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
                DESIGN.md — Architectural Blueprint
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Submission documentation for the minimi hiring challenge
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6 text-sm text-zinc-700 dark:text-zinc-300">
          {/* Section 1 */}
          <section className="space-y-2">
            <h3 className="text-base font-bold text-zinc-900 dark:text-white flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              1. How It Works (The 4-Stage Pipeline)
            </h3>
            <p className="leading-relaxed text-zinc-600 dark:text-zinc-300">
              When given temporal delta queries like <em>"On Monday we shortlisted 5 CRM tools... has any of them changed pricing since?"</em>, standard LLMs hallucinate because they do not have calendar grounding or access to what occurred on that specific date. Minimi Agent solves this through a deterministic pipeline:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="p-3 rounded-xl bg-zinc-100/70 dark:bg-zinc-800/60 border border-zinc-200/60 dark:border-zinc-700/60">
                <div className="font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5 text-xs uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                  Stage 1: Temporal Resolver
                </div>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                  Anchors to current wall-clock date (Nov 11, 2026). Computes relative offsets ("Monday" = Nov 9; "Last Tuesday" = Nov 3) into ISO windows before prompt formulation.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-zinc-100/70 dark:bg-zinc-800/60 border border-zinc-200/60 dark:border-zinc-700/60">
                <div className="font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5 text-xs uppercase tracking-wider text-blue-600 dark:text-blue-400">
                  Stage 2: Episodic Memory
                </div>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                  Retrieves historical interaction records from that date (e.g. the 5 shortlisted CRMs with their exact baseline prices: HubSpot $90, Pipedrive $39, Close $49, etc.).
                </p>
              </div>

              <div className="p-3 rounded-xl bg-zinc-100/70 dark:bg-zinc-800/60 border border-zinc-200/60 dark:border-zinc-700/60">
                <div className="font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5 text-xs uppercase tracking-wider text-amber-600 dark:text-amber-400">
                  Stage 3: Targeted Search
                </div>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                  Formulates entity-specific queries with time filters via Google Search grounding on Gemini 3.8 Flash, obtaining verified real-time web results.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-zinc-100/70 dark:bg-zinc-800/60 border border-zinc-200/60 dark:border-zinc-700/60">
                <div className="font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5 text-xs uppercase tracking-wider text-purple-600 dark:text-purple-400">
                  Stage 4: Delta Fact Verifier
                </div>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                  Compares baseline vs live search findings. Formats clear diff tables ("Confirmed Unchanged" vs "Changes Detected") with citations streamed via SSE.
                </p>
              </div>
            </div>
          </section>

          {/* Section 2 */}
          <section className="space-y-2">
            <h3 className="text-base font-bold text-zinc-900 dark:text-white flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
              2. Why We Built It This Way
            </h3>
            <ul className="space-y-2 list-none">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>
                  <strong>Deterministic temporal anchor over LLM date guessing:</strong> LLMs are notorious for miscalculating calendar math (e.g. confusing which Tuesday was "last Tuesday"). Resolving dates deterministically in Node ensures mathematical certainty.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>
                  <strong>Server-side SSE streaming:</strong> Real-time event protocol provides sub-second initial token arrival while transmitting transparent execution step badges to the user.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>
                  <strong>One-pass grounded search with native citations:</strong> Rather than daisy-chaining 4 separate sequential agents that add 15s of latency, Gemini 3.8 Flash with native search grounding performs search synthesis in a snappy ~2s round-trip.
                </span>
              </li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="space-y-2">
            <h3 className="text-base font-bold text-zinc-900 dark:text-white flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              3. What We Considered and Rejected
            </h3>
            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-lg bg-zinc-100 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-800">
                <span className="font-semibold text-red-500 dark:text-red-400">Rejected: Generic Embedding Vector Search</span>
                <p className="text-zinc-600 dark:text-zinc-400 mt-0.5">
                  Vector distance fails on temporal constraints. "What did I ask on 3 November?" needs a strict calendar filter, not semantic closeness to other questions. We built a date-indexed chronological memory index.
                </p>
              </div>
              <div className="p-2.5 rounded-lg bg-zinc-100 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-800">
                <span className="font-semibold text-red-500 dark:text-red-400">Rejected: Client-Side Web Scraping</span>
                <p className="text-zinc-600 dark:text-zinc-400 mt-0.5">
                  Fragile, blocked by CORS and Cloudflare bot barriers. Server-side Google Search grounding provides fresh real-time web retrieval with zero brittleness.
                </p>
              </div>
            </div>
          </section>

          {/* Section 4 */}
          <section className="space-y-2">
            <h3 className="text-base font-bold text-zinc-900 dark:text-white flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-purple-500"></span>
              4. What We'd Do With Another Week
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
              <div className="p-2.5 rounded-lg border border-zinc-200 dark:border-zinc-800">
                <div className="font-semibold text-zinc-900 dark:text-zinc-100">Automated Web Watchers</div>
                <p className="text-zinc-500 dark:text-zinc-400 mt-1">
                  Background cron jobs continuously diffing shortlisted URLs and notifying on price or plan shifts.
                </p>
              </div>
              <div className="p-2.5 rounded-lg border border-zinc-200 dark:border-zinc-800">
                <div className="font-semibold text-zinc-900 dark:text-zinc-100">Visual DOM Diffing</div>
                <p className="text-zinc-500 dark:text-zinc-400 mt-1">
                  Headless browser snapshotting of pricing tables to catch subtle footnote adjustments and annual discount asterisks.
                </p>
              </div>
              <div className="p-2.5 rounded-lg border border-zinc-200 dark:border-zinc-800">
                <div className="font-semibold text-zinc-900 dark:text-zinc-100">User Preference Graph</div>
                <p className="text-zinc-500 dark:text-zinc-400 mt-1">
                  Cross-session memory storing company size (20 persons), tech stack (Postgres), and budget boundaries.
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-3 bg-zinc-50 dark:bg-zinc-900/60 border-t border-zinc-200 dark:border-zinc-800 text-xs text-zinc-500">
          <span>Available at root <code className="px-1.5 py-0.5 bg-zinc-200 dark:bg-zinc-800 rounded font-mono text-[11px]">/DESIGN.md</code></span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-medium rounded-lg hover:opacity-90 transition-opacity"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
