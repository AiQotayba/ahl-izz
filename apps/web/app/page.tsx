'use client';

import { useState, useEffect } from 'react';
import { Logo } from '@/components/Logo';
import { LiveDonations } from '@/components/home/LiveDonations';
import { TopDonations } from '@/components/home/TopDonations';
import { TotalDonations } from '@/components/home/TotalDonations';
import { DonorsCount } from '@/components/home/DonorsCount';
import { Button } from '@/components/ui/button';
import { pledgeAPI } from '@/lib/api';
import { socketService } from '@/lib/socket';

interface Stats {
  totalAmount: number;
  totalCount: number;
  loading: boolean;
  error?: string;
}

interface Pledge {
  _id: string;
  fullName?: string;
  amount: number;
  createdAt: string;
  pledgeStatus: string;
}

interface LiveDonation {
  _id: string;
  fullName: string;
  amount: number;
  createdAt: string;
}

export default function HomePage() {
  const [stats, setStats] = useState<Stats>({
    totalAmount: 0,
    totalCount: 0,
    loading: true
  });

  const [liveDonations, setLiveDonations] = useState<LiveDonation[]>([]);
  const [topDonations, setTopDonations] = useState<any[]>([]);

  // Fetch initial statistics
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setStats(prev => ({ ...prev, loading: true, error: undefined }));
        const response = await pledgeAPI.getStats();
        const data = response.data.data;

        setStats({
          totalAmount: data.totalAmount || 0,
          totalCount: data.totalCount || 0,
          loading: false
        });
      } catch (error: any) {
        console.error('Failed to fetch stats:', error);
        setStats(prev => ({
          ...prev,
          loading: false,
          error: error.message || 'فشل في تحميل الإحصائيات'
        }));
      }
    };

    fetchStats();
  }, []);

  // Fetch public pledges for live donations and top donations
  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const { data } = await pledgeAPI.getPublic(10); // Get more to find top donations
        const pledges = data.data || [];
        const topDonationsData = data.topDonations || [];
        console.log('Pledges:', pledges);
        console.log('Top Donations:', topDonationsData);

        setLiveDonations(pledges);
        setTopDonations(topDonationsData);
      } catch (error) {
        console.error('Failed to fetch donations:', error);
      }
    };

    fetchDonations();
  }, []);

  // Set up socket connection for real-time updates
  useEffect(() => {
    socketService.connect();

    // Listen for new pledges
    const handleNewPledge = (data: any) => {
      console.log('New pledge received:', data);

      // Update stats
      setStats(prev => ({
        ...prev,
        totalAmount: prev.totalAmount + (data.amount || 0),
        donorsCount: prev.totalCount + 1
      }));

      // Add to live donations
      if (data.pledgeStatus === 'confirmed') {
        setLiveDonations(prev => [
          {
            _id: data._id,
            fullName: data.fullName ? `${data.fullName} من حلب` : 'مجهول',
            amount: data.amount,
            createdAt: data.createdAt
          },
          ...prev.slice(0, 9) // Keep only latest 10
        ]);
      }
    };

    // Listen for stats updates
    const handleStatsUpdate = (data: any) => {
      console.log('Stats update received:', data);
      setStats(prev => ({
        ...prev,
        totalAmount: data.totalAmount || prev.totalAmount,
        donorsCount: data.donorsCount || prev.totalCount
      }));
    };

    socketService.on('new-pledge', handleNewPledge);
    socketService.on('stats-update', handleStatsUpdate);

    return () => {
      socketService.off('new-pledge', handleNewPledge);
      socketService.off('stats-update', handleStatsUpdate);
    };
  }, []);

  // Show error state if there's an error and no data
  if (stats.error && stats.totalAmount === 0 && stats.totalCount === 0) {
    return (
      <div
        className="flex flex-col items-center justify-center min-h-screen p-3 sm:p-6"
        style={{
          backgroundImage: 'url(/images/bg2.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
        dir="rtl"
      >
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 sm:p-6 lg:p-8 text-center max-w-xs sm:max-w-md mx-4">
          <h2 className="text-xl sm:text-2xl font-bold text-red-600 mb-3 sm:mb-4">خطأ في تحميل البيانات</h2>
          <p className="text-sm sm:text-base text-gray-700 mb-3 sm:mb-4">{stats.error}</p>
          <Button
            onClick={() => window.location.reload()}
            className="bg-donation-teal hover:bg-donation-teal/90 text-white text-sm sm:text-base px-4 sm:px-6 py-2 sm:py-3"
          >
            إعادة المحاولة
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="flex flex-col lg:flex-row items-center justify-center min-h-screen overflow-hidden p-3 sm:p-6 relative  m-4"
      style={{
        backgroundImage: 'url(/images/bg2.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
      dir="rtl"
    >
      <div className="flex flex-col lg:flex-row items-center justify-center mx-2 sm:mx-5 lg:mx-10 w-full gap-6 lg:gap-0">
        <div className="max-w-7xl mx-auto w-full">
          {/* Logo Section */}
          <div className="flex justify-start mb-4 sm:mb-6 lg:mb-8">
            <Logo />
          </div>

          {/* اعلى التبرعات */}
          <div className="mb-4 sm:mb-6 lg:mb-8 hidden sm:block">
            <TopDonations donations={topDonations} />
          </div>

          {/* صف (اجمالي التبرعات و عدد المتبرعين) */}
          <div className=" flex-col sm:flex-row justify-between gap-4 sm:gap-6 lg:gap-8 mb-4 sm:mb-6 lg:mb-8 max-w-[900px] hidden sm:flex">
            <div className="flex justify-center w-full sm:w-auto">
              <TotalDonations totalAmount={stats.totalAmount} isLoading={stats.loading} />
            </div>
            <div className="flex justify-center w-full sm:w-auto">
              <DonorsCount count={stats.totalCount} isLoading={stats.loading} />
            </div>
          </div>

        </div>

        {/* التبرعات المباشرة */}
        <div className="max-w-7xl mx-auto px-3 sm:px-6 items-center w-full lg:w-auto hidden sm:flex">
          <div className="flex justify-center w-full">
            <LiveDonations donations={liveDonations} isLoading={stats.loading} />
          </div>
        </div>
      </div>
    </div>
  );
}

