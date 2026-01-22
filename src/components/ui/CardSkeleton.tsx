import React from 'react'

const CardSkeleton = () => {
  return (
<div role="status" className="animate-pulse w-full max-w-sm md:max-w-full">
      
      {/* Mobile: Big Box | Desktop: Hidden */}
      <div className="block md:hidden h-48 w-full bg-gray-300 dark:bg-neutral-quaternary rounded-xl mb-4"></div>

      {/* Text Section */}
      <div className="w-full">
        {/* Mobile: Title looks like H4 | Desktop: Looks like H2.5 */}
        <div className="h-4 md:h-2.5 bg-gray-300 dark:bg-neutral-quaternary rounded-full w-3/4 md:w-48 mb-4"></div>

        <div className="h-3 md:h-2 bg-gray-300 dark:bg-neutral-quaternary rounded-full mb-2.5"></div>
        <div className="h-3 md:h-2 bg-gray-300 dark:bg-neutral-quaternary rounded-full w-5/6 mb-2.5"></div>
        <div className="h-3 md:h-2 bg-gray-300 dark:bg-neutral-quaternary rounded-full w-4/6"></div>
      </div>

      <span className="sr-only">Loading...</span>
    </div>
  );
}

export default CardSkeleton