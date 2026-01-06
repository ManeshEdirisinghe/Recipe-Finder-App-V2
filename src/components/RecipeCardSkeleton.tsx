import React from 'react';

const RecipeCardSkeleton: React.FC = () => {
  return (
    <div className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded-lg shadow-md p-4 flex flex-col gap-4">
      <div className="h-40 w-full bg-gray-300 dark:bg-gray-600 rounded-md" />
      <div className="h-6 w-3/4 bg-gray-300 dark:bg-gray-600 rounded" />
      <div className="h-4 w-1/2 bg-gray-300 dark:bg-gray-600 rounded" />
      <div className="flex gap-2 mt-2">
        <div className="h-8 w-20 bg-gray-300 dark:bg-gray-600 rounded" />
        <div className="h-8 w-20 bg-gray-300 dark:bg-gray-600 rounded" />
      </div>
    </div>
  );
};

export default RecipeCardSkeleton;
