'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Heart, ArrowLeft, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { pledgeAPI } from '@/lib/api';

const pledgeSchema = z.object({
  donorName: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name cannot exceed 100 characters').optional().or(z.literal('')),
  contact: z.object({
    email: z.string().email('Please enter a valid email address').optional().or(z.literal('')),
    phone: z.string().regex(/^[\+]?[1-9][\d]{0,15}$/, 'Please enter a valid phone number').optional().or(z.literal('')),
  }).refine(data => data.email || data.phone, {
    message: 'At least one contact method (email or phone) is required',
    path: ['contact']
  }),
  amount: z.number().min(1, 'Amount must be at least $1').max(1000000, 'Amount cannot exceed $1,000,000'),
  message: z.string().max(500, 'Message cannot exceed 500 characters').optional().or(z.literal('')),
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 h-16 w-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl text-green-600">Thank You!</CardTitle>
            <CardDescription>
              Your pledge has been submitted successfully. We appreciate your support for the Aleppo relief campaign.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Link href="/" className="block">
              <Button className="w-full">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Button>
            </Link>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => setIsSuccess(false)}
            >
              Make Another Pledge
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Heart className="h-8 w-8 text-red-500" />
            <h1 className="text-3xl font-bold text-gray-900">Make a Pledge</h1>
          </div>
          <p className="text-lg text-gray-600">
            Support the Aleppo relief campaign with your donation
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Pledge Information</CardTitle>
            <CardDescription>
              Fill out the form below to make your pledge. All information is secure and will be used only for campaign purposes.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Donor Name */}
              <div className="space-y-2">
                <Label htmlFor="donorName">Donor Name (Optional)</Label>
                <Input
                  id="donorName"
                  placeholder="Enter your name or leave blank for anonymous"
                  {...register('donorName')}
                />
                {errors.donorName && (
                  <p className="text-sm text-red-600">{errors.donorName.message}</p>
                )}
              </div>

              {/* Contact Information */}
              <div className="space-y-4">
                <Label>Contact Information *</Label>
                <div className="space-y-2">
                  <Input
                    type="email"
                    placeholder="Email address"
                    {...register('contact.email')}
                  />
                  {errors.contact?.email && (
                    <p className="text-sm text-red-600">{errors.contact.email.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Input
                    type="tel"
                    placeholder="Phone number"
                    {...register('contact.phone')}
                  />
                  {errors.contact?.phone && (
                    <p className="text-sm text-red-600">{errors.contact.phone.message}</p>
                  )}
                </div>
                {errors.contact && (
                  <p className="text-sm text-red-600">{errors.contact.message}</p>
                )}
                <p className="text-sm text-gray-500">
                  At least one contact method is required for verification purposes.
                </p>
              </div>

              {/* Amount */}
              <div className="space-y-2">
                <Label htmlFor="amount">Pledge Amount *</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                  <Input
                    id="amount"
                    type="number"
                    min="1"
                    max="1000000"
                    step="0.01"
                    placeholder="0.00"
                    className="pl-8"
                    {...register('amount', { valueAsNumber: true })}
                  />
                </div>
                {errors.amount && (
                  <p className="text-sm text-red-600">{errors.amount.message}</p>
                )}
              </div>

              {/* Message */}
              <div className="space-y-2">
                <Label htmlFor="message">Message (Optional)</Label>
                <Textarea
                  id="message"
                  placeholder="Add a message of support (optional)"
                  rows={4}
                  {...register('message')}
                />
                {errors.message && (
                  <p className="text-sm text-red-600">{errors.message.message}</p>
                )}
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Heart className="mr-2 h-4 w-4" />
                    Submit Pledge
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Footer Note */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Your pledge will be reviewed and confirmed before being displayed publicly.
            All personal information is kept secure and confidential.
          </p>
        </div>
      </div>
    </div>
  );
}

