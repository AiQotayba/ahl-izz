'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

interface TotalDonationsProps {
  totalAmount?: number;
  isLoading?: boolean;
}

export function TotalDonations({ totalAmount = 1000000, isLoading = false }: TotalDonationsProps) {
  const [displayAmount, setDisplayAmount] = useState(totalAmount);

  useEffect(() => {
    setDisplayAmount(totalAmount);
  }, [totalAmount]);

  if (isLoading) {
    return (
      <div className="w-[544px] h-[219px] bg-white rounded-[17px] shadow-lg overflow-hidden">
        <div className="bg-white px-6 py-4">
          <div className="flex items-center justify-center gap-3">
            <div className="w-6 h-6 bg-gray-200 rounded animate-pulse"></div>
            <div className="w-32 h-6 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
        <div className="bg-donation-olive px-6 py-8 text-center">
          <div className="w-40 h-8 bg-gray-200 rounded animate-pulse mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-[544px] h-[219px] bg-white rounded-[17px] shadow-lg overflow-hidden p-5">
      {/* Header Section */}
      <div className=" px-6 py-4">
        <div className="flex items-center justify-start gap-3">
          {/* Icon */}
          <div className="w-[54px] h-[53px] rounded-[10px] border-[1px] p-1 bg-[#056D5E] flex items-center justify-center">
            <Image src="/mdi_donation.png" alt="Hand" width={30} height={30} />
          </div>

          {/* Title */}
          <h2 className={cn("h-[55px] font-somar font-bold text-4xl leading-none tracking-tight text-right",
            " flex items-center text-[#056D5E]")}>
            إجمالي التبرعات
          </h2>
        </div>
      </div>

      {/* Amount Section */}
      <div className="w-full h-[83px] rounded-lg border-[1px] border-white bg-[#BBAC15] flex items-center justify-center">
        <div className=" font-somar font-bold text-5xl leading-none tracking-tight text-center flex items-center justify-center text-[#056D5E]">
          ${displayAmount.toLocaleString()}
        </div>
      </div>
    </div>
  );
}
