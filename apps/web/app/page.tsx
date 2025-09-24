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
import { cn } from '@/lib/utils';

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
  message: string;
  createdAt: string;
}

export default function HomePage() {
  // Add CSS to hide scrollbars and ensure proper scaling
  useEffect(() => {
    // Hide scrollbars globally
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';

    return () => {
      // Restore scrollbars on cleanup
      document.body.style.overflow = 'auto';
      document.documentElement.style.overflow = 'auto';
    };
  }, []);

  const [stats, setStats] = useState<Stats>({
    totalAmount: 0,
    totalCount: 0,
    loading: true
  });

  const [liveDonations, setLiveDonations] = useState<LiveDonation[]>([]);
  const [topDonations, setTopDonations] = useState<any[]>([]);
  const [newDonationAnimation, setNewDonationAnimation] = useState<string | null>(null);
  const [counterAnimation, setCounterAnimation] = useState<boolean>(false);
  const [notification, setNotification] = useState<{
    show: boolean;
    message: string;
    donorName: string;
    amount: number;
  }>({
    show: false,
    message: '',
    donorName: '',
    amount: 0
  });

  // Helper function to add new donation to both live and top donations
  const addNewDonation = (pledge: any) => {

    const newDonation = {
      _id: pledge._id,
      fullName: pledge.fullName || "فاعل خير",
      amount: pledge.amount,
      message: pledge.message,
      createdAt: pledge.createdAt
    };

    // Show notification for 5 seconds
    setNotification({
      show: true,
      message: pledge.message,
      donorName: pledge.fullName || "فاعل خير",
      amount: pledge.amount
    });

    // Hide notification after 5 seconds
    setTimeout(() => {
      setNotification(prev => ({ ...prev, show: false }));
    }, 5000);

    // Trigger counter animation
    setCounterAnimation(true);
    setTimeout(() => setCounterAnimation(false), 2000);

    // Trigger new donation animation
    setNewDonationAnimation(newDonation._id);
    setTimeout(() => setNewDonationAnimation(null), 3000);

    // Add to live donations
    setLiveDonations((prev: any) => [
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

        // Set default values instead of showing error
        setStats({
          totalAmount: 0,
          totalCount: 0,
          loading: false,
          error: undefined
        });
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

        // Set empty arrays instead of showing error
        setLiveDonations([]);
        setTopDonations([]);
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
  console.log(notification);
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
      className={cn(
        "flex flex-col lg:flex-row items-center justify-center min-h-screen overflow-hidden p-3 sm:p-6 relative",
        "scale-130 w-full h-full overflow-hidden bg-cover position-center bg-no-repeat"
      )}
      style={{
        backgroundImage: 'url(/images/bg2.png)',
        // backgroundSize: 'cover',
        // backgroundPosition: 'center',
        // backgroundRepeat: 'no-repeat',
        transformOrigin: 'center center',
        // overflow: 'hidden',
      }}
      dir="rtl"
    >
      <div className="flex flex-col gap-6 items-center justify-center lg:flex-row lg:mx-10 mx-2 sm:mx-5 w-full">
        <div className="max-w-7xl ">
          {/* Logo Section */}
          <div className="flex justify-center items-center lg:items-start md:justify-start mb-4 sm:mb-6 lg:mb-8 flex-col">
            <div className='flex justify-between items-center w-full'>
              <Logo />
              {/* حملة تزويج قتيبة */}
              {/* <h1 className="text-5xl max-w-[300px] font-bold font-somar text-white leading-snug">
                حملة تزويج<br />
                قتيبـــــــــــة
              </h1> */}
              <div className="flex items-center gap-2">
                {/* Notification for new donations */}
                {notification.show && (
                  <>
                    {/* Top-right notification */}
                    <div
                      style={{
                        backgroundColor: '#ffffff',
                        borderRadius: '12px',
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                        border: '2px solid #10b981',
                        padding: '10px',
                        maxWidth: '350px',
                        minWidth: '300px',
                        transform: 'translateX(0)',
                        opacity: 1,
                        animation: 'slideInFromRight 0.6s ease-out',
                        fontFamily: 'Somar, sans-serif'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{
                          width: '12px',
                          height: '12px',
                          backgroundColor: '#10b981',
                          borderRadius: '50%',
                          animation: 'pulse 2s infinite'
                        }}></div>
                        <div style={{ flex: 1 }} className='flex flex-row justify-between items-center'>

                          <div style={{ color: '#374151', fontWeight: '600', fontSize: '14px', marginBottom: '4px' }}>
                            {notification.donorName}
                          </div>
                          <div className='text-[#10b981] font-somar font-bold text-xl mb-4' >
                            ${notification.amount.toLocaleString()}
                          </div>

                        </div>
                      </div>
                    </div>

                    {/* Center notification for testing */}

                  </>
                )}
              </div>
            </div>
            <p className='text-sm text-white font-somar font-bold mt-4 lg:hidden'>هذا الصفحة   متاحة فقط على اجهزة الحاسوب</p>
            <p className='text-sm text-white font-somar font-bold mt-4 lg:hidden'>
              <Link href='/donate' className='text-donation-teal px-3 py-2 bg-white rounded-lg'>العودة لصفحة التبرع </Link></p>
          </div>

          {/* اعلى التبرعات */}
          <div className="mb-4 sm:mb-6 lg:mb-8 hidden lg:block">
            <TopDonations donations={topDonations} isLoading={stats.loading} />
          </div>

          {/* صف (اجمالي التبرعات و عدد المتبرعين) */}
          <div className=" flex-col sm:flex-row justify-between items-end gap-4 sm:gap-6 lg:gap-8 mb-4 sm:mb-6 lg:mb-8 max-w-[900px] hidden lg:flex">
            <div className={`flex justify-center w-full sm:w-auto ${counterAnimation ? 'animate-glow' : ''}`}>
              <TotalDonations totalAmount={stats.totalAmount} isLoading={stats.loading} />
            </div>
            <div className={`flex justify-center w-full sm:w-auto ${counterAnimation ? 'animate-glow' : ''}`}>
              <DonorsCount count={stats.totalCount} isLoading={stats.loading} />
            </div>
          </div>

        </div>

        {/* التبرعات المباشرة */}
        <div className="hidden items-center lg:flex max-w-7xl px-3 sm:px-6">
          <div className="flex justify-center w-full">
            <div className={newDonationAnimation ? 'animate-glow' : ''}>
              <LiveDonations donations={liveDonations} isLoading={stats.loading} />
            </div>
          </div>
        </div>
      </div >
    </div >
  );
}

