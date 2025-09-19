'use client';

import { useState, useEffect } from 'react';
import { Logo } from '@/components/Logo';
import { LiveDonations } from '@/components/LiveDonations';
import { TopDonations } from '@/components/TopDonations';
import { TotalDonations } from '@/components/TotalDonations';
import { DonorsCount } from '@/components/DonorsCount';

interface PledgeStats {
  totalCount: number;
  totalAmount: number;
  statusCounts: Record<string, number>;
}

export default function HomePage() {
  const [stats, setStats] = useState({
    totalAmount: 1000000,
    donorsCount: 2000,
    loading: false
  });

  return (
    <div
      className="flex flex-row items-center justify-center min-h-screen overflow-hidden p-6 relative m-auto"
      style={{
        backgroundImage: 'url(/bg2.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
      dir="rtl"
    >
      <div className="flex flex-row items-center justify-center mx-10 w-full">
        <div className="max-w-7xl mx-auto">
          {/* Logo Section */}
          <div className="flex justify-start mb-8">
            <Logo />
          </div>

          {/* اعلى التبرعات */}
          <div className="mb-8">
            <TopDonations />
          </div>

          {/* صف (اجمالي التبرعات و عدد المتبرعين) */}
          <div className="flex flex-row gap-8 mb-8 max-w-[797px]">
            <div className="flex justify-center">
              <TotalDonations totalAmount={stats.totalAmount} isLoading={stats.loading} />
            </div>
            <div className="flex justify-center">
              <DonorsCount count={stats.donorsCount} isLoading={stats.loading} />
            </div>
          </div>

        </div>

        {/* التبرعات المباشرة */}
        <div className="max-w-7xl mx-auto px-6 flex items-center">
          <div className="flex justify-center">
            <LiveDonations />
          </div>
        </div>
      </div>
    </div>
  );
}

