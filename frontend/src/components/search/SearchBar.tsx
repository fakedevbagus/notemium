import React from 'react';

export default function SearchBar({ onSearch }: { onSearch: (query: string) => void }) {
  const [query, setQuery] = React.useState('');
  return (
    <form
      onSubmit={e => {
        e.preventDefault();
        onSearch(query);
      }}
      className="flex gap-2 mb-4"
    >
      <input
        className="flex-1 p-2 rounded border bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-700"
        placeholder="Search notes or folders..."
        value={query}
        onChange={e => setQuery(e.target.value)}
      />
      <button type="submit" className="px-4 py-2 rounded bg-purple-600 text-white hover:bg-purple-700">Search</button>
    </form>
  );
}
