import React from 'react';
import { X, Database, Calendar, MessageSquare, Clock, RotateCcw } from 'lucide-react';
import { Session } from '../types.js';

interface MemoryInspectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  sessions: Session[];
  onReset: () => void;
  onSelectSession: (id: string) => void;
}

export const MemoryInspectorModal: React.FC<MemoryInspectorModalProps> = ({
  isOpen,
  onClose,
  sessions,
  onReset,
  onSelectSession
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="relative w-full max-w-3xl max-h-[85vh] flex flex-col bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-100 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 rounded-lg">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
                Episodic Conversation Memory Store
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Temporal Index & Conversation Threads Indexed by Calendar Date
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onReset}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 transition-colors"
              title="Reset memory to hiring challenge benchmark seeds"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Seeds
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
          <div className="p-3 bg-blue-50/50 dark:bg-blue-950/30 rounded-xl border border-blue-200/60 dark:border-blue-900/50 text-xs text-blue-800 dark:text-blue-300 leading-relaxed">
            <strong>How Temporal Memory Works:</strong> Every conversation is date-stamped and cataloged in the memory index. When the agent receives a prompt asking what occurred on a certain date (e.g. <em>"On Monday"</em> or <em>"What did I ask on 3 November?"</em>), it queries this episodic store, extracts the baseline entities and numbers, and uses the Web Search tool to detect real-time changes since then.
          </div>

          <div className="space-y-3">
            {sessions.map((sess) => (
              <div
                key={sess.id}
                className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/40 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-zinc-900 dark:text-zinc-100 text-sm">
                        {sess.title}
                      </span>
                      {sess.isBenchmark && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wider bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/60">
                          Hiring Benchmark
                        </span>
                      )}
                    </div>
                    {sess.description && (
                      <p className="text-xs text-zinc-500 dark:text-zinc-400">
                        {sess.description}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => {
                      onSelectSession(sess.id);
                      onClose();
                    }}
                    className="shrink-0 px-3 py-1 text-xs bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-medium rounded-lg hover:opacity-90 transition-opacity"
                  >
                    Open Thread
                  </button>
                </div>

                <div className="mt-3 flex items-center gap-4 text-xs text-zinc-500 dark:text-zinc-400 pt-2 border-t border-zinc-200/60 dark:border-zinc-800/60">
                  <span className="flex items-center gap-1.5 font-mono text-[11px]">
                    <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                    Date: {new Date(sess.createdAt).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                  <span className="flex items-center gap-1.5 font-mono text-[11px]">
                    <Clock className="w-3.5 h-3.5 text-zinc-400" />
                    Time: {new Date(sess.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5 text-zinc-400" />
                    {sess.messages.length} messages
                  </span>
                </div>

                {/* Preview first user message */}
                {sess.messages.length > 0 && (
                  <div className="mt-2.5 p-2 rounded-lg bg-white dark:bg-zinc-800/60 text-xs text-zinc-600 dark:text-zinc-300 line-clamp-2 italic border border-zinc-100 dark:border-zinc-800">
                    &ldquo;{sess.messages[0].content}&rdquo;
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-3 bg-zinc-50 dark:bg-zinc-900/60 border-t border-zinc-200 dark:border-zinc-800 text-xs text-zinc-500">
          <span>{sessions.length} conversation threads stored</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-medium rounded-lg hover:opacity-90"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
