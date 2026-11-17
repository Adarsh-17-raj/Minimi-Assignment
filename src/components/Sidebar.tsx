import React from 'react';
import { Plus, MessageSquare, Sparkles, Database, RotateCcw, X, CheckSquare, Clock } from 'lucide-react';
import { Session } from '../types.js';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  sessions: Session[];
  activeSessionId: string;
  onSelectSession: (id: string) => void;
  onNewSession: () => void;
  onResetBenchmark: () => void;
  onSelectBenchmarkPrompt?: (prompt: string, sessionId?: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  sessions,
  activeSessionId,
  onSelectSession,
  onNewSession,
  onResetBenchmark,
  onSelectBenchmarkPrompt
}) => {
  const benchmarkSessions = sessions.filter(s => s.isBenchmark);
  const userSessions = sessions.filter(s => !s.isBenchmark);

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs md:hidden"
        />
      )}

      <aside
        className={`fixed md:static inset-y-0 left-0 z-40 w-72 flex flex-col bg-zinc-50 dark:bg-zinc-950 border-r border-zinc-200 dark:border-zinc-800 transition-transform duration-200 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Top header */}
        <div className="p-3.5 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-emerald-600 flex items-center justify-center text-white text-xs font-bold">
              M
            </div>
            <span className="font-semibold text-sm text-zinc-900 dark:text-zinc-100">
              Minimi Workspace
            </span>
          </div>
          <button
            onClick={onClose}
            className="md:hidden p-1 rounded-md text-zinc-400 hover:text-zinc-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* New Chat Button */}
        <div className="p-3">
          <button
            onClick={() => {
              onNewSession();
              onClose();
            }}
            className="w-full flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-zinc-200 text-white dark:text-zinc-900 text-xs font-semibold shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>New Chat</span>
          </button>
        </div>

        {/* Scrollable list */}
        <div className="flex-1 overflow-y-auto px-3 space-y-4">
          {/* Hiring Challenge Benchmarks */}
          <div>
            <div className="flex items-center justify-between px-1 mb-2">
              <span className="text-[11px] font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-emerald-500" />
                Hiring Test Datasets
              </span>
            </div>

            <div className="space-y-1">
              {benchmarkSessions.map((sess) => {
                const isActive = sess.id === activeSessionId;
                return (
                  <button
                    key={sess.id}
                    onClick={() => {
                      onSelectSession(sess.id);
                      onClose();
                    }}
                    className={`w-full text-left p-2.5 rounded-xl text-xs transition-all flex flex-col gap-1 ${
                      isActive
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-800/60 font-medium'
                        : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="truncate font-medium">{sess.title}</span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-zinc-200/80 dark:bg-zinc-800 text-zinc-500 font-mono shrink-0">
                        {sess.benchmarkKey === 'crm' ? 'Nov 9' : 'Nov 3'}
                      </span>
                    </div>
                    <span className="text-[11px] text-zinc-500 dark:text-zinc-400 line-clamp-1">
                      {sess.description}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Test Benchmark Prompts */}
          {onSelectBenchmarkPrompt && (
            <div>
              <div className="px-1 mb-2">
                <span className="text-[11px] font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider flex items-center gap-1.5">
                  <CheckSquare className="w-3 h-3 text-blue-500" />
                  Evaluate Benchmark Prompts
                </span>
              </div>
              <div className="space-y-1 text-xs">
                <button
                  onClick={() => {
                    onSelectBenchmarkPrompt(
                      'On Monday we shortlisted 5 CRM tools for a 20-person sales team. Has any of them changed pricing or shipped something big since?',
                      'benchmark-crm'
                    );
                    onClose();
                  }}
                  className="w-full text-left p-2 rounded-lg bg-zinc-100/70 dark:bg-zinc-900/60 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 text-zinc-600 dark:text-zinc-300 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors border border-zinc-200/50 dark:border-zinc-800"
                >
                  <div className="font-medium text-[11px] text-zinc-800 dark:text-zinc-200">
                    Prompt 1: CRM Changes
                  </div>
                  <div className="text-[11px] text-zinc-500 line-clamp-1 mt-0.5">
                    "On Monday we shortlisted 5 CRM tools..."
                  </div>
                </button>

                <button
                  onClick={() => {
                    onSelectBenchmarkPrompt(
                      'Last Tuesday I asked you about Postgres hosting. Has any pricing changed since then?',
                      'benchmark-postgres'
                    );
                    onClose();
                  }}
                  className="w-full text-left p-2 rounded-lg bg-zinc-100/70 dark:bg-zinc-900/60 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 text-zinc-600 dark:text-zinc-300 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors border border-zinc-200/50 dark:border-zinc-800"
                >
                  <div className="font-medium text-[11px] text-zinc-800 dark:text-zinc-200">
                    Prompt 2: Postgres Pricing
                  </div>
                  <div className="text-[11px] text-zinc-500 line-clamp-1 mt-0.5">
                    "Last Tuesday I asked you about Postgres..."
                  </div>
                </button>

                <button
                  onClick={() => {
                    onSelectBenchmarkPrompt(
                      'What did I ask you on 3 November? Is your answer still correct today?',
                      'benchmark-postgres'
                    );
                    onClose();
                  }}
                  className="w-full text-left p-2 rounded-lg bg-zinc-100/70 dark:bg-zinc-900/60 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 text-zinc-600 dark:text-zinc-300 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors border border-zinc-200/50 dark:border-zinc-800"
                >
                  <div className="font-medium text-[11px] text-zinc-800 dark:text-zinc-200">
                    Prompt 3: Nov 3 Recall
                  </div>
                  <div className="text-[11px] text-zinc-500 line-clamp-1 mt-0.5">
                    "What did I ask you on 3 November? Is your answer..."
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* User Conversations */}
          {userSessions.length > 0 && (
            <div>
              <div className="px-1 mb-2">
                <span className="text-[11px] font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider flex items-center gap-1.5">
                  <Clock className="w-3 h-3 text-zinc-400" />
                  Recent Conversations
                </span>
              </div>
              <div className="space-y-1">
                {userSessions.map((sess) => {
                  const isActive = sess.id === activeSessionId;
                  return (
                    <button
                      key={sess.id}
                      onClick={() => {
                        onSelectSession(sess.id);
                        onClose();
                      }}
                      className={`w-full text-left px-2.5 py-2 rounded-lg text-xs truncate transition-colors flex items-center gap-2 ${
                        isActive
                          ? 'bg-zinc-200/80 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-medium'
                          : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900'
                      }`}
                    >
                      <MessageSquare className="w-3.5 h-3.5 shrink-0 opacity-60" />
                      <span className="truncate">{sess.title}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between text-xs text-zinc-500">
          <span className="font-mono text-[11px]">Node.js + Gemini 3.8</span>
          <button
            onClick={onResetBenchmark}
            className="flex items-center gap-1 hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors"
            title="Reset to benchmark dataset"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>
        </div>
      </aside>
    </>
  );
};
