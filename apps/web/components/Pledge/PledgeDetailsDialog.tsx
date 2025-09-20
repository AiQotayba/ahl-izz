'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  CheckCircle,
  XCircle,
  Clock,
  PhoneCallIcon,
  Gavel,
  User,
  Mail,
  DollarSign,
  Calendar,
  MessageSquare,
  Phone,
} from 'lucide-react';
import { pledgeAPI } from '@/lib/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
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

interface PledgeDetailsDialogProps {
  pledge: Pledge | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function PledgeDetailsDialog({ pledge, isOpen, onClose }: PledgeDetailsDialogProps) {
  const queryClient = useQueryClient();

  // Update pledge status mutation
  const updateStatusMutation = useMutation({
    mutationFn: ({ pledgeId, status }: { pledgeId: string; status: string }) => {
      return pledgeAPI.update(pledgeId, { pledgeStatus: status });
    },
    onSuccess: (_, { status }) => {
      queryClient.invalidateQueries({ queryKey: ['pledges'] });
      const statusText = status === 'confirmed' ? 'مؤكد' : status === 'rejected' ? 'مرفوض' : status;
      toast.success(`تم تحديث حالة التبرع إلى: ${statusText}`);
      onClose();
    },
    onError: (error: any) => {
      console.error('Failed to update pledge:', error);
      toast.error('فشل في تحديث حالة التبرع');
    },
  });

  // Update payment method mutation
  const updatePaymentMethodMutation = useMutation({
    mutationFn: ({ pledgeId, paymentMethod }: { pledgeId: string; paymentMethod: 'pledged' | 'received' }) => {
      return pledgeAPI.update(pledgeId, { paymentMethod });
    },
    onSuccess: (_, { paymentMethod }) => {
      queryClient.invalidateQueries({ queryKey: ['pledges'] });
      const methodText = paymentMethod === 'received' ? 'تم الاستلام' : 'تم التعهد';
      toast.success(`تم تحديث طريقة الدفع إلى: ${methodText}`);
      onClose();
    },
    onError: (error: any) => {
      console.error('Failed to update payment method:', error);
      toast.error('فشل في تحديث طريقة الدفع');
    },
  });

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-100 text-yellow-800', icon: Clock, text: 'في الانتظار' },
      confirmed: { color: 'bg-green-100 text-green-800', icon: CheckCircle, text: 'مؤكد' },
      rejected: { color: 'bg-red-100 text-red-800', icon: XCircle, text: 'مرفوض' },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <Badge className={`${config.color} flex items-center gap-1 p-2 w-fit px-4`}>
        <Icon className="w-3 h-3" />
        {config.text}
      </Badge>
    );
  };

  const getPaymentMethodBadge = (paymentMethod?: string) => {
    const methodConfig = {
      pledged: { color: 'bg-blue-100 text-blue-800', icon: Gavel, text: 'تعهد' },
      received: { color: 'bg-green-100 text-green-800', icon: CheckCircle, text: 'تم الاستلام' },
    };

    const config = methodConfig[paymentMethod as keyof typeof methodConfig] || methodConfig.pledged;
    const Icon = config.icon;

    return (
      <Badge className={`${config.color} flex items-center gap-1 p-2 w-fit px-4`}>
        <Icon className="w-3 h-3" />
        {config.text}
      </Badge>
    );
  };

  const updatePledgeStatus = (pledgeId: string, status: string) => {
    updateStatusMutation.mutate({ pledgeId, status });
  };

  const updatePaymentMethod = (pledgeId: string, paymentMethod: 'pledged' | 'received') => {
    updatePaymentMethodMutation.mutate({ pledgeId, paymentMethod });
  };

  if (!pledge) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-white border-donation-teal/20" dir="rtl">
        <DialogHeader className="flex flex-row justify-between items-center gap-2">
          <DialogTitle className="text-xl font-bold text-donation-darkTeal font-somar text-right">
            تفاصيل التبرع
          </DialogTitle>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-donation-teal" />
            <p className="font-somar text-donation-darkTeal">{new Date(pledge.createdAt).toLocaleDateString('ar-SA')}</p>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          {/* المعلومات الأساسية */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <User className="w-5 h-5 text-donation-teal" />
              <div>
                <p className="text-sm text-gray-600 font-somar">الاسم</p>
                <p className="font-semibold text-donation-darkTeal font-somar">{pledge.fullName || 'غير محدد'}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <DollarSign className="w-5 h-5 text-donation-gold" />
              <div>
                <p className="text-sm text-gray-600 font-somar">المبلغ</p>
                <p className="font-bold text-donation-gold font-somar text-lg">${pledge.amount.toLocaleString()}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Mail className="w-5 h-5 text-donation-teal" />
              <div>
                <p className="text-sm text-gray-600 font-somar">البريد الإلكتروني</p>
                <p className="font-somar text-donation-darkTeal break-all">{pledge.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <PhoneCallIcon className="w-5 h-5 text-donation-teal" />
              <div className="flex-1">
                <p className="text-sm text-gray-600 font-somar">رقم الهاتف</p>
                <div className="flex items-center gap-2">
                  <p className="font-somar text-donation-darkTeal">{pledge.phoneNumber}</p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(`https://wa.me/${pledge.phoneNumber.replace('+', '')}`, '_blank')}
                    className="text-xs"
                  >
                    <Phone className="w-4 h-4" />
                    واتساب
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* الحالة وطريقة الدفع */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 font-somar mb-2">حالة التبرع</p>
              {getStatusBadge(pledge.pledgeStatus)}
            </div>

            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 font-somar mb-2">طريقة الدفع</p>
              {getPaymentMethodBadge(pledge.paymentMethod)}
            </div>
          </div>
 
          {/* الرسالة */}
          {pledge.message && (
            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <MessageSquare className="w-5 h-5 text-donation-teal mt-1" />
              <div>
                <p className="text-sm text-gray-600 font-somar mb-2">رسالة المتبرع</p>
                <p className="font-somar text-donation-darkTeal leading-relaxed">
                  \"{pledge.message}\"
                </p>
              </div>
            </div>
          )}

          {/* أزرار الإجراءات */}
          <div className="pt-4 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row gap-3">
              {pledge.pledgeStatus === 'pending' && (
                <>
                  <Button
                    onClick={() => updatePledgeStatus(pledge._id, 'confirmed')}
                    disabled={updateStatusMutation.isPending}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white font-somar"
                  >
                    <CheckCircle className="w-4 h-4 ml-2" />
                    {updateStatusMutation.isPending ? 'جاري التأكيد...' : 'تأكيد التبرع'}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => updatePledgeStatus(pledge._id, 'rejected')}
                    disabled={updateStatusMutation.isPending}
                    className="flex-1 border-red-500 text-red-500 hover:bg-red-50 font-somar"
                  >
                    <XCircle className="w-4 h-4 ml-2" />
                    {updateStatusMutation.isPending ? 'جاري الرفض...' : 'رفض التبرع'}
                  </Button>
                </>
              )}

              {pledge.paymentMethod === "pledged" && (
                <Button
                  variant="outline"
                  onClick={() => updatePaymentMethod(pledge._id, 'received')}
                  disabled={updatePaymentMethodMutation.isPending}
                  className="flex-1 border-donation-gold text-donation-gold hover:bg-donation-gold/10 font-somar w-full"
                >
                  <Gavel className="w-4 h-4 ml-2" />
                  {updatePaymentMethodMutation.isPending ? 'جاري التحديث...' : 'تم الاستلام'}
                </Button>
              )}

              {pledge.pledgeStatus === 'confirmed' && (
                <div className=" rounded-lg p-2 text-center flex flex-row w-full max-w-[50%] justify-center items-center gap-2 mx-auto">
                  <CheckCircle className="w-6 h-6 text-green-600 " />
                  <p className="text-green-800 font-somar font-semibold">تم تأكيد التبرع</p>
                </div>
              )}

              {pledge.pledgeStatus === 'rejected' && (
                <div className="flex-1 bg-red-50 border border-red-200 rounded-lg p-3 text-center">
                  <XCircle className="w-6 h-6 text-red-600 mx-auto mb-1" />
                  <p className="text-red-800 font-somar font-semibold">تم رفض التبرع</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}