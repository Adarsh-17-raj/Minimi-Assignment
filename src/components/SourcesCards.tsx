import React from 'react';
import { GroundingData } from '../types.js';
import { ExternalLink, Globe, Search } from 'lucide-react';

interface SourcesCardsProps {
  groundingData?: GroundingData;
}

export const SourcesCards: React.FC<SourcesCardsProps> = ({ groundingData }) => {
  if (!groundingData) return null;

  const { sources, searchQueries } = groundingData;
  const hasSources = sources && sources.length > 0;
  const hasQueries = searchQueries && searchQueries.length > 0;

  if (!hasSources && !hasQueries) return null;

  return (
    <div className="mt-4 pt-3 border-t border-zinc-200/80 dark:border-zinc-800 text-xs">
      {hasQueries && (
        <div className="mb-2.5 flex flex-wrap items-center gap-1.5 text-zinc-500 dark:text-zinc-400">
          <span className="flex items-center gap-1 font-medium text-zinc-600 dark:text-zinc-300">
            <Search className="w-3.5 h-3.5 text-blue-500" />
            Live Search Queries:
          </span>
          {searchQueries.map((q, idx) => (
            <span
              key={idx}
              className="inline-block px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-[11px] font-mono border border-zinc-200/60 dark:border-zinc-700/60"
            >
              {q}
            </span>
          ))}
        </div>
      )}

      {hasSources && (
        <div>
          <div className="flex items-center gap-1.5 font-medium text-zinc-600 dark:text-zinc-300 mb-2">
            <Globe className="w-3.5 h-3.5 text-emerald-500" />
            Verified Citations ({sources.length} sources):
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
            {sources.map((src, idx) => (
              <a
                key={idx}
                href={src.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col justify-between p-2.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/80 hover:border-emerald-500/50 hover:shadow-xs transition-all"
              >
                <div className="font-medium text-zinc-800 dark:text-zinc-200 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 line-clamp-2 leading-snug">
                  {src.title}
                </div>
                <div className="mt-1.5 flex items-center justify-between text-[11px] text-zinc-400 dark:text-zinc-500">
                  <span className="truncate max-w-[80%] font-mono">
                    {src.domain || new URL(src.url).hostname}
                  </span>
                  <ExternalLink className="w-3 h-3 group-hover:text-emerald-500 shrink-0 ml-1 opacity-70 group-hover:opacity-100" />
                </div>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
