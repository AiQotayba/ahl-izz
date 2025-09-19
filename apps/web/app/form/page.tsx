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
import { Heart, ArrowLeft, CheckCircle, ArrowRight, Mail, User } from 'lucide-react';
import Link from 'next/link';
import { pledgeAPI } from '@/lib/api';
import { Logo } from '@/components/Logo';
import { cn } from '@/lib/utils';
import Image from 'next/image';

const pledgeSchema = z.object({
  donorName: z.string().min(2, 'الاسم يجب أن يكون حرفين على الأقل').max(100, 'الاسم لا يمكن أن يتجاوز 100 حرف').optional().or(z.literal('')),
  contact: z.object({
    email: z.string().email('يرجى إدخال بريد إلكتروني صحيح').optional().or(z.literal('')),
    phone: z.string().optional().or(z.literal('')),
  }).refine(data => data.email || data.phone, {
    message: 'مطلوب طريقة اتصال واحدة على الأقل (البريد الإلكتروني أو الهاتف)',
    path: ['contact']
  }),
  amount: z.number().min(1, 'المبلغ يجب أن يكون دولار واحد على الأقل'),
  message: z.string().max(500, 'الرسالة لا يمكن أن تتجاوز 500 حرف').optional().or(z.literal('')),
});

type PledgeFormData = z.infer<typeof pledgeSchema>;

