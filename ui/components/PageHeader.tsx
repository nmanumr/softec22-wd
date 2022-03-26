
import React from 'react';

interface Props {
  title: string;
}

export default function PageHeader({ title, children }: React.PropsWithChildren<Props>) {
  return (
    <div className="md:flex md:items-center mb-6 md:justify-between">
      <div className="flex-1 min-w-0">
        <h2 className="text-3xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">{title}</h2>
      </div>
      <div className="mt-4 flex md:mt-0 md:ml-4">
        {children}
      </div>
    </div>
  );
}