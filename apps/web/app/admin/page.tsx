'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { StatsCard } from '@/components/StatsCard';
import { Users, DollarSign, TrendingUp, Clock, CheckCircle, XCircle, Gavel } from 'lucide-react';
import { pledgeAPI } from '@/lib/api';
import Link from 'next/link';

interface DashboardStats {
  totalCount: number;
  totalAmount: number;
  pledgeStatusCounts: Record<string, number>;
  paymentMethodCounts: Record<string, number>;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalCount: 0,
    totalAmount: 0,
    pledgeStatusCounts: {},
    paymentMethodCounts: {}
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
            pledgeStatusCounts: response.data.data.pledgeStatusCounts || {},
            paymentMethodCounts: response.data.data.paymentMethodCounts || {}
          });
        }
      } catch (error) {
        console.error('Failed to fetch stats:', error);
        // Keep default values on error
        setStats({
          totalCount: 0,
          totalAmount: 0,
          pledgeStatusCounts: {},
          paymentMethodCounts: {}
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className='h-screen overflow-y-auto p-4'>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-donation-darkTeal font-somar mb-2">لوحة التحكم</h1>
        <p className="text-donation-teal font-somar text-lg">نظرة شاملة على تقدم حملة أهُل العز لايُنسون وإحصائيات التبرعات</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="عدد التبرعات"
          value={stats.totalCount.toLocaleString()}
          icon={<Users className="h-8 w-8 text-donation-teal" />}
          loading={loading}
        />
        <StatsCard
          title="إجمالي المبلغ المتبرع"
          value={`$${stats.totalAmount.toLocaleString()}`}
          icon={<DollarSign className="h-8 w-8 text-donation-gold" />}
          loading={loading}
        />
        <StatsCard
          title="تم التأكيد"
          value={stats.pledgeStatusCounts?.confirmed?.toLocaleString() || '0'}
          icon={<CheckCircle className="h-8 w-8 text-donation-green" />}
          loading={loading}
        />
        <StatsCard
          title="في انتظار المراجعة"
          value={stats.pledgeStatusCounts?.pending?.toLocaleString() || '0'}
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
              إحصائيات مفصلة لحالات التبرعات المختلفة
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.pledgeStatusCounts && Object.entries(stats.pledgeStatusCounts).map(([status, count]) => (
                <div key={status} className="flex items-center justify-between p-3 bg-gradient-to-r from-donation-teal/5 to-donation-gold/5 rounded-lg">
                  <div className="flex items-center gap-2">
                    {status === 'pending' && <Clock className="w-4 h-4 text-donation-olive" />}
                    {status === 'confirmed' && <CheckCircle className="w-4 h-4 text-donation-green" />}
                    {status === 'rejected' && <XCircle className="w-4 h-4 text-red-500" />}
                    {status === 'null' && <TrendingUp className="w-4 h-4 text-donation-teal" />}
                    <span className="text-sm font-medium text-donation-darkTeal font-somar">
                      {status === 'pending' ? 'في انتظار المراجعة' :
                        status === 'confirmed' ? 'تم التأكيد' :
                          status === 'rejected' ? 'تم الرفض' :
                            status === 'null' ? 'غير محدد' : status}
                    </span>
                  </div>
                  <span className="text-sm font-bold text-donation-teal font-somar">
                    {count.toLocaleString()}
                  </span>
                </div>
              ))}
              {(!stats.pledgeStatusCounts || Object.keys(stats.pledgeStatusCounts).length === 0) && (
                <div className="text-center py-4 text-donation-teal font-somar">
                  <div className="mb-2">
                    <TrendingUp className="w-8 h-8 text-donation-teal/50 mx-auto" />
                  </div>
                  <p>لا توجد إحصائيات متاحة حالياً</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/90 backdrop-blur-sm border-donation-teal/20 shadow-lg">
          <CardHeader>
            <CardTitle className="text-donation-darkTeal font-somar">توزيع التبرعات حسب طريقة الدفع</CardTitle>
            <CardDescription className="text-donation-teal font-somar">
              إحصائيات مفصلة لطرق الدفع المختلفة
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.paymentMethodCounts && Object.entries(stats.paymentMethodCounts).map(([method, count]) => (
                <div key={method} className="flex items-center justify-between p-3 bg-gradient-to-r from-donation-teal/5 to-donation-gold/5 rounded-lg">
                  <div className="flex items-center gap-2">
                    {method === 'pledged' && <Gavel className="w-4 h-4 text-blue-500" />}
                    {method === 'received' && <CheckCircle className="w-4 h-4 text-donation-green" />}
                    {method === 'null' && <TrendingUp className="w-4 h-4 text-donation-teal" />}
                    <span className="text-sm font-medium text-donation-darkTeal font-somar">
                      {method === 'pledged' ? 'تعهد' :
                        method === 'received' ? 'تم الاستلام' :
                          method === 'null' ? 'غير محدد' : method}
                    </span>
                  </div>
                  <span className="text-sm font-bold text-donation-teal font-somar">
                    {count.toLocaleString()}
                  </span>
                </div>
              ))}
              {(!stats.paymentMethodCounts || Object.keys(stats.paymentMethodCounts).length === 0) && (
                <div className="text-center py-4 text-donation-teal font-somar">
                  <div className="mb-2">
                    <Gavel className="w-8 h-8 text-donation-teal/50 mx-auto" />
                  </div>
                  <p>لا توجد إحصائيات متاحة حالياً</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="mt-6">
        <Card className="bg-white/90 backdrop-blur-sm border-donation-teal/20 shadow-lg">
          <CardHeader>
            <CardTitle className="text-donation-darkTeal font-somar">الإجراءات السريعة</CardTitle>
            <CardDescription className="text-donation-teal font-somar">
              الوصول السريع للمهام الإدارية الأساسية
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Link
                href="/admin/pledges"
                className="block w-full text-right px-4 py-3 text-sm font-medium text-donation-darkTeal hover:bg-gradient-to-r hover:from-donation-teal/10 hover:to-donation-gold/10 rounded-lg transition-all duration-200 font-somar border border-donation-teal/20"
              >
                مراجعة وإدارة التبرعات
              </Link>
              <Link
                href="/admin/users"
                className="block w-full text-right px-4 py-3 text-sm font-medium text-donation-darkTeal hover:bg-gradient-to-r hover:from-donation-teal/10 hover:to-donation-gold/10 rounded-lg transition-all duration-200 font-somar border border-donation-teal/20"
              >
                إدارة المستخدمين والصلاحيات
              </Link>
              <Link
                href="/"
                className="block w-full text-right px-4 py-3 text-sm font-medium text-donation-darkTeal hover:bg-gradient-to-r hover:from-donation-teal/10 hover:to-donation-gold/10 rounded-lg transition-all duration-200 font-somar border border-donation-teal/20"
              >
                عرض الموقع العام للمتبرعين
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