export default function PledgeFormPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<PledgeFormData>({
    resolver: zodResolver(pledgeSchema),
    defaultValues: {
      donorName: '',
      contact: {
        email: '',
        phone: '',
      },
      amount: 0,
      message: '',
    },
  });

  const onSubmit = async (data: PledgeFormData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      // Clean up empty strings
      const cleanedData = {
        ...data,
        donorName: data.donorName || undefined,
        contact: {
          email: data.contact.email || undefined,
          phone: data.contact.phone || undefined,
        },
        message: data.message || undefined,
      };

      const response = await pledgeAPI.submit(cleanedData);

      if (response.data.success) {
        setIsSuccess(true);
        reset();
      } else {
        setError(response.data.error || 'Failed to submit pledge');
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to submit pledge. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div
        className="flex flex-col items-center justify-center min-h-screen overflow-hidden p-6 relative m-auto"
        style={{
          backgroundImage: 'url(/bg2.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
        dir="rtl"
      >
        <div className="max-w-2xl mx-auto text-center">
          {/* Logo Section */}
          <div className="flex justify-center mb-8">
            <Logo />
          </div>

          <Card className="w-full max-w-md mx-auto bg-white/98 backdrop-blur-sm border-0 shadow-2xl ring-1 ring-black/5">
            <CardHeader className="text-center pb-6">
              <div className="mx-auto mb-6 h-20 w-20 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center shadow-lg">
                <CheckCircle className="h-10 w-10 text-green-600" />
              </div>
              <CardTitle className="text-3xl text-green-600 font-bold mb-3">شكراً لك!</CardTitle>
              <CardDescription className="text-gray-700 text-lg leading-relaxed">
                تم إرسال تبرعك بنجاح. نقدر دعمك لأهل ريف حلب الجنوبي.
                <br />
                <strong>أهل العز لا ينسون واجبهم تجاه مجتمعهم</strong>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Link href="/" className="block">
                <Button className="w-full bg-gradient-to-r from-[#1E7B6B] to-[#2F4F4F] hover:from-[#2F4F4F] hover:to-[#1E7B6B] text-white font-bold py-3 text-lg shadow-lg hover:shadow-xl transition-all duration-300">
                  <ArrowRight className="ml-2 h-5 w-5" />
                  العودة للصفحة الرئيسية
                </Button>
              </Link>
              <Button
                variant="outline"
                className="w-full border-2 border-[#1E7B6B] text-[#1E7B6B] hover:bg-[#1E7B6B] hover:text-white font-semibold py-3 text-lg transition-all duration-300"
                onClick={() => setIsSuccess(false)}
              >
                تقديم تبرع آخر
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen overflow-hidden p-6 relative m-auto"
      style={{
        backgroundImage: 'url(/bg2.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
      dir="rtl"
    >
      <div className="max-w-4xl mx-auto w-full">
        {/* Logo Section */}
        <div className="flex justify-center mb-8">
          <Logo />
        </div>
        <div className="  bg-white rounded-[17px] shadow-lg overflow-hidden p-5 justify-center items-center">
          {/* Header Section */}
          <div className=" px-6 py-4">
            <div className="flex items-center justify-center gap-3">
              {/* Icon */}
              <div className="w-[54px] h-[53px] rounded-[10px] border-[1px] p-1 bg-[#056D5E] flex items-center justify-center">
                <Image src="/mdi_donation.png" alt="Hand" width={30} height={30} />
              </div>

              {/* Title */}
              <h2 className={cn("h-[55px] font-somar font-bold text-4xl leading-none tracking-tight text-right",
                " flex items-center text-[#056D5E]")}>
                أهل العز لايُنسون
              </h2>
            </div>
            <p className="text-xl text-gray-700 font-medium leading-relaxed w-full text-center pt-4">
              ساهم في دعم التعليم والصحة ومياه الشرب في ريف حلب الجنوبي
            </p>
          </div>

        </div>
        {/* Header */}
        <div className="text-center mb-8 *:font-somar">
        </div>

        <Card className="bg-white backdrop-blur-sm border-0 shadow-2xl ring-1 ring-black/5">
          <CardHeader className="pb-6">
            <CardTitle className="text-3xl font-bold text-[#1E7B6B] text-center mb-2">معلومات التبرع</CardTitle>
            <CardDescription className="text-center text-gray-700 text-lg leading-relaxed">
              املأ النموذج أدناه لتقديم تبرعك لدعم ريف حلب الجنوبي. جميع المعلومات آمنة وستستخدم فقط لأغراض الحملة.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Donor Name */}
              <Input
                id="donorName"
                label="اسم المتبرع"
                optional
                placeholder="أدخل اسمك أو اتركه فارغاً للتبرع المجهول"
                icon={<User className="h-4 w-4" />}
                error={errors.donorName?.message}
                dir="rtl"
                {...register('donorName')}
              />

              {/* Contact Information */}
              <div className="space-y-4">
                <h3 className="text-[#1E7B6B] font-semibold text-base">معلومات الاتصال *</h3>
                <div className="space-y-4">
                  <Input
                    type="email"
                    label="البريد الإلكتروني"
                    placeholder="البريد الإلكتروني"
                    icon={<Mail className="h-4 w-4" />}
                    error={errors.contact?.email?.message}
                    dir="ltr"
                    {...register('contact.email')}
                  />

                  <PhoneInputField
                    label="رقم الهاتف"
                    placeholder="رقم الهاتف"
                    value={watch('contact.phone')}
                    onChange={(value) => setValue('contact.phone', value || '')}
                    error={errors.contact?.phone?.message}
                    dir="ltr"
                  />
                </div>
                {errors.contact && (
                  <p className="text-sm text-red-600 font-medium bg-red-50 p-2 rounded-md border border-red-200">{errors.contact.message}</p>
                )}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-sm text-blue-800 font-medium">
                    💡 مطلوب طريقة اتصال واحدة على الأقل لأغراض التحقق والتواصل معك حول تبرعك.
                  </p>
                </div>
              </div>

              {/* Amount */}
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
                dir="ltr"
                {...register('amount', { valueAsNumber: true })}
              />
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <p className="text-sm text-green-800 font-medium">
                  💰 الحد الأدنى: $1 - كل دولار يساهم في إعادة بناء المستقبل
                </p>
              </div>

              {/* Message */}
              <Textarea
                id="message"
                label="رسالة"
                optional
                placeholder="أضف رسالة دعم (اختياري)"
                rows={4}
                error={errors.message?.message}
                dir="rtl"
                {...register('message')}
              />
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                <p className="text-sm text-gray-700 font-medium">
                  📝 يمكنك إضافة رسالة دعم أو توجيهات خاصة لأهل ريف حلب الجنوبي (حد أقصى 500 حرف)
                </p>
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-4 bg-red-50 border-2 border-red-200 rounded-lg shadow-sm">
                  <p className="text-sm text-red-700 font-semibold flex items-center">
                    <span className="ml-2">⚠️</span>
                    {error}
                  </p>
                </div>
              )}

              {/* Submit Button */}
              <div className="pt-4">
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-[#1E7B6B] to-[#2F4F4F] hover:from-[#2F4F4F] hover:to-[#1E7B6B] text-white font-bold py-4 text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <div className="ml-2 h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      جاري الإرسال...
                    </>
                  ) : (
                    <>
                      <Heart className="ml-2 h-5 w-5" />
                      ساهم في إعادة البناء
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Footer Note */}
        <div className="mt-8 text-center">
          <div className="bg-white/90 backdrop-blur-sm p-6 rounded-xl border border-gray-200 shadow-lg">
            <div className="flex items-center justify-center mb-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center ml-2">
                <span className="text-green-600 text-lg">🔒</span>
              </div>
              <h3 className="text-lg font-bold text-[#1E7B6B]">معلومات الأمان</h3>
            </div>
            <p className="text-base text-gray-700 leading-relaxed">
              سيتم مراجعة تبرعك وتأكيده قبل عرضه علناً.
              <br />
              جميع المعلومات الشخصية محفوظة بأمان وسرية تامة.
              <br />
              <strong>أهل العز لا ينسون واجبهم تجاه مجتمعهم</strong>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

