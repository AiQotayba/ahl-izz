'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { StatsCard } from '@/components/StatsCard';
import { Users, DollarSign, TrendingUp, Clock } from 'lucide-react';
import { pledgeAPI } from '@/lib/api';

interface DashboardStats {
  totalCount: number;
  totalAmount: number;
  statusCounts: Record<string, number>;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalCount: 0,
    totalAmount: 0,
    statusCounts: {}
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await pledgeAPI.getStats();
        if (response.data.success) {
          setStats(response.data.data);
        }
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Overview of the Aleppo relief campaign</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Total Pledges"
          value={stats.totalCount.toLocaleString()}
          icon={<Users className="h-8 w-8" />}
          loading={loading}
        />
        <StatsCard
          title="Total Amount"
          value={`$${stats.totalAmount.toLocaleString()}`}
          icon={<DollarSign className="h-8 w-8" />}
          loading={loading}
        />
        <StatsCard
          title="Confirmed"
          value={stats.statusCounts.confirmed?.toLocaleString() || '0'}
          icon={<TrendingUp className="h-8 w-8" />}
          loading={loading}
        />
        <StatsCard
          title="Pending Review"
          value={stats.statusCounts.pending?.toLocaleString() || '0'}
          icon={<Clock className="h-8 w-8" />}
          loading={loading}
        />
      </div>

      {/* Status Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Pledge Status Breakdown</CardTitle>
            <CardDescription>
              Distribution of pledges by status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(stats.statusCounts).map(([status, count]) => (
                <div key={status} className="flex items-center justify-between">
                  <span className="capitalize text-sm font-medium text-gray-700">
                    {status}
                  </span>
                  <span className="text-sm text-gray-500">
                    {count.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common administrative tasks
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <a
                href="/admin/pledges"
                className="block w-full text-left px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-md"
              >
                Manage Pledges
              </a>
              <a
                href="/admin/users"
                className="block w-full text-left px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-md"
              >
                Manage Users
              </a>
              <a
                href="/"
                className="block w-full text-left px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-md"
              >
                View Public Site
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

