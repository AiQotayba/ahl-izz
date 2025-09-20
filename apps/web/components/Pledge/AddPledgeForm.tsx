'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { PhoneInputField } from '@/components/ui/phone-input';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    User,
    Mail,
    Heart,
    CheckCircle,
    Clock,
    XCircle,
    Gavel,
} from 'lucide-react';
import { pledgeAPI } from '@/lib/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

// Schema for adding new pledge
const addPledgeSchema = z.object({
    fullName: z.string().min(2, 'الاسم يجب أن يكون حرفين على الأقل').max(100, 'الاسم لا يمكن أن يتجاوز 100 حرف').optional().or(z.literal('')),
    phoneNumber: z.string().min(1, 'يرجى إدخال رقم الهاتف').optional().or(z.literal('')),
    email: z.string().email('يرجى إدخال بريد إلكتروني صحيح').optional().or(z.literal('')),
    amount: z.number().min(1, 'المبلغ يجب أن يكون دولار واحد على الأقل'),
    message: z.string().max(500, 'الرسالة لا يمكن أن تتجاوز 500 حرف').optional().or(z.literal('')),
    pledgeStatus: z.enum(['pending', 'confirmed', 'rejected']).default('confirmed'),
    paymentMethod: z.enum(['pledged', 'received']).default('received'),
});

type AddPledgeFormData = z.infer<typeof addPledgeSchema>;

interface AddPledgeFormProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function AddPledgeForm({ isOpen, onClose }: AddPledgeFormProps) {
    const queryClient = useQueryClient();

