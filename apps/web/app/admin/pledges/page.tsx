'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Search,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  Trash2,
  DollarSign,
  Calendar,
  User,
  AlertCircle,
  PhoneCallIcon,

} from 'lucide-react';
import { pledgeAPI } from '@/lib/api';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

interface Pledge {
  _id: string;
  fullName?: string;
  phoneNumber: string;
  email: string;
  amount: number;
  message?: string;
  pledgeStatus: 'pending' | 'confirmed' | 'rejected';
  paymentMethod?: 'pledged' | 'received';
  createdAt: string;
}

// Simple Badge component
const Badge = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors ${className}`}>
    {children}
  </span>
);

export default function PledgesManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedPledge, setSelectedPledge] = useState<Pledge | null>(null);
  const queryClient = useQueryClient();

  // Fetch pledges data
  const { data: pledgesResponse, isLoading, error } = useQuery({
    queryKey: ['pledges'],
    queryFn: () => pledgeAPI.getAll({ limit: 100 }),
    retry: 2,
    staleTime: 30000, // 30 seconds
  });

  // Extract pledges array from response
  const pledges: Pledge[] = pledgesResponse?.data?.data || [];

  // Update pledge status mutation
  const updateStatusMutation = useMutation({
    mutationFn: ({ pledgeId, status }: { pledgeId: string; status: string }) =>
      pledgeAPI.update(pledgeId, { pledgeStatus: status }),
    onSuccess: (_, { status }) => {
      queryClient.invalidateQueries({ queryKey: ['pledges'] });
      const statusText = status === 'confirmed' ? 'مؤكد' : status === 'rejected' ? 'مرفوض' : status;
      toast.success(`تم تحديث حالة التبرع إلى: ${statusText}`);
    },
    onError: (error: any) => {
      console.error('Failed to update pledge:', error);
      toast.error('فشل في تحديث حالة التبرع');
    },
  });

  // Erase PII mutation
  const erasePIIMutation = useMutation({
    mutationFn: (pledgeId: string) => pledgeAPI.erasePII(pledgeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pledges'] });
      toast.success('تم حذف البيانات الشخصية بنجاح');
    },
    onError: (error: any) => {
      console.error('Failed to erase PII:', error);
      toast.error('فشل في حذف البيانات الشخصية');
    },
  });

  const updatePledgeStatus = (pledgeId: string, status: string) => {
    updateStatusMutation.mutate({ pledgeId, status });
  };

  const erasePII = (pledgeId: string) => {
    erasePIIMutation.mutate(pledgeId);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-100 text-yellow-800', icon: Clock, text: 'في الانتظار' },
      confirmed: { color: 'bg-green-100 text-green-800', icon: CheckCircle, text: 'مؤكد' },
      rejected: { color: 'bg-red-100 text-red-800', icon: XCircle, text: 'مرفوض' },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <Badge className={`${config.color} flex items-center gap-1`}>
        <Icon className="w-3 h-3" />
        {config.text}
      </Badge>
    );
  };

  const filteredPledges = pledges.filter(pledge => {
    const matchesSearch =
      pledge.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pledge.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pledge.phoneNumber?.includes(searchTerm);

    const matchesStatus = statusFilter === 'all' || pledge.pledgeStatus === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Loading state
  if (isLoading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="grid grid-cols-1 gap-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="p-8">
        <div className="text-center py-12">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">خطأ في تحميل البيانات</h3>
          <p className="text-gray-600 mb-4">
            حدث خطأ أثناء تحميل التبرعات. يرجى المحاولة مرة أخرى.
          </p>
          <Button onClick={() => window.location.reload()}>
            إعادة المحاولة
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-donation-darkTeal font-somar mb-2">مركز إدارة التبرعات</h1>
        <p className="text-donation-teal font-somar text-lg">تتبع ومراجعة جميع التبرعات المقدمة لحملة حلب الإغاثية</p>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="ابحث بالاسم، البريد الإلكتروني، أو رقم الهاتف..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select value={statusFilter} onValueChange={setStatusFilter} dir="rtl">
          <SelectTrigger className="w-[180px] border-donation-teal/30 text-donation-darkTeal font-somar">
            <SelectValue placeholder="فلترة حسب الحالة" />
          </SelectTrigger>
          <SelectContent className="bg-white/95 backdrop-blur-sm border-donation-teal/20">
            <SelectItem value="all" className="text-donation-darkTeal font-somar">جميع التبرعات</SelectItem>
            <SelectItem value="pending" className="text-donation-darkTeal font-somar">في انتظار المراجعة</SelectItem>
            <SelectItem value="confirmed" className="text-donation-darkTeal font-somar">تم التأكيد</SelectItem>
            <SelectItem value="rejected" className="text-donation-darkTeal font-somar">تم الرفض</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card className="bg-white/90 backdrop-blur-sm border-donation-teal/20 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-donation-teal font-somar">عدد التبرعات</p>
                <p className="text-2xl font-bold text-donation-darkTeal font-somar">
                  {pledgesResponse?.data?.pagination?.total || pledges.length}
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-donation-teal" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/90 backdrop-blur-sm border-donation-teal/20 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-donation-teal font-somar">في انتظار المراجعة</p>
                <p className="text-2xl font-bold text-donation-olive font-somar">
                  {pledges.filter(p => p.pledgeStatus === 'pending').length}
                </p>
              </div>
              <Clock className="w-8 h-8 text-donation-olive" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/90 backdrop-blur-sm border-donation-teal/20 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-donation-teal font-somar">تم التأكيد</p>
                <p className="text-2xl font-bold text-donation-green font-somar">
                  {pledges.filter(p => p.pledgeStatus === 'confirmed').length}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-donation-green" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/90 backdrop-blur-sm border-donation-teal/20 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-donation-teal font-somar">إجمالي المبلغ المتبرع</p>
                <p className="text-2xl font-bold text-donation-gold font-somar">
                  ${pledges.reduce((sum, p) => sum + p.amount, 0).toLocaleString()}
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-donation-gold" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pledges List */}
      <Card className="bg-white/90 backdrop-blur-sm border-donation-teal/20 shadow-lg">
        <CardHeader>
          <CardTitle className="text-donation-darkTeal font-somar">سجل التبرعات</CardTitle>
          <CardDescription className="text-donation-teal font-somar">
            عرض {filteredPledges.length} تبرع من أصل {pledgesResponse?.data?.pagination?.total || pledges.length} تبرع إجمالي
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredPledges.map((pledge) => (
              <div
                onClick={() => setSelectedPledge(pledge)}
                key={pledge._id}
                className="border cursor-pointer border-donation-teal/20 rounded-xl p-4 hover:bg-gradient-to-r hover:from-donation-teal/5 hover:to-donation-gold/5 transition-all duration-200 bg-white/50 backdrop-blur-sm"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-2">
                      <h3 className="font-medium text-donation-darkTeal font-somar">
                        {pledge.fullName || 'مجهول'}
                      </h3>
                      {getStatusBadge(pledge.pledgeStatus)}
                      <span className="text-lg font-bold text-donation-gold font-somar">
                        ${pledge.amount.toLocaleString()}
                      </span>
                    </div>

                    <div className="flex items-center gap-6 text-sm text-donation-teal font-somar">
                      <div className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        {pledge.email}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(pledge.createdAt).toLocaleDateString('ar-SA')}
                      </div>
                    </div>

                    {pledge.message && (
                      <p className="text-sm text-donation-darkTeal mt-2 line-clamp-2 font-somar">
                        {pledge.message}
                      </p>
                    )}
                  </div>

                  {/* <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedPledge(pledge)}
                      className="border-donation-teal/30 text-donation-teal hover:bg-donation-teal/10 font-somar"
                    >
                      <Eye className="w-4 h-4 ml-1" />
                      عرض
                    </Button>
                  </div> */}
                </div>
              </div>
            ))}

            {filteredPledges.length === 0 && (
              <div className="text-center py-8 text-donation-teal font-somar">
                <div className="mb-4">
                  <Search className="w-12 h-12 text-donation-teal/50 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-donation-darkTeal mb-2">لم يتم العثور على تبرعات</h3>
                <p className="text-donation-teal">جرب تغيير معايير البحث أو الفلترة للعثور على التبرعات المطلوبة</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Pledge Detail Dialog */}
      <Dialog open={!!selectedPledge} onOpenChange={() => setSelectedPledge(null)}>
        <DialogContent className="max-w-2xl bg-white/95 backdrop-blur-sm border-donation-teal/20">
          <DialogHeader>
            <DialogTitle className="text-donation-darkTeal font-somar text-right">
              تفاصيل التبرع - {selectedPledge?.fullName || 'مجهول'}
            </DialogTitle>
          </DialogHeader>

          {selectedPledge && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-donation-teal font-somar">اسم المتبرع</label>
                  <p className="text-donation-darkTeal font-somar">{selectedPledge.fullName || 'غير محدد'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-donation-teal font-somar">مبلغ التبرع</label>
                  <p className="text-donation-gold font-bold font-somar">${selectedPledge.amount.toLocaleString()}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-donation-teal font-somar">البريد الإلكتروني</label>
                  <p className="text-donation-darkTeal font-somar">{selectedPledge.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-donation-teal font-somar">رقم الهاتف</label>
                  <p className="text-donation-darkTeal font-somar">{selectedPledge.phoneNumber}</p>
                  <Button variant="outline" className="w-full mt-2" onClick={() => window.open(`https://wa.me/${selectedPledge.phoneNumber.replace('+', '')}`, '_blank')}>
                    <PhoneCallIcon className="w-4 h-4 ml-1" />
                    التواصل عبر واتساب
                  </Button>
                </div>
                <div>
                  <label className="text-sm font-medium text-donation-teal font-somar">حالة التبرع</label>
                  <div className="mt-1">{getStatusBadge(selectedPledge.pledgeStatus)}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-donation-teal font-somar">تاريخ تقديم التبرع</label>
                  <p className="text-donation-darkTeal font-somar">
                    {new Date(selectedPledge.createdAt).toLocaleString('ar-SA')}
                  </p>
                </div>
              </div>

              {selectedPledge.message && (
                <div>
                  <label className="text-sm font-medium text-donation-teal font-somar">رسالة المتبرع</label>
                  <p className="text-donation-darkTeal mt-1 p-3 bg-gradient-to-r from-donation-teal/5 to-donation-gold/5 rounded-lg font-somar">
                    {selectedPledge.message}
                  </p>
                </div>
              )}

              <div className="flex gap-2 pt-4">
                {selectedPledge.pledgeStatus === 'pending' && (
                  <>
                    <Button
                      onClick={() => {
                        updatePledgeStatus(selectedPledge._id, 'confirmed');
                      }}
                      disabled={updateStatusMutation.isPending}
                      className="flex-1 bg-gradient-to-r from-donation-green to-donation-teal hover:from-donation-green/90 hover:to-donation-teal/90 text-white font-somar"
                    >
                      <CheckCircle className="w-4 h-4 ml-1" />
                      {updateStatusMutation.isPending ? 'جاري التأكيد...' : 'تأكيد التبرع'}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        updatePledgeStatus(selectedPledge._id, 'rejected');
                      }}
                      disabled={updateStatusMutation.isPending}
                      className="flex-1 border-donation-olive text-donation-olive hover:bg-donation-olive/10 font-somar"
                    >
                      <XCircle className="w-4 h-4 ml-1" />
                      {updateStatusMutation.isPending ? 'جاري الرفض...' : 'رفض التبرع'}
                    </Button>
                  </>
                )}
                {/* <Button
                  variant="outline"
                  onClick={() => {
                    if (confirm('هل أنت متأكد من حذف البيانات الشخصية؟ هذا الإجراء لا يمكن التراجع عنه.')) {
                      erasePII(selectedPledge._id);
                    }
                  }}
                  disabled={erasePIIMutation.isPending}
                  className="flex-1 border-red-500 text-red-500 hover:bg-red-50 font-somar"
                >
                  <Trash2 className="w-4 h-4 ml-1" />
                  {erasePIIMutation.isPending ? 'جاري الحذف...' : 'حذف البيانات'}
                </Button> */}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

    </div>
  );
}
