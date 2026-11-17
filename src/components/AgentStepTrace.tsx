import React, { useState } from 'react';
import { AgentStep } from '../types.js';
import { CheckCircle2, Clock, Loader2, AlertCircle, ChevronDown, ChevronUp, Cpu } from 'lucide-react';

interface AgentStepTraceProps {
  steps: AgentStep[];
  isStreaming?: boolean;
}

export const AgentStepTrace: React.FC<AgentStepTraceProps> = ({ steps, isStreaming }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  if (!steps || steps.length === 0) return null;

  const allCompleted = steps.every(s => s.status === 'completed');

  return (
    <div className="mb-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/60 overflow-hidden text-xs transition-all">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between px-3.5 py-2.5 bg-zinc-100/70 dark:bg-zinc-800/60 hover:bg-zinc-200/50 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-medium transition-colors"
      >
        <div className="flex items-center gap-2">
          <Cpu className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>Agent Execution Trace & Verification</span>
          {isStreaming && (
            <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 font-normal">
              <Loader2 className="w-3 h-3 animate-spin" /> Live Processing
            </span>
          )}
          {!isStreaming && allCompleted && (
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
              {steps.length} steps verified
            </span>
          )}
        </div>
        <div className="text-zinc-400">
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>

      {isExpanded && (
        <div className="p-3 space-y-2 border-t border-zinc-200/60 dark:border-zinc-800/60">
          {steps.map((step) => {
            const isDone = step.status === 'completed';
            const isRunning = step.status === 'running';
            const isFailed = step.status === 'failed';

            return (
              <div
                key={step.id}
                className="flex items-start gap-2.5 text-zinc-600 dark:text-zinc-300"
              >
                <div className="mt-0.5 shrink-0">
                  {isDone && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />}
                  {isRunning && <Loader2 className="w-3.5 h-3.5 text-blue-500 animate-spin" />}
                  {isFailed && <AlertCircle className="w-3.5 h-3.5 text-red-500" />}
                  {!isDone && !isRunning && !isFailed && <Clock className="w-3.5 h-3.5 text-zinc-400" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-zinc-800 dark:text-zinc-200">
                    {step.title}
                  </div>
                  {step.detail && (
                    <div className="text-zinc-500 dark:text-zinc-400 text-[11px] leading-relaxed mt-0.5 break-words">
                      {step.detail}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
