// SearchPage.server.jsx
import { Suspense } from 'react';
import SearchResults from '@/components/SearchResults';
import DarkModeToggle from '@/components/DarkMode';

// Converting to a server component with suspense
interface SearchPageProps {
  searchParams: {
    query?: string;
  };
}

const SearchPage = async ({ searchParams }: SearchPageProps) => {
  const query = searchParams?.query || '';
  let results = [];

  if (query) {
    const url = new URL(
      '/api/neighbors',
      process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'
    );
    url.searchParams.set('input', query);
    url.searchParams.set('k', '120');

    const response = await fetch(url);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to fetch results');
    }

    results = await response.json();
  }

  return (
    <div className='min-h-screen bg-gray-100 dark:bg-gray-900 p-4'>
      <div className='flex justify-between items-center mb-4'>
        <h1 className='text-2xl font-bold text-gray-900 dark:text-gray-100'>
          Search Neighbors
        </h1>
        <DarkModeToggle /> {/* This remains a client component */}
      </div>
      <form method='GET' action='/search' className='mb-4'>
        <input
          type='text'
          name='query'
          defaultValue={query}
          placeholder='Search...'
          className='p-2 border border-gray-300 rounded w-full mb-2 text-gray-900 bg-white dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700'
        />
        <button
          type='submit'
          className='p-2 bg-blue-500 text-white rounded dark:bg-blue-700'
        >
          Search
        </button>
      </form>
      {query ? (
        <Suspense
          fallback={
            <p className='text-gray-900 dark:text-gray-100'>Loading...</p>
          }
        >
          <SearchResults results={results} />
        </Suspense>
      ) : (
        <p className='text-gray-900 dark:text-gray-100'>
          Please enter a query to search.
        </p>
      )}
    </div>
  );
};

export default SearchPage;
