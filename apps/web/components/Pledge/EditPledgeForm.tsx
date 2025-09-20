'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { PhoneInputField } from '@/components/ui/phone-input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X, Save, AlertCircle } from 'lucide-react';
import { pledgeAPI } from '@/lib/api';
import { cn } from '@/lib/utils';

interface Pledge {
    _id: string;
    fullName?: string;
    phoneNumber: string;
    email?: string;
    amount: number;
    message?: string;
    pledgeStatus: 'pending' | 'confirmed' | 'rejected';
    paymentMethod?: 'pledged' | 'received';
    createdAt: string;
}

const editPledgeSchema = z.object({
    fullName: z.string().min(2, 'الاسم يجب أن يكون حرفين على الأقل').max(100, 'الاسم لا يمكن أن يتجاوز 100 حرف').optional().or(z.literal('')),
    phoneNumber: z.string().min(1, 'يرجى إدخال رقم الهاتف'),
    email: z.string().email('يرجى إدخال بريد إلكتروني صحيح').optional().or(z.literal('')),
    amount: z.number().min(1, 'المبلغ يجب أن يكون دولار واحد على الأقل'),
    message: z.string().max(500, 'الرسالة لا يمكن أن تتجاوز 500 حرف').optional().or(z.literal('')),
    pledgeStatus: z.enum(['pending', 'confirmed', 'rejected']),
    paymentMethod: z.enum(['pledged', 'received']).optional(),
});

type EditPledgeFormData = z.infer<typeof editPledgeSchema>;

interface EditPledgeFormProps {
    isOpen: boolean;
    onClose: () => void;
    pledge: Pledge | null;
    onSuccess: () => void;
}

export default function EditPledgeForm({ isOpen, onClose, pledge, onSuccess }: EditPledgeFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        setValue,
        watch,
    } = useForm<EditPledgeFormData>({
        resolver: zodResolver(editPledgeSchema),
        defaultValues: {
            fullName: '',
            phoneNumber: '',
            email: '',
            amount: 0,
            message: '',
            pledgeStatus: 'pending',
            paymentMethod: 'pledged',
        },
    });

    // Reset form when pledge changes
    useEffect(() => {
        if (pledge) {
            reset({
                fullName: pledge.fullName || '',
                phoneNumber: pledge.phoneNumber || '',
                email: pledge.email || '',
                amount: pledge.amount || 0,
                message: pledge.message || '',
                pledgeStatus: pledge.pledgeStatus || 'pending',
                paymentMethod: pledge.paymentMethod || 'pledged',
            });
        }
    }, [pledge, reset]);

    const onSubmit = async (data: EditPledgeFormData) => {
        if (!pledge?._id) return;

        setIsSubmitting(true);
        setError(null);

        try {
            // Clean up empty strings
            const cleanedData = {
                ...data,
                fullName: data.fullName || undefined,
                email: data.email || undefined,
                message: data.message || undefined,
            };

            const response = await pledgeAPI.update(pledge._id, cleanedData);

            if (response.data.success) {
                onSuccess();
            } else {
                setError(response.data.error || 'فشل في تحديث التبرع. يرجى المحاولة مرة أخرى.');
            }
        } catch (err: any) {
            console.error('Pledge update error:', err);

            if (err.message) {
                setError(err.message);
            } else if (err.response?.data?.error) {
                setError(err.response.data.error);
            } else if (err.code === 'ERR_NETWORK') {
                setError('لا يمكن الاتصال بالخادم. يرجى التحقق من اتصال الإنترنت والمحاولة مرة أخرى.');
            } else {
                setError('حدث خطأ غير متوقع. يرجى المحاولة لاحقاً أو التواصل معنا عبر وسائل أخرى.');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!pledge) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-[#1E7B6B] text-center">
                        تعديل التبرع
                    </DialogTitle>
                    <DialogDescription className="text-center text-gray-600">
                        تعديل معلومات التبرع رقم: {pledge._id.slice(-8)}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-6">
                    {/* Name and Amount Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                            id="fullName"
                            label="اسم المتبرع"
                            placeholder="أدخل اسم المتبرع"
                            error={errors.fullName?.message}
                            dir="rtl"
                            {...register('fullName')}
                        />

                        <Input
                            id="amount"
                            type="number"
                            label="مبلغ التبرع"
                            required
                            min="1"
                            step="0.01"
                            placeholder="0.00"
                            icon={<span className="text-gray-600 font-semibold text-lg">$</span>}
                            error={errors.amount?.message}
                            dir="rtl"
                            {...register('amount', { valueAsNumber: true })}
                        />
                    </div>

                    {/* Contact Information */}
                    <div className="space-y-4">
                        <h3 className="text-[#1E7B6B] font-semibold text-base">معلومات الاتصال</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <PhoneInputField
                                label="رقم الهاتف*"
                                placeholder="رقم الهاتف"
                                value={watch('phoneNumber')}
                                onChange={(value) => setValue('phoneNumber', value || '')}
                                error={errors.phoneNumber?.message}
                                dir="ltr"
                            />
                            <Input
                                type="email"
                                label="البريد الإلكتروني"
                                placeholder="البريد الإلكتروني"
                                error={errors.email?.message}
                                dir="ltr"
                                {...register('email')}
                            />
                        </div>
                    </div>

                    {/* Status and Payment Method */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">حالة التبرع</label>
                            <Select
                                value={watch('pledgeStatus')}
                                onValueChange={(value) => setValue('pledgeStatus', value as 'pending' | 'confirmed' | 'rejected')}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="اختر الحالة" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="pending">معلق</SelectItem>
                                    <SelectItem value="confirmed">مؤكد</SelectItem>
                                    <SelectItem value="rejected">مرفوض</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">طريقة الدفع</label>
                            <Select
                                value={watch('paymentMethod')}
                                onValueChange={(value) => setValue('paymentMethod', value as 'pledged' | 'received')}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="اختر الطريقة" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="pledged">تعهد</SelectItem>
                                    <SelectItem value="received">مستلم</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Message */}
                    <div className="space-y-3">
                        <Textarea
                            id="message"
                            label="رسالة"
                            placeholder="أضف رسالة دعم (اختياري)"
                            rows={4}
                            error={errors.message?.message}
                            dir="rtl"
                            {...register('message')}
                        />
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="p-4 bg-red-50 border-2 border-red-200 rounded-lg shadow-sm">
                            <p className="text-sm text-red-700 font-semibold flex items-center">
                                <AlertCircle className="w-4 h-4 ml-2" />
                                {error}
                            </p>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-4 pt-6">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            className="flex-1"
                            disabled={isSubmitting}
                        >
                            <X className="w-4 h-4 ml-2" />
                            إلغاء
                        </Button>
                        <Button
                            type="submit"
                            className="flex-1 bg-gradient-to-r from-[#1E7B6B] to-[#2F4F4F] hover:from-[#2F4F4F] hover:to-[#1E7B6B] text-white font-bold"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="ml-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                    جاري الحفظ...
                                </>
                            ) : (
                                <>
                                    <Save className="ml-2 h-4 w-4" />
                                    حفظ التغييرات
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
