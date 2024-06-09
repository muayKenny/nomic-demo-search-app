'use client';

import { useState } from 'react';
import SearchResults from '@/components/SearchResults';
import DarkModeToggle from '@/components/DarkMode';

const SearchPage = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    const response = await fetch(`/api/neighbors?input=${query}&k=16`);
    const data = await response.json();
    setResults(data);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Search Neighbors</h1>
        <DarkModeToggle />
      </div>
      <form onSubmit={handleSearch} className="mb-4">
  <input
    type="text"
    value={query}
    onChange={(e) => setQuery(e.target.value)}
    placeholder="Search..."
    className="p-2 border border-gray-300 rounded w-full mb-2 text-gray-900 bg-white dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700"
  />
  <button type="submit" className="p-2 bg-blue-500 text-white rounded dark:bg-blue-700">Search</button>
</form>

      {loading ? (
        <p className="text-gray-900 dark:text-gray-100">Loading...</p>
      ) : (
        <SearchResults results={results} />
      )}
    </div>
  );
};

export default SearchPage;