    // Form for adding new pledge
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        watch,
        setValue,
    } = useForm<AddPledgeFormData>({
        resolver: zodResolver(addPledgeSchema),
        defaultValues: {
            fullName: '',
            email: '',
            phoneNumber: '',
            amount: 0,
            message: '',
            pledgeStatus: 'confirmed',
            paymentMethod: 'received',
        },
    });

    // Add new pledge mutation
    const addPledgeMutation = useMutation({
        mutationFn: (data: AddPledgeFormData) => {
            const cleanedData = {
                ...data,
                fullName: data.fullName || undefined,
                phoneNumber: data.phoneNumber || undefined,
                email: data.email || undefined,
                message: data.message || undefined,
            };
            return pledgeAPI.submit(cleanedData);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['pledges'] });
            toast.success('تم إضافة التبرع بنجاح');
            reset();
            onClose();
        },
        onError: (error: any) => {
            console.error('Failed to add pledge:', error);
            toast.error('فشل في إضافة التبرع');
        },
    });

    const onSubmitAddPledge = (data: AddPledgeFormData) => {
        addPledgeMutation.mutate(data);
    };

    const handleClose = () => {
        reset();
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="max-w-4xl bg-white/95 backdrop-blur-sm border-donation-teal/20 max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-donation-darkTeal font-somar text-right text-2xl">
                        إضافة تبرع جديد
                    </DialogTitle>
                    <DialogDescription className="text-donation-teal font-somar text-right">
                        أضف تبرع جديد لحملة حلب الإغاثية
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmitAddPledge)} className="space-y-6">
                    {/* Name and Amount Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
                        {/* Donor Name */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-donation-teal font-somar">اسم المتبرع</label>
                            <Input
                                placeholder="أدخل اسم المتبرع"
                                icon={<User className="h-4 w-4" />}
                                error={errors.fullName?.message}
                                dir="rtl"
                                {...register('fullName')}
                            />
                        </div>

                        {/* Amount */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-donation-teal font-somar">مبلغ التبرع *</label>
                            <Input
                                type="number"
                                min="1"
                                step="0.01"
                                placeholder="0.00"
                                icon={<span className="text-gray-600 font-semibold text-lg">$</span>}
                                error={errors.amount?.message}
                                dir="rtl"
                                {...register('amount', { valueAsNumber: true })}
                            />
                        </div>
                    </div>

                    {/* Contact Information Row */}
                    <div className="space-y-4">
                        <h3 className="text-donation-teal font-semibold text-base">معلومات الاتصال</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
                            {/* Phone */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-donation-teal font-somar">رقم الهاتف</label>
                                <PhoneInputField
                                    placeholder="رقم الهاتف"
                                    value={watch('phoneNumber')}
                                    onChange={(value) => setValue('phoneNumber', value || '')}
                                    error={errors.phoneNumber?.message}
                                    dir="ltr"
                                />
                            </div>
                            {/* Email */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-donation-teal font-somar">البريد الإلكتروني</label>
                                <Input
                                    type="email"
                                    placeholder="البريد الإلكتروني"
                                    icon={<Mail className="h-4 w-4" />}
                                    error={errors.email?.message}
                                    dir="ltr"
                                    {...register('email')}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-row gap-4">

                        {/* Status Selection */}
                        <div className="space-y-3">
                            <label className="text-sm font-medium text-donation-teal font-somar">حالة التبرع</label>
                            <div className="flex flex-wrap gap-2">
                                <Button
                                    type="button"
                                    variant={watch('pledgeStatus') === 'confirmed' ? 'default' : 'outline'}
                                    onClick={() => setValue('pledgeStatus', 'confirmed')}
                                    className={`flex items-center gap-2 font-somar ${watch('pledgeStatus') === 'confirmed'
                                        ? 'bg-green-500 hover:bg-green-600 text-white'
                                        : 'border-green-500 text-green-600 hover:bg-green-50'
                                        }`}
                                >
                                    <CheckCircle className="w-4 h-4" />
                                    تم التأكيد
                                </Button>
                                <Button
                                    type="button"
                                    variant={watch('pledgeStatus') === 'pending' ? 'default' : 'outline'}
                                    onClick={() => setValue('pledgeStatus', 'pending')}
                                    className={`flex items-center gap-2 font-somar ${watch('pledgeStatus') === 'pending'
                                        ? 'bg-yellow-500 hover:bg-yellow-600 text-white'
                                        : 'border-yellow-500 text-yellow-600 hover:bg-yellow-50'
                                        }`}
                                >
                                    <Clock className="w-4 h-4" />
                                    تحت المراجعة
                                </Button>
                                <Button
                                    type="button"
                                    variant={watch('pledgeStatus') === 'rejected' ? 'default' : 'outline'}
                                    onClick={() => setValue('pledgeStatus', 'rejected')}
                                    className={`flex items-center gap-2 font-somar ${watch('pledgeStatus') === 'rejected'
                                        ? 'bg-red-500 hover:bg-red-600 text-white'
                                        : 'border-red-500 text-red-600 hover:bg-red-50'
                                        }`}
                                >
                                    <XCircle className="w-4 h-4" />
                                    تم الرفض
                                </Button>
                            </div>
                        </div>

                        {/* Payment Method Selection */}
                        <div className="space-y-3">
                            <label className="text-sm font-medium text-donation-teal font-somar">طريقة الدفع</label>
                            <div className="flex flex-wrap gap-2">
                                <Button
                                    type="button"
                                    variant={watch('paymentMethod') === 'received' ? 'default' : 'outline'}
                                    onClick={() => setValue('paymentMethod', 'received')}
                                    className={`flex items-center gap-2 font-somar ${watch('paymentMethod') === 'received'
                                        ? 'bg-green-500 hover:bg-green-600 text-white'
                                        : 'border-green-500 text-green-600 hover:bg-green-50'
                                        }`}
                                >
                                    <CheckCircle className="w-4 h-4" />
                                    تم الاستلام
                                </Button>
                                <Button
                                    type="button"
                                    variant={watch('paymentMethod') === 'pledged' ? 'default' : 'outline'}
                                    onClick={() => setValue('paymentMethod', 'pledged')}
                                    className={`flex items-center gap-2 font-somar ${watch('paymentMethod') === 'pledged'
                                        ? 'bg-blue-500 hover:bg-blue-600 text-white'
                                        : 'border-blue-500 text-blue-600 hover:bg-blue-50'
                                        }`}
                                >
                                    <Gavel className="w-4 h-4" />
                                    تعهد
                                </Button>
                            </div>
                        </div>

                    </div>
                    {/* Message */}
                    <div className="space-y-3">
                        <label className="text-sm font-medium text-donation-teal font-somar">رسالة المتبرع</label>
                        <Textarea
                            placeholder="أضف رسالة من المتبرع (اختياري)"
                            rows={4}
                            error={errors.message?.message}
                            dir="rtl"
                            {...register('message')}
                        />
                    </div>

                    {/* Submit Buttons */}
                    <div className="flex gap-3 pt-4">
                        <Button
                            type="submit"
                            disabled={addPledgeMutation.isPending}
                            className="flex-1 bg-gradient-to-r from-donation-teal to-donation-green hover:from-donation-teal/90 hover:to-donation-green/90 text-white font-somar"
                        >
                            {addPledgeMutation.isPending ? (
                                <>
                                    <div className="ml-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                    جاري الإضافة...
                                </>
                            ) : (
                                <>
                                    <Heart className="w-4 h-4 ml-2" />
                                    إضافة التبرع
                                </>
                            )}
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleClose}
                            className="border-donation-teal/30 text-donation-teal hover:bg-donation-teal/10 font-somar"
                        >
                            إلغاء
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
