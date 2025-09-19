'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';

interface DonorsCountProps {
  count?: number;
  isLoading?: boolean;
}

export function DonorsCount({ count = 2000, isLoading = false }: DonorsCountProps) {
  const [displayCount, setDisplayCount] = useState(count);

  useEffect(() => {
    setDisplayCount(count);
  }, [count]);

  if (isLoading) {
    return (
      <div className="bg-donation-teal rounded-2xl px-6 py-6 shadow-lg">
        <div className="text-white text-center">
          <div className="w-32 h-6 bg-gray-200 rounded animate-pulse mx-auto mb-4"></div>
          <div className="w-24 h-24 bg-gray-200 rounded animate-pulse mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="  ">
      <div className="text-white text-center">
        <h3 className="rounded-2xl shadow-lg bg-[#004B4B] p-4 w-full font-somar font-bold text-xl leading-none tracking-tight flex items-center justify-center mb-4">
          عدد المتبرعين: {displayCount.toLocaleString()}
        </h3>

        {/* QR Code Placeholder */}
        <div className="w-32 h-32 p-4 bg-white rounded-lg mx-auto flex items-center justify-center">
          <Image src="/images/code.png" alt="QR Code" width={96} height={96} />
        </div>
      </div>
    </div>
  );
}
