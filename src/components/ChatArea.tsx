import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Send, Sparkles, Loader2, Bot, User, Globe, ArrowDown, HelpCircle } from 'lucide-react';
import { Message, AgentStep, GroundingData } from '../types.js';
import { AgentStepTrace } from './AgentStepTrace.js';
import { SourcesCards } from './SourcesCards.js';

interface ChatAreaProps {
  messages: Message[];
  isLoading: boolean;
  currentStreamingText: string;
  currentLiveSteps: AgentStep[];
  currentLiveGrounding?: GroundingData;
  onSendMessage: (text: string) => void;
  onSelectPrompt: (prompt: string) => void;
}

const BENCHMARK_CHIPS = [
  {
    label: 'CRM pricing & ships since Monday',
    prompt: 'On Monday we shortlisted 5 CRM tools for a 20-person sales team. Has any of them changed pricing or shipped something big since?'
  },
  {
    label: 'Postgres pricing since last Tuesday',
    prompt: 'Last Tuesday I asked you about Postgres hosting. Has any pricing changed since then?'
  },
  {
    label: 'What did I ask on 3 Nov? Still correct?',
    prompt: 'What did I ask you on 3 November? Is your answer still correct today?'
  }
];

export const ChatArea: React.FC<ChatAreaProps> = ({
  messages,
  isLoading,
  currentStreamingText,
  currentLiveSteps,
  currentLiveGrounding,
  onSendMessage,
  onSelectPrompt
}) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  };

  useEffect(() => {
    scrollToBottom(isLoading ? 'auto' : 'smooth');
  }, [messages, currentStreamingText, currentLiveSteps, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    onSendMessage(input.trim());
    setInput('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleTextareaInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = Math.min(e.target.scrollHeight, 180) + 'px';
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-white dark:bg-zinc-950 overflow-hidden">
      {/* Scrollable messages container */}
      <div className="flex-1 overflow-y-auto px-4 md:px-8 py-6 space-y-6">
        {messages.length === 0 && !isLoading && (
          <div className="max-w-2xl mx-auto my-12 text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-sm">
              <Globe className="w-6 h-6" />
            </div>
            <h1 className="text-xl md:text-2xl font-bold text-zinc-900 dark:text-zinc-100">
              Minimi Search Agent
            </h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-lg mx-auto leading-relaxed">
              Equipped with live web search, calendar-anchored temporal reasoning, and episodic memory to verify facts and detect pricing/product deltas.
            </p>

            <div className="pt-4 text-left max-w-lg mx-auto">
              <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                Hiring Challenge Evaluation Prompts:
              </div>
              <div className="space-y-2">
                {BENCHMARK_CHIPS.map((chip, idx) => (
                  <button
                    key={idx}
                    onClick={() => onSelectPrompt(chip.prompt)}
                    className="w-full text-left p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 hover:border-emerald-300 dark:hover:border-emerald-800 text-xs text-zinc-700 dark:text-zinc-300 transition-all flex items-center justify-between group"
                  >
                    <span>&ldquo;{chip.prompt}&rdquo;</span>
                    <Sparkles className="w-3.5 h-3.5 text-emerald-500 opacity-0 group-hover:opacity-100 shrink-0 ml-2" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3.5 max-w-3xl mx-auto ${
                isUser ? 'flex-row-reverse' : 'flex-row'
              }`}
            >
              {/* Avatar */}
              <div
                className={`w-8 h-8 rounded-xl shrink-0 flex items-center justify-center text-xs shadow-xs ${
                  isUser
                    ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900'
                    : 'bg-emerald-600 text-white dark:bg-emerald-500'
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              {/* Message Content */}
              <div
                className={`flex-1 min-w-0 rounded-2xl px-5 py-4 ${
                  isUser
                    ? 'bg-zinc-100 dark:bg-zinc-800/80 text-zinc-900 dark:text-zinc-100 max-w-[85%]'
                    : 'bg-transparent text-zinc-900 dark:text-zinc-100'
                }`}
              >
                {/* Agent execution trace if available */}
                {!isUser && msg.agentSteps && msg.agentSteps.length > 0 && (
                  <AgentStepTrace steps={msg.agentSteps} isStreaming={false} />
                )}

                {/* Markdown text */}
                <div className="prose prose-sm dark:prose-invert max-w-none break-words leading-relaxed">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {msg.content}
                  </ReactMarkdown>
                </div>

                {/* Grounding citations if available */}
                {!isUser && msg.groundingData && (
                  <SourcesCards groundingData={msg.groundingData} />
                )}

                {/* Display time */}
                {msg.displayTime && (
                  <div
                    className={`text-[10px] text-zinc-400 mt-2 font-mono ${
                      isUser ? 'text-right' : 'text-left'
                    }`}
                  >
                    {msg.displayTime}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Live streaming message container */}
        {isLoading && (
          <div className="flex items-start gap-3.5 max-w-3xl mx-auto">
            <div className="w-8 h-8 rounded-xl shrink-0 flex items-center justify-center text-xs bg-emerald-600 text-white shadow-xs">
              <Bot className="w-4 h-4" />
            </div>

            <div className="flex-1 min-w-0">
              {/* Live steps */}
              {currentLiveSteps.length > 0 && (
                <AgentStepTrace steps={currentLiveSteps} isStreaming={true} />
              )}

              {/* Live text */}
              {currentStreamingText ? (
                <div className="prose prose-sm dark:prose-invert max-w-none break-words leading-relaxed">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {currentStreamingText}
                  </ReactMarkdown>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400 py-2">
                  <Loader2 className="w-4 h-4 animate-spin text-emerald-500" />
                  <span>Agent is reasoning and searching the web...</span>
                </div>
              )}

              {/* Live grounding */}
              {currentLiveGrounding && (
                <SourcesCards groundingData={currentLiveGrounding} />
              )}
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Benchmark chips above input */}
      <div className="px-4 md:px-8 max-w-3xl mx-auto w-full pt-2">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none text-xs">
          <span className="text-[11px] text-zinc-400 dark:text-zinc-500 shrink-0 font-medium">
            Test Chips:
          </span>
          {BENCHMARK_CHIPS.map((chip, idx) => (
            <button
              key={idx}
              onClick={() => onSelectPrompt(chip.prompt)}
              className="shrink-0 px-2.5 py-1 rounded-full bg-zinc-100 hover:bg-emerald-50 dark:bg-zinc-800 dark:hover:bg-emerald-950/40 text-zinc-600 hover:text-emerald-700 dark:text-zinc-300 dark:hover:text-emerald-300 border border-zinc-200/80 dark:border-zinc-700/80 transition-colors text-[11px]"
            >
              {chip.label}
            </button>
          ))}
        </div>
      </div>

      {/* Input Form */}
      <div className="p-4 md:px-8 md:pb-6 border-t border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-950">
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto relative">
          <div className="relative flex items-end rounded-2xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 shadow-sm focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/20 transition-all p-2">
            <textarea
              ref={textareaRef}
              rows={1}
              value={input}
              onChange={handleTextareaInput}
              onKeyDown={handleKeyDown}
              placeholder="Ask anything (e.g. check pricing changes since Monday, Postgres updates)..."
              disabled={isLoading}
              className="w-full resize-none bg-transparent px-3 py-1.5 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:outline-hidden max-h-[160px]"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="p-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:bg-zinc-200 dark:disabled:bg-zinc-800 text-white disabled:text-zinc-400 transition-colors shrink-0 shadow-xs"
              aria-label="Send message"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </button>
          </div>
          <div className="mt-1.5 text-[11px] text-zinc-400 text-center">
            Press <kbd className="px-1 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-[10px] font-mono">Enter</kbd> to send, <kbd className="px-1 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-[10px] font-mono">Shift + Enter</kbd> for newline
          </div>
        </form>
      </div>
    </div>
  );
};
