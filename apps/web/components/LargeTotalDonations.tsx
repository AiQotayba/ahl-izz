'use client';

import { useState, useEffect } from 'react';

interface LargeTotalDonationsProps {
  totalAmount?: number;
  companyName?: string;
  isLoading?: boolean;
}

export function LargeTotalDonations({ 
  totalAmount = 1000000000000, 
  companyName = "شركة الجبل",
  isLoading = false 
}: LargeTotalDonationsProps) {
  const [displayAmount, setDisplayAmount] = useState(totalAmount);

  useEffect(() => {
    setDisplayAmount(totalAmount);
  }, [totalAmount]);

  if (isLoading) {
    return (
      <div className="w-full max-w-md mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="bg-donation-gold px-6 py-12 text-center">
          <div className="w-64 h-12 bg-gray-200 rounded animate-pulse mx-auto"></div>
        </div>
        <div className="bg-donation-teal px-6 py-6 text-center">
          <div className="w-32 h-6 bg-gray-200 rounded animate-pulse mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
      {/* Amount Section */}
      <div className="bg-donation-gold px-6 py-12 text-center">
        <div className="text-white font-bold text-4xl">
          $ {displayAmount.toLocaleString()}
        </div>
      </div>

      {/* Company Section */}
      <div className="bg-donation-teal px-6 py-6 text-center">
        <div className="text-white font-bold text-lg">
          {companyName}
        </div>
      </div>
    </div>
  );
}
