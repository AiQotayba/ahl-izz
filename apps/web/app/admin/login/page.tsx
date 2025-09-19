'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { AlertCircle, Eye, EyeOff, Lock, Mail } from 'lucide-react';
import Link from 'next/link';

export default function AdminLogin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const { login } = useAuth();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await login(email, password);
            router.push('/admin');
        } catch (err: any) {
            setError(err.message || 'فشل في تسجيل الدخول');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="min-h-screen islamic-pattern flex items-center justify-center p-4"
            style={{
                backgroundImage: 'url(/images/bg2.png)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
            }}
            dir="rtl"
        >
            <Card className="w-full max-w-md bg-white/95 backdrop-blur-sm border-donation-teal/20 shadow-2xl">
                <CardHeader className="text-center">
                    <div className="mx-auto w-16 h-16 bg-gradient-to-br from-donation-teal to-donation-darkTeal rounded-full flex items-center justify-center mb-4 shadow-lg">
                        <Lock className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-3xl font-bold text-donation-darkTeal font-somar">
                        تسجيل دخول الإدارة
                    </CardTitle>
                    <CardDescription className="text-donation-teal font-somar text-lg">
                        أدخل بياناتك للوصول إلى مركز التحكم الإداري
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm font-somar">
                                <div className="flex items-center gap-2">
                                    <AlertCircle className="w-4 h-4" />
                                    {error}
                                </div>
                            </div>
                        )}

                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-sm font-medium text-donation-teal font-somar">
                                البريد الإلكتروني
                            </Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-donation-teal/60 w-4 h-4" />
                                <Input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="pl-10 border-donation-teal/30 focus:border-donation-teal focus:ring-donation-teal/20 font-somar"
                                    placeholder="ahmad@mail.com"
                                    required
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-sm font-medium text-donation-teal font-somar">
                                كلمة المرور
                            </Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-donation-teal/60 w-4 h-4" />
                                <Input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="pl-10 pr-10 border-donation-teal/30 focus:border-donation-teal focus:ring-donation-teal/20 font-somar"
                                    placeholder="أدخل كلمة المرور"
                                    required
                                    disabled={loading}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-donation-teal/60 hover:text-donation-teal"
                                    disabled={loading}
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            className="w-full bg-gradient-to-r from-donation-teal to-donation-darkTeal hover:from-donation-teal/90 hover:to-donation-darkTeal/90 text-white font-somar py-3"
                            disabled={loading}
                        >
                            {loading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
                        </Button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-donation-teal font-somar">
                            للعودة إلى الموقع الرئيسي،{' '}
                            <Link href="/" className="text-donation-darkTeal hover:text-donation-teal font-medium underline">
                                اضغط هنا
                            </Link>
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
