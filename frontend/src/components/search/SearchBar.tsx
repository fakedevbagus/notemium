'use client';

import React from 'react';

interface SearchBarProps {
  onSearch: (query: string) => void;
  realtime?: boolean;
}

export default function SearchBar({ onSearch, realtime = false }: SearchBarProps) {
  const [query, setQuery] = React.useState('');

  function handleChange(value: string) {
    setQuery(value);
    if (realtime) onSearch(value);
  }

  return (
    <form
      onSubmit={e => {
        e.preventDefault();
        onSearch(query);
      }}
      className="flex gap-2 mb-4"
    >
      <input
        className="flex-1 p-2.5 rounded-lg border bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
        placeholder="Search notes and folders…"
        value={query}
        onChange={e => handleChange(e.target.value)}
        autoFocus
      />
      {!realtime && (
        <button type="submit" className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors">
          Search
        </button>
      )}
    </form>
  );
}
