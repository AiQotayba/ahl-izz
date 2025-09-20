'use client';

import { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import Image from 'next/image';
// import Image from 'next/image'; // Temporarily disabled for Vercel compatibility

interface TotalDonationsProps {
  totalAmount?: number;
  isLoading?: boolean;
}

export function TotalDonations({ totalAmount = 1000000, isLoading = false }: TotalDonationsProps) {
  const [displayAmount, setDisplayAmount] = useState(totalAmount);
  const [isAnimating, setIsAnimating] = useState(false);
  const previousAmount = useRef(totalAmount);

  useEffect(() => {
    if (totalAmount !== previousAmount.current) {
      setIsAnimating(true);

      // Animate the counter
      const startAmount = previousAmount.current;
      const endAmount = totalAmount;
      const duration = 2000; // 2 seconds
      const startTime = Date.now();

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Easing function for smooth animation
        const easeOutCubic = 1 - Math.pow(1 - progress, 3);
        const currentAmount = Math.floor(startAmount + (endAmount - startAmount) * easeOutCubic);

        setDisplayAmount(currentAmount);

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          setDisplayAmount(endAmount);
          setIsAnimating(false);
          previousAmount.current = endAmount;
        }
      };

      requestAnimationFrame(animate);
    }
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
    <div className={cn(
      "w-[544px] h-[219px] bg-white rounded-[17px] shadow-lg overflow-hidden p-5 transition-all duration-300",
      isAnimating && "shadow-xl shadow-green-400/20"
    )}>
      {/* Header Section */}
      <div className="py-4">
        <div className="flex items-center justify-start gap-3">
          {/* Icon */}
          <div className={cn(
            "w-[54px] h-[53px] rounded-[10px] border-[1px] p-1 bg-[#056D5E] flex items-center justify-center transition-all duration-300",
          )}>
            <Image src="/images/mdi_donation.png" alt="Hand" width={30} height={30} />
          </div>

          {/* Title */}
          <h2 className={cn("h-[55px] font-somar font-bold text-4xl leading-none tracking-tight text-right flex items-center text-[#056D5E] transition-all duration-300",
            isAnimating && "text-green-600"
          )}>
            إجمالي التبرعات
          </h2>
        </div>
      </div>

      {/* Amount Section */}
      <div className={cn(
        "w-full h-[83px] rounded-lg border-[1px] border-white bg-[#BBAC15] flex items-center justify-center transition-all duration-300",
        isAnimating && "animate-pulse shadow-lg shadow-green-400/50"
      )}>
        <div className={cn(
          "font-somar font-bold text-5xl leading-none tracking-tight text-center flex items-center justify-center text-[#056D5E] transition-all duration-300 relative",

        )}>
          ${displayAmount.toLocaleString()}

          {/* Digital counter effect */}
          {isAnimating && (
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-green-400/20 to-transparent animate-pulse"></div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
