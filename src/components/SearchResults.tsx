import Image from 'next/image';

type Result = {
  id: string;
  _distance: number;
  text: string;
  img: string;
};

type SearchResultsProps = {
  results: Result[];
};

const SearchResults = ({ results }: SearchResultsProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {results.map((result) => (
        <div key={result.id} className="bg-white p-4 rounded shadow">
          <div dangerouslySetInnerHTML={{ __html: result.img }} />
          <p className="mt-2 text-sm text-gray-700">{result.text}</p>
          <p className="text-xs text-gray-500">Distance: {result._distance}</p>
        </div>
      ))}
    </div>
  );
};

export default SearchResults;
