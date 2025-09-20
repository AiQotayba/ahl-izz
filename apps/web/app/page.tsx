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
import Link from 'next/link';

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
  const [newDonationAnimation, setNewDonationAnimation] = useState<string | null>(null);
  const [counterAnimation, setCounterAnimation] = useState<boolean>(false);

  // Helper function to add new donation to both live and top donations
  const addNewDonation = (pledge: any) => {
    const newDonation = {
      _id: pledge._id,
      fullName: pledge.fullName || "فاعل خير",
      amount: pledge.amount,
      createdAt: pledge.createdAt
    };

    // Trigger counter animation
    setCounterAnimation(true);
    setTimeout(() => setCounterAnimation(false), 2000);

    // Trigger new donation animation
    setNewDonationAnimation(newDonation._id);
    setTimeout(() => setNewDonationAnimation(null), 3000);

    // Add to live donations
    setLiveDonations(prev => [
      newDonation,
      ...prev.slice(0, 9) // Keep only latest 10
    ]);

    // Check if this donation should be added to top donations
    setTopDonations(prev => {
      const newTopDonations = [...prev, newDonation]
        .sort((a, b) => b.amount - a.amount) // Sort by amount descending
        .slice(0, 5); // Keep only top 5

      // Only update if the new donation made it to top 5
      if (newTopDonations.some(donation => donation._id === newDonation._id)) {
        console.log('New donation added to top donations:', newDonation);
        return newTopDonations;
      }

      return prev; // No change if not in top 5
    });
  };

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
    console.log('Setting up socket connection...');

    // Only connect if we're in the browser
    if (typeof window !== 'undefined') {
      socketService.connect();

      // Log connection status
      const checkConnection = () => {
        console.log('Socket connected:', socketService.connected);
        socketService.testConnection();
        if (!socketService.connected) {
          console.warn('Socket not connected, attempting to reconnect...');
          socketService.reconnect();
        }
      };

      // Check connection after a short delay
      const timeoutId = setTimeout(checkConnection, 2000);

      // Listen for stats updates (primary source of truth)
      const handleStatsUpdate = (data: any) => {
        console.log('Stats update received:', data);

        // Trigger counter animation for stats
        setCounterAnimation(true);
        setTimeout(() => setCounterAnimation(false), 1500);

        setStats(prev => ({
          ...prev,
          totalAmount: data.totalAmount || prev.totalAmount,
          totalCount: data.totalCount || prev.totalCount
        }));
      };

      // Listen for new confirmed pledges (for live donations)
      const handlePledgeConfirmed = (data: any) => {
        console.log('Pledge confirmed received:', data);

        if (data.pledge) {
          addNewDonation(data.pledge);
        }
      };

      // Listen for new pledges (for immediate feedback)
      const handleNewPledge = (data: any) => {
        console.log('New pledge received:', data);

        // Only add to live donations if already confirmed
        if (data.pledge && data.pledge.pledgeStatus === 'confirmed') {
          addNewDonation(data.pledge);
        }
      };

      socketService.on('stats-update', handleStatsUpdate);
      socketService.on('pledge-confirmed', handlePledgeConfirmed);
      socketService.on('new-pledge', handleNewPledge);

      return () => {
        clearTimeout(timeoutId);
        socketService.off('stats-update', handleStatsUpdate);
        socketService.off('pledge-confirmed', handlePledgeConfirmed);
        socketService.off('new-pledge', handleNewPledge);
      };
    }
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
      className="flex flex-col lg:flex-row items-center justify-center min-h-screen overflow-hidden p-3 sm:p-6 relative"
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
          <div className="flex justify-center items-center md:justify-start mb-4 sm:mb-6 lg:mb-8 flex-col">
            <Logo />
            <p className='text-sm text-white font-somar font-bold mt-4 lg:hidden'>هذا الصفحة   متاحة فقط على اجهزة الحاسوب</p>
            <p className='text-sm text-white font-somar font-bold mt-4 lg:hidden'>
              <Link href='/donate' className='text-donation-teal px-3 py-2 bg-white rounded-lg'>العودة لصفحة التبرع </Link></p>
          </div>

          {/* اعلى التبرعات */}
          <div className="mb-4 sm:mb-6 lg:mb-8 hidden lg:block">
            <TopDonations donations={topDonations} />
          </div>

          {/* صف (اجمالي التبرعات و عدد المتبرعين) */}
          <div className=" flex-col sm:flex-row justify-between gap-4 sm:gap-6 lg:gap-8 mb-4 sm:mb-6 lg:mb-8 max-w-[900px] hidden lg:flex">
            <div className="flex justify-center w-full sm:w-auto">
              <div className={counterAnimation ? 'animate-glow' : ''}>
                <TotalDonations totalAmount={stats.totalAmount} isLoading={stats.loading} />
              </div>
            </div>
            <div className="flex justify-center w-full sm:w-auto">
              <div className={counterAnimation ? 'animate-glow' : ''}>
                <DonorsCount count={stats.totalCount} isLoading={stats.loading} />
              </div>
            </div>
          </div>

        </div>

        {/* التبرعات المباشرة */}
        <div className="max-w-7xl mx-auto px-3 sm:px-6 items-center w-full lg:w-auto hidden lg:flex">
          <div className="flex justify-center w-full">
            <div className={newDonationAnimation ? 'animate-glow' : ''}>
              <LiveDonations donations={liveDonations} isLoading={stats.loading} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

