'use client';

import { useState, useEffect } from 'react';
import { Suspense } from 'react';
import DarkModeToggle from '@/components/DarkMode';
import SearchResults from '@/app/search/SearchResults';
import { Loading } from '@/components/Loading';

interface SearchPageProps {
  searchParams: {
    query?: string;
  };
}

const SearchPage = ({ searchParams }: SearchPageProps) => {
  const initialQuery = searchParams?.query || '';
  const [input, setInput] = useState(initialQuery); // Tracks the input value
  const [query, setQuery] = useState(initialQuery); // Tracks the submitted query
  const [results, setResults] = useState<any[]>([]); // Stores fetched results
  const [loading, setLoading] = useState(false); // Loading state
  const [k, setK] = useState(20); // Default number of results to fetch

  const fetchResults = async (query: string) => {
    setLoading(true);

    try {
      const url = new URL(
        '/api/neighbors',
        process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'
      );
      url.searchParams.set('input', query);
      url.searchParams.set('k', k.toString());

      const response = await fetch(url);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch results');
      }

      const data = await response.json();
      setResults(data);
    } catch (error) {
      // implement custom clientside error boudary
      throw error;
    } finally {
      setLoading(false); // Ensure loading state is always cleared
    }
  };

  const handleSearch = () => {
    if (input.trim()) {
      setQuery(input);
    }
  };

  useEffect(() => {
    if (query) {
      fetchResults(query);
    }
  }, [query]);

  return (
    <div className='min-h-screen bg-gray-100 dark:bg-gray-900 p-4'>
      <div className='flex justify-between items-center mb-4'>
        <h1 className='text-2xl font-bold text-gray-900 dark:text-gray-100'>
          Search Neighbors
        </h1>
        <DarkModeToggle />
      </div>
      <div className='mb-4'>
        <div className='flex items-center gap-2'>
          <input
            type='text'
            name='query'
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder='Search...'
            className='p-2 border border-gray-300 rounded w-1/4 text-gray-900 bg-white dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700'
          />
          <button
            onClick={handleSearch}
            type='submit'
            className='p-2 bg-blue-500 text-white rounded dark:bg-blue-700'
          >
            Search
          </button>
        </div>
      </div>
      <div className='mb-4'>
        <label
          htmlFor='k-input'
          className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'
        >
          Number of results (k)
        </label>
        <input
          id='k-input'
          type='number'
          min='1'
          value={k}
          onChange={(e) =>
            setK(Math.max(1, parseInt(e.target.value, 120) || 1))
          }
          placeholder='Number of results (k)'
          className='p-2 border border-gray-300 rounded w-1/8 text-gray-900 bg-white dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700'
        />
      </div>

      {loading && <Loading />}
      {query && !loading ? (
        <SearchResults results={results} />
      ) : (
        !loading &&
        !query && (
          <p className='text-gray-900 dark:text-gray-100'>
            Please enter a query to search.
          </p>
        )
      )}
    </div>
  );
};

export default SearchPage;
