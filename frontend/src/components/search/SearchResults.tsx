import React from 'react';
import type { SearchResult } from '../../lib/apiSearch';

interface SearchResultsProps {
  results: SearchResult[];
}

export default function SearchResults({ results }: SearchResultsProps) {
  if (!results.length) return null;

  return (
    <ul className="space-y-2">
      {results.map((result) => (
        <li
          key={`${result.type}-${result.id}`}
          className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <span className="text-sm">{result.type === 'note' ? '📝' : '📁'}</span>
            <span className="font-semibold text-sm">{result.title}</span>
            <span className="ml-auto text-[10px] uppercase tracking-wide text-gray-400 bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded">
              {result.type}
            </span>
          </div>
          {result.snippet && (
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1.5 ml-6 line-clamp-2">
              {result.snippet}
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}
