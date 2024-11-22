export const Loading = () => (
  <div className='flex justify-center items-center h-16'>
    <div className='flex gap-2'>
      <span className='w-3 h-3 bg-green-700 rounded-full animate-bounce' />
      <span className='w-3 h-3 bg-yellow-700 rounded-full animate-bounce delay-[200ms]' />
      <span className='w-3 h-3 bg-red-700 rounded-full animate-bounce delay-[400ms]' />
    </div>
  </div>
);
