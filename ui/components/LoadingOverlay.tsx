import React from "react";

export default function LoadingOverlay({ text }: {text?: string}) {
  return (
    <div className="absolute left-0 top-0 right-0 bottom-0 z-50 bg-white bg-opacity-50 flex items-center justify-center">
      <div className="flex flex-col items-center space-y-4">
        <div className="border-[3px] border-gray-300 border-t-gray-600 w-8 h-8 rounded-full animate-spin" />
        {text && <p className="text-sm text-gray-700 mt-2">{text}</p>}
      </div>
    </div>
  );
}