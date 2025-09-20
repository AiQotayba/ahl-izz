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
import { Heart, ArrowLeft, CheckCircle, ArrowRight, Mail, User, Phone, QrCode, Building2, MessageCircle, CreditCard, Smartphone, ClipboardCopy } from 'lucide-react';
import Link from 'next/link';
import { pledgeAPI } from '@/lib/api';
import { Logo } from '@/components/Logo';
import { cn } from '@/lib/utils';
import Image from 'next/image';

export interface IPledge {
  _id?: string;
  fullName: string;
  phoneNumber: string;
  email?: string;
  amount: number;
  message?: string;
  paymentMethod: 'received' | 'pledged';
  pledgeStatus: 'received' | 'pending' | 'confirmed' | 'rejected';
  createdAt?: Date;
  updatedAt?: Date;
}

const pledgeSchema = z.object({
  fullName: z.string().min(2, 'الاسم يجب أن يكون حرفين على الأقل').max(100, 'الاسم لا يمكن أن يتجاوز 100 حرف').optional().or(z.literal('')),
  phoneNumber: z.string().min(1, 'يرجى إدخال رقم الهاتف').optional().or(z.literal('')),
  email: z.string().email('يرجى إدخال بريد إلكتروني صحيح').optional().or(z.literal('')),
  amount: z.number().min(1, 'المبلغ يجب أن يكون دولار واحد على الأقل'),
  message: z.string().max(500, 'الرسالة لا يمكن أن تتجاوز 500 حرف').optional().or(z.literal('')),
});

type PledgeFormData = z.infer<typeof pledgeSchema>;

export default function PledgeFormPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'now' | 'last'>('now');

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
      fullName: '',
      email: '',
      phoneNumber: '',
      amount: 0,
      message: '',
    },
  });

  const onSubmit = async (data: PledgeFormData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const cleanedData = {
        ...data,
        fullName: data.fullName || undefined,
        phoneNumber: data.phoneNumber || undefined,
        email: data.email || undefined,
        amount: data.amount || undefined,
        message: data.message || undefined,
      };

      const response = await pledgeAPI.submit(cleanedData);

      if (response.data.success) {
        setIsSuccess(true);
        reset();
      } else {
        setError(response.data.error || 'فشل في إرسال التبرع. يرجى المحاولة مرة أخرى.');
      }
    } catch (err: any) {
      console.error('Pledge submission error:', err);

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

  if (isSuccess) {
    return (
      <div
        className="flex flex-col items-center justify-center min-h-screen overflow-hidden p-4 sm:p-6 relative m-auto"
        style={{
          backgroundImage: 'url(/images/bg2.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
        dir="rtl"
      >
        <div className="max-w-2xl mx-auto text-center">
          <div className="flex justify-center mb-8">
            <Logo />
          </div>

          <Card className="w-full max-w-4xl mx-auto bg-white backdrop-blur-sm border-0 shadow-2xl ring-1 ring-black/5">
            <CardHeader className="text-center pb-6">
              <div className="mx-auto mb-6 h-20 w-20 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center shadow-lg">
                <CheckCircle className="h-10 w-10 text-green-600" />
              </div>
              <CardTitle className="text-3xl text-green-600 font-bold mb-3">شكراً لك!</CardTitle>
              <CardDescription className="text-gray-700 text-lg leading-relaxed">
                تم إرسال تبرعك بنجاح. نقدر دعمك لأهل ريف حلب الجنوبي.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
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
      className="flex flex-col gap-4 items-center justify-center min-h-screen overflow-hidden p-4 sm:p-6 relative m-auto"
      style={{
        backgroundImage: 'url(/images/bg2.png)',
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

        {/* Campaign Header */}
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-[#056D5E] rounded-lg flex items-center justify-center">
              <img src="/images/mdi_donation.png" alt="Hand" width={24} height={24} />
            </div>
            <h1 className="font-somar font-bold text-3xl text-[#056D5E]">
              أهل العز لا ينسون
            </h1>
          </div>
          <p className="text-gray-600">
            طرق التبرع للحملة - من داخل وخارج سورية
          </p>
        </div>
      </div>


      {/* Donation Form */}
      <Card className="w-full max-w-4xl mx-auto bg-white shadow-lg rounded-lg">
        <CardHeader className="pb-4 px-6">
          <CardTitle className="text-xl font-bold text-[#1E7B6B] text-center">معلومات التبرع</CardTitle>
        </CardHeader>
        <CardContent className="px-4 sm:px-6 lg:px-8">
          {/* Tabs Navigation */}
          <div className="flex justify-center mb-6">
            <div className="bg-gray-100 p-1 rounded-lg flex">
              <button
                onClick={() => setActiveTab('now')}
                className={cn(
                  "px-6 py-2 rounded-md font-medium transition-all duration-200 flex items-center gap-2",
                  activeTab === 'now'
                    ? "bg-white text-[#1E7B6B] shadow-sm"
                    : "text-gray-600 hover:text-[#1E7B6B]"
                )}
              >
                <CreditCard className="h-4 w-4" />
                تبرع الآن
              </button>
              <button
                onClick={() => setActiveTab('last')}
                className={cn(
                  "px-6 py-2 rounded-md font-medium transition-all duration-200 flex items-center gap-2",
                  activeTab === 'last'
                    ? "bg-white text-[#1E7B6B] shadow-sm"
                    : "text-gray-600 hover:text-[#1E7B6B]"
                )}
              >
                <Smartphone className="h-4 w-4" />
                تعهد بتبرع
              </button>
            </div>
          </div>

          {/* Payment Tab Content */}
          {activeTab === 'now' && (
            <div className="mb-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">

                {/* QR Code */}
                <Card className="bg-green-50 border-green-200">
                  <CardHeader className="text-center pb-3">
                    <div className="flex items-center justify-center gap-2 mb-3">
                      <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                        <Image src="/images/shamcash.jpg" alt="QR Code" width={32} height={32} className="rounded" />
                      </div>
                      <h2 className="text-green-700 text-lg font-bold">شام كاش</h2>
                    </div>
                  </CardHeader>
                  <CardContent className="text-center">
                    <div className="bg-white p-3 rounded-lg border border-green-200">
                      <div className="w-32 h-32 mx-auto mb-3 flex items-center justify-center bg-gray-50 rounded-lg py-2 my-4">
                        <Image src="/images/qr.jpg" alt="QR Code" width={128} height={128} className="rounded py-2" />
                      </div>
                      <Button
                        variant="outline"
                        className="text-xs text-gray-600 font-mono w-full border-green-300 hover:bg-green-50 mt-4"
                        onClick={() => {
                          navigator.clipboard.writeText('862dcf8772d6923f033412b59ab6fac3');
                          alert('تم نسخ الكود بنجاح!');
                        }}
                        title='انسخ الرمز'
                      >
                        <ClipboardCopy className="w-3 h-3 ml-1" />
                        862dcf8772d6923f033412b59ab6fac3
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                {/* OKAN Company Information */}
                <Card className="bg-orange-50 border-orange-200">
                  <CardHeader className="text-center pb-3">
                    <div className="flex items-center justify-center gap-2 mb-3">
                      <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                        <Image src="/images/okan.jpg" alt="OKAN" width={32} height={32} className="rounded" />
                      </div>
                      <h2 className="text-orange-700 text-lg font-bold">شركة أوكان</h2>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-orange-100 p-4 rounded-lg text-center">
                      <div className="mb-3">
                        <h3 className="text-sm font-bold text-orange-800 mb-1">أهل العز لا ينسون</h3>
                        <p className="text-orange-700 text-xs">ريف حلب الجنوبي</p>
                      </div>
                      <div className="bg-white rounded-lg p-3 mb-3">
                        <div className="text-3xl font-bold text-orange-800 mb-1">1100</div>
                        <p className="text-xs text-orange-600">رقم الحساب</p>
                      </div>
                      <p className="text-xs text-orange-600">إعتماد من أي برنامج على أوكان مباشر</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

            </div>
          )}

          {/* Contact Tab Content */}
          {activeTab === 'last' && (

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Name and Amount Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
                <Input
                  id="fullName"
                  label="اسم المتبرع"
                  optional
                  placeholder="أدخل اسمك أو اتركه فارغاً للتبرع المجهول"
                  icon={<User className="h-4 w-4" />}
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
                <h3 className="text-[#1E7B6B] font-semibold text-base">معلومات الاتصال *</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
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
                    icon={<Mail className="h-4 w-4" />}
                    error={errors.email?.message}
                    dir="ltr"
                    {...register('email')}
                  />
                </div>
                {errors.phoneNumber && (
                  <p className="text-sm text-red-600 font-medium bg-red-50 p-2 rounded-md border border-red-200">{errors.phoneNumber.message}</p>
                )}
                <p className="text-xs sm:text-sm">
                  مطلوب طريقة اتصال واحدة على الأقل لأغراض التحقق والتواصل معك حول تبرعك.
                </p>
              </div>

              {/* Message */}
              <div className="space-y-3">
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
                <p className="text-xs sm:text-sm">
                  يمكنك إضافة رسالة دعم أو توجيهات خاصة لأهل ريف حلب الجنوبي (حد أقصى 500 حرف)
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
              <div className="pt-6">
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-[#1E7B6B] to-[#2F4F4F] hover:from-[#2F4F4F] hover:to-[#1E7B6B] text-white font-bold py-3 sm:py-4 text-base sm:text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
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
          )}
        </CardContent>
      </Card>

      {/* WhatsApp Contact */}
      <Card className="bg-blue-50 border-blue-200 w-full max-w-4xl">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3"> 
              <div>
                <h3 className="text-blue-700 font-bold">واتساب</h3>
                <p className="text-blue-600 text-sm font-somar" dir="ltr">+963 950 055 504</p>
              </div>
            </div>
            <Button
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm"
              onClick={() => window.open('https://wa.me/963950055504', '_blank')}
            >
              <svg viewBox="0 0 48 48" version="1.1" xmlns="http://www.w3.org/2000/svg" fill="#fff" className="w-10 h-10 pr-0 p-2">
                <g id="SVGRepo_bgCarrier" strokeWidth="0"> </g>
                <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"> </g>
                <g id="SVGRepo_iconCarrier">
                  <g id="Icons" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                    <g id="Color-" transform="translate(-700.000000, -360.000000)" fill="#fff">
                      <path d="M723.993033,360 C710.762252,360 700,370.765287 700,383.999801 C700,389.248451 701.692661,394.116025 704.570026,398.066947 L701.579605,406.983798 L710.804449,404.035539 C714.598605,406.546975 719.126434,408 724.006967,408 C737.237748,408 748,397.234315 748,384.000199 C748,370.765685 737.237748,360.000398 724.006967,360.000398 L723.993033,360.000398 L723.993033,360 Z M717.29285,372.190836 C716.827488,371.07628 716.474784,371.034071 715.769774,371.005401 C715.529728,370.991464 715.262214,370.977527 714.96564,370.977527 C714.04845,370.977527 713.089462,371.245514 712.511043,371.838033 C711.806033,372.557577 710.056843,374.23638 710.056843,377.679202 C710.056843,381.122023 712.567571,384.451756 712.905944,384.917648 C713.258648,385.382743 717.800808,392.55031 724.853297,395.471492 C730.368379,397.757149 732.00491,397.545307 733.260074,397.27732 C735.093658,396.882308 737.393002,395.527239 737.971421,393.891043 C738.54984,392.25405 738.54984,390.857171 738.380255,390.560912 C738.211068,390.264652 737.745308,390.095816 737.040298,389.742615 C736.335288,389.389811 732.90737,387.696673 732.25849,387.470894 C731.623543,387.231179 731.017259,387.315995 730.537963,387.99333 C729.860819,388.938653 729.198006,389.89831 728.661785,390.476494 C728.238619,390.928051 727.547144,390.984595 726.969123,390.744481 C726.193254,390.420348 724.021298,389.657798 721.340985,387.273388 C719.267356,385.42535 717.856938,383.125756 717.448104,382.434484 C717.038871,381.729275 717.405907,381.319529 717.729948,380.938852 C718.082653,380.501232 718.421026,380.191036 718.77373,379.781688 C719.126434,379.372738 719.323884,379.160897 719.549599,378.681068 C719.789645,378.215575 719.62006,377.735746 719.450874,377.382942 C719.281687,377.030139 717.871269,373.587317 717.29285,372.190836 Z" id="Whatsapp"> </path>
                    </g>
                  </g>
                </g>
              </svg>
              تواصل
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Footer Note */}
      <div className="text-center w-full max-w-4xl">
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600">
            سيتم مراجعة تبرعك وتأكيده قبل عرضه علناً
          </p>
          <p className="text-xs text-gray-500 mt-1">
            جميع المعلومات الشخصية محفوظة بأمان وسرية تامة
          </p>
        </div>
      </div>
    </div >
  );
}