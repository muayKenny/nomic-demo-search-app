'use client';

import { useState } from 'react';
import SearchResults from '@/components/SearchResults';

const SearchPage = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    const response = await fetch(`/api/neighbors?input=${query}&neighbors=25`);
    const data = await response.json();
    setResults(data);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-4">Search Neighbors</h1>
      <form onSubmit={handleSearch} className="mb-4">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search..."
          className="p-2 border border-gray-300 rounded w-full mb-2"
        />
        <button type="submit" className="p-2 bg-blue-500 text-white rounded">Search</button>
      </form>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <SearchResults results={results} />
      )}
    </div>
  );
};

export default SearchPage;
