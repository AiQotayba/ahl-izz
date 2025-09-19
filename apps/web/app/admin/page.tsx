'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { StatsCard } from '@/components/StatsCard';
import { Users, DollarSign, TrendingUp, Clock } from 'lucide-react';
import { pledgeAPI } from '@/lib/api';
import Link from 'next/link';

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
          setStats({
            totalCount: response.data.data.totalCount || 0,
            totalAmount: response.data.data.totalAmount || 0,
            statusCounts: response.data.data.statusCounts || {}
          });
        }
      } catch (error) {
        console.error('Failed to fetch stats:', error);
        // Keep default values on error
        setStats({
          totalCount: 0,
          totalAmount: 0,
          statusCounts: {}
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className='h-screen overflow-y-auto'>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-donation-darkTeal font-somar mb-2">لوحة التحكم</h1>
        <p className="text-donation-teal font-somar text-lg">نظرة عامة على حملة حلب الإغاثية</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="إجمالي التبرعات"
          value={stats.totalCount.toLocaleString()}
          icon={<Users className="h-8 w-8 text-donation-teal" />}
          loading={loading}
        />
        <StatsCard
          title="إجمالي المبلغ"
          value={`$${stats.totalAmount.toLocaleString()}`}
          icon={<DollarSign className="h-8 w-8 text-donation-gold" />}
          loading={loading}
        />
        <StatsCard
          title="مؤكد"
          value={stats.statusCounts?.confirmed?.toLocaleString() || '0'}
          icon={<TrendingUp className="h-8 w-8 text-donation-green" />}
          loading={loading}
        />
        <StatsCard
          title="في الانتظار"
          value={stats.statusCounts?.pending?.toLocaleString() || '0'}
          icon={<Clock className="h-8 w-8 text-donation-olive" />}
          loading={loading}
        />
      </div>

      {/* Status Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white/90 backdrop-blur-sm border-donation-teal/20 shadow-lg">
          <CardHeader>
            <CardTitle className="text-donation-darkTeal font-somar">توزيع التبرعات حسب الحالة</CardTitle>
            <CardDescription className="text-donation-teal font-somar">
              عرض تفصيلي لحالات التبرعات
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.statusCounts && Object.entries(stats.statusCounts).map(([status, count]) => (
                <div key={status} className="flex items-center justify-between p-3 bg-gradient-to-r from-donation-teal/5 to-donation-gold/5 rounded-lg">
                  <span className="capitalize text-sm font-medium text-donation-darkTeal font-somar">
                    {status === 'pending' ? 'في الانتظار' : status === 'confirmed' ? 'مؤكد' : status === 'rejected' ? 'مرفوض' : status}
                  </span>
                  <span className="text-sm font-bold text-donation-teal font-somar">
                    {count.toLocaleString()}
                  </span>
                </div>
              ))}
              {(!stats.statusCounts || Object.keys(stats.statusCounts).length === 0) && (
                <div className="text-center py-4 text-donation-teal font-somar">
                  لا توجد بيانات متاحة
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/90 backdrop-blur-sm border-donation-teal/20 shadow-lg">
          <CardHeader>
            <CardTitle className="text-donation-darkTeal font-somar">الإجراءات السريعة</CardTitle>
            <CardDescription className="text-donation-teal font-somar">
              المهام الإدارية الشائعة
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Link
                href="/admin/pledges"
                className="block w-full text-right px-4 py-3 text-sm font-medium text-donation-darkTeal hover:bg-gradient-to-r hover:from-donation-teal/10 hover:to-donation-gold/10 rounded-lg transition-all duration-200 font-somar border border-donation-teal/20"
              >
                إدارة التبرعات
              </Link>
              <Link
                href="/admin/users"
                className="block w-full text-right px-4 py-3 text-sm font-medium text-donation-darkTeal hover:bg-gradient-to-r hover:from-donation-teal/10 hover:to-donation-gold/10 rounded-lg transition-all duration-200 font-somar border border-donation-teal/20"
              >
                إدارة المستخدمين
              </Link>
              <Link
                href="/"
                className="block w-full text-right px-4 py-3 text-sm font-medium text-donation-darkTeal hover:bg-gradient-to-r hover:from-donation-teal/10 hover:to-donation-gold/10 rounded-lg transition-all duration-200 font-somar border border-donation-teal/20"
              >
                عرض الموقع العام
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

