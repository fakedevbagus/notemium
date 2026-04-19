'use client';

import React from 'react';
import SearchBar from './SearchBar';
import SearchResults from './SearchResults';
import { searchAll, type SearchResult } from '../../lib/apiSearch';

export default function SearchPage() {
  const [results, setResults] = React.useState<SearchResult[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [searched, setSearched] = React.useState(false);
  const debounceRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  function handleSearch(query: string) {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!query.trim()) {
      setResults([]);
      setSearched(false);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      setError(null);
      setSearched(true);

      try {
        const data = await searchAll(query);
        setResults(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Search failed');
      } finally {
        setLoading(false);
      }
    }, 300);
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Search</h1>
      <SearchBar onSearch={handleSearch} realtime />

      {loading && (
        <div className="flex items-center gap-2 text-gray-400 py-4">
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <span className="text-sm">Searching…</span>
        </div>
      )}

      {error && (
        <div className="rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-3 text-sm text-red-600 dark:text-red-400 mb-4">
          {error}
        </div>
      )}

      {!loading && searched && results.length === 0 && (
        <div className="flex flex-col items-center py-12 text-gray-400 dark:text-gray-500">
          <span className="text-3xl mb-2">🔍</span>
          <p className="text-sm">No results found</p>
        </div>
      )}

      <SearchResults results={results} />
    </div>
  );
}
