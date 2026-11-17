import React from 'react';
import { FileText, Database, Globe, Calendar, Menu, Sparkles } from 'lucide-react';
import { Session } from '../types.js';

interface HeaderProps {
  currentSession?: Session;
  onOpenDesignDoc: () => void;
  onOpenMemoryInspector: () => void;
  onToggleSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentSession,
  onOpenDesignDoc,
  onOpenMemoryInspector,
  onToggleSidebar
}) => {
  return (
    <header className="h-14 border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md px-4 flex items-center justify-between z-10">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="md:hidden p-1.5 rounded-lg text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800"
          aria-label="Toggle menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-emerald-600 dark:bg-emerald-500 flex items-center justify-center text-white shadow-xs">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm text-zinc-900 dark:text-zinc-100">
                Minimi Agent
              </span>
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-800/50">
                <Globe className="w-2.5 h-2.5" />
                Live Web Search
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Middle/Center: Temporal Anchor info */}
      <div className="hidden lg:flex items-center gap-2 px-2.5 py-1 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800 text-[11px] text-zinc-600 dark:text-zinc-400 font-mono">
        <Calendar className="w-3.5 h-3.5 text-zinc-400" />
        <span>Wall-Clock Anchor: <strong>Wednesday, Nov 11, 2026</strong></span>
      </div>

      {/* Right Action buttons */}
      <div className="flex items-center gap-2">
        <button
          onClick={onOpenMemoryInspector}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-900 text-xs text-zinc-700 dark:text-zinc-300 font-medium transition-colors"
          title="Inspect stored conversations & dates"
        >
          <Database className="w-3.5 h-3.5 text-blue-500" />
          <span className="hidden sm:inline">Memory Inspector</span>
        </button>

        <button
          onClick={onOpenDesignDoc}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-zinc-200 text-white dark:text-zinc-900 text-xs font-semibold shadow-xs transition-colors"
          title="View DESIGN.md architecture document"
        >
          <FileText className="w-3.5 h-3.5" />
          <span>DESIGN.md</span>
        </button>
      </div>
    </header>
  );
};
