import { extractSrc } from '@/utils/utils';

export interface Result {
  id: string;
  img_text_sim: number;
  text: string;
  img: string;
}

interface SearchResultsProps {
  results: Result[];
}

const SearchResults = ({ results }: SearchResultsProps) => {
  if (results.length === 0) {
    return (
      <div className='text-gray-500 dark:text-gray-400'>No results found</div>
    );
  }

  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
      {results.map((result) => (
        <div
          key={result.id}
          className='bg-white p-4 rounded shadow dark:bg-gray-800 hover:shadow-lg transition-shadow duration-200'
        >
          <div className='relative h-48 w-full'>
            <img
              src={extractSrc(result.img)}
              alt={result.text || 'Image'}
              className='h-full w-full object-cover rounded'
            />
          </div>
          <p className='mt-2 text-sm text-gray-700 dark:text-gray-300 line-clamp-2'>
            {result.text || 'No description available'}
          </p>
          <p className='text-xs text-gray-500 mt-1'>
            Similarity: {(result.img_text_sim * 100).toFixed(1)}%
          </p>
        </div>
      ))}
    </div>
  );
};

export default SearchResults;
