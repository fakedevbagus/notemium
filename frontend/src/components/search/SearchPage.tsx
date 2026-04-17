'use client';

import React from 'react';
import SearchBar from './SearchBar';
import SearchResults from './SearchResults';
import { searchAll, type SearchResult } from '../../lib/apiSearch';

export default function SearchPage() {
  const [results, setResults] = React.useState<SearchResult[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  async function handleSearch(query: string) {
    setLoading(true);
    setError(null);

    try {
      const data = await searchAll(query);
      setResults(data);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Search failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Search</h1>
      <SearchBar onSearch={handleSearch} />
      {loading && <div className="text-gray-400">Searching...</div>}
      {error && <div className="text-red-500">{error}</div>}
      <SearchResults results={results} />
    </div>
  );
}
