import React from 'react';
import type { SearchResult } from '../../lib/apiSearch';

interface SearchResultsProps {
  results: SearchResult[];
}

export default function SearchResults({ results }: SearchResultsProps) {
  if (!results.length) {
    return <div className="text-gray-400 dark:text-gray-500">No results found.</div>;
  }

  return (
    <ul className="space-y-2">
      {results.map((result) => (
        <li
          key={result.id}
          className="rounded border bg-white p-3 shadow dark:bg-gray-900"
        >
          <div className="font-semibold">
            {result.title}
            <span className="ml-2 text-xs text-gray-400">({result.type})</span>
          </div>
          {result.snippet && (
            <div className="truncate text-sm text-gray-500 dark:text-gray-400">
              {result.snippet}
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}
