'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Heart, DollarSign } from 'lucide-react';
import { formatCurrency, formatRelativeTime } from '@/lib/utils';
import { socketService } from '@/lib/socket';

export function PledgeFeed() {
  const [pledges, setPledges] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch initial pledges
    const fetchPledges = async () => {
      try {
        const response = await fetch('/api/pledges/public?limit=20');
        const data = await response.json();
        if (data.success) {
          setPledges(data.data);
        }
      } catch (error) {
        console.error('Failed to fetch pledges:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPledges();

    // Connect to socket for real-time updates
    socketService.connect();

    // Listen for new pledges
    const handleNewPledge = (data: { pledge: any }) => {
      setPledges(prev => [data.pledge, ...prev.slice(0, 19)]);
    };

    // Listen for stats updates
    const handleStatsUpdate = (data: { totalCount: number; totalAmount: number }) => {
      // You can emit a custom event or update a global state here
      window.dispatchEvent(new CustomEvent('statsUpdate', { detail: data }));
    };

    socketService.on('new-pledge', handleNewPledge);
    socketService.on('stats-update', handleStatsUpdate);

    return () => {
      socketService.off('new-pledge', handleNewPledge);
      socketService.off('stats-update', handleStatsUpdate);
    };
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                  <div className="h-3 bg-gray-200 rounded w-16"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (pledges.length === 0) {
    return (
      <div className="text-center py-12">
        <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No pledges yet
        </h3>
        <p className="text-gray-500">
          Be the first to make a pledge for Aleppo relief efforts
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {pledges.map((pledge) => (
        <Card key={pledge._id} className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 bg-red-100 rounded-full flex items-center justify-center">
                <Heart className="h-5 w-5 text-red-500" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {pledge.donorName || 'Anonymous'}
                  </p>
                  <div className="flex items-center text-green-600">
                    <DollarSign className="h-4 w-4" />
                    <span className="text-sm font-semibold">
                      {formatCurrency(pledge.amount)}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-gray-500">
                  {formatRelativeTime(pledge.createdAt)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

