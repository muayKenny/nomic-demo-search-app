// error.tsx
'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className='fixed inset-0 flex items-center justify-center bg-gray-900/50 backdrop-blur-sm z-50'>
      <div className='p-6 max-w-sm mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-xl'>
        <h2 className='text-red-600 dark:text-red-400 font-semibold mb-2'>
          Something went wrong!
        </h2>
        <p className='text-gray-600 dark:text-gray-300 text-sm mb-4'>
          {error.message || 'Please try again'}
        </p>
        <a
          href='/search'
          className='block w-full px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors text-center'
        >
          Try again
        </a>
      </div>
    </div>
  );
}
