'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import DarkModeToggle from '@/components/DarkMode';
import SearchResults from '@/app/search/SearchResults';
import { Loading } from '@/components/Loading';

const SearchPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Initialize state from URL parameters or defaults
  const initialQuery = searchParams.get('query') || '';
  const initialK = parseInt(searchParams.get('k') || '20', 10);

  const [input, setInput] = useState(initialQuery);
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [k, setK] = useState(initialK);

  const updateURL = (newQuery: string, newK: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('query', newQuery);
    params.set('k', newK.toString());

    const newURL = `${window.location.pathname}${
      params.toString() ? '?' + params.toString() : ''
    }`;
    // Update URL without reloading the page
    router.push(newURL, { scroll: false });
  };

  const fetchResults = async (queryText: string) => {
    setLoading(true);

    try {
      const url = new URL(
        '/api/neighbors',
        process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'
      );
      url.searchParams.set('input', queryText);
      url.searchParams.set('k', k.toString());

      const response = await fetch(url);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch results');
      }

      const data = await response.json();
      console.log('# of results: ', data.length);
      setResults(data);
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (input.trim()) {
      setQuery(input);
      updateURL(input, k);
    }
  };

  const handleKChange = (newK: number) => {
    const validK = Math.min(50, Math.max(1, newK));
    setK(validK);
    if (query) {
      updateURL(query, validK);
    }
  };

  useEffect(() => {
    if (query) {
      fetchResults(query);
    }
  }, [query, k]);

  return (
    <div className='min-h-screen bg-gray-100 dark:bg-gray-900 p-4'>
      <div className='flex justify-between items-center mb-4'>
        <h1 className='text-2xl font-bold text-gray-900 dark:text-gray-100'>
          Search Neighbors
        </h1>
        <DarkModeToggle />
      </div>
      <div className='mb-4'>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch();
          }}
        >
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
              type='submit'
              className='p-2 bg-blue-500 text-white rounded dark:bg-blue-700'
            >
              Search
            </button>
          </div>
        </form>
      </div>
      <div className='mb-4 flex gap-10'>
        <div>
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
            onChange={(e) => handleKChange(parseInt(e.target.value, 10) || 1)}
            placeholder='Number of results (k)'
            className='p-2 border border-gray-300 rounded w-1/8 text-gray-900 bg-white dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700'
          />
        </div>
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
