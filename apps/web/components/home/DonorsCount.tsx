'use client';

import Image from 'next/image';
import Link from 'next/link';
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
      <div className="">
        <div className="text-white text-center">
          {/* Title Skeleton */}
          <div className="rounded-2xl shadow-lg bg-[#004B4B] p-4 w-full mb-4">
            <div className="w-48 h-6 bg-gray-200 rounded animate-pulse mx-auto"></div>
          </div>

          {/* QR Code Skeleton */}
          <div className="w-32 h-32 bg-gray-200 rounded-lg mx-auto animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="text-white text-center">
      <h3 className="rounded-2xl shadow-lg bg-[#004B4B] p-4 w-full font-somar font-bold text-xl leading-none tracking-tight flex items-center justify-center mb-4">
        عدد المتبرعين: {displayCount.toLocaleString()}
      </h3>

      {/* QR Code Placeholder */}
      <Link href="/donate"  >
        <Image src="/images/qr-code.png" alt="QR Code" width={180} height={180}
          className=" bg-white rounded-lg mx-auto flex items-center justify-center"
        />
      </Link>
    </div>
  );
}
