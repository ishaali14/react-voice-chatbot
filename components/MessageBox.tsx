import React from 'react';


interface MessageBoxProps {
  message: string;
}


export default function MessageBox({ message }: MessageBoxProps) {
  return (
    <div className="flex items-center justify-start w-full">
      <div className="text-gray-800 dark:text-gray-200 font-normal text-lg leading-relaxed transition-colors duration-300">
        {message}
      </div>
    </div>
  );
}
