'use client';

import { useState, useEffect } from 'react';

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

interface PledgeCounterProps {
    pledges: Pledge[];
    filteredPledges?: Pledge[];
}

export default function PledgeCounter({ pledges, filteredPledges }: PledgeCounterProps) {
    // State للعداد المتحرك
    const [animatedVisibleCount, setAnimatedVisibleCount] = useState(0);
    const [animatedPaidCount, setAnimatedPaidCount] = useState(0);
    const [animatedUnpaidCount, setAnimatedUnpaidCount] = useState(0);
    const [animatedTotalAmount, setAnimatedTotalAmount] = useState(0);

    // حساب الإحصائيات للعناصر الظاهرة
    const visiblePledges = filteredPledges || pledges;
    const visibleCount = visiblePledges.length;
    const paidCount = visiblePledges.filter(p => p.paymentMethod === 'received').length;
    const unpaidCount = visiblePledges.filter(p => p.paymentMethod === 'pledged').length;
    const totalAmount = visiblePledges.reduce((sum, p) => sum + p.amount, 0);

    // انيميشن العداد
    useEffect(() => {
        const duration = 1000; // مدة الانيميشن بالمللي ثانية
        const steps = 60; // عدد الخطوات
        const stepDuration = duration / steps;

        // انيميشن العدد الظاهر
        const animateVisibleCount = () => {
            let currentStep = 0;
            const increment = visibleCount / steps;
            const timer = setInterval(() => {
                currentStep++;
                setAnimatedVisibleCount(Math.min(Math.floor(increment * currentStep), visibleCount));
                if (currentStep >= steps) {
                    clearInterval(timer);
                    setAnimatedVisibleCount(visibleCount);
                }
            }, stepDuration);
        };

        // انيميشن المدفوع
        const animatePaidCount = () => {
            let currentStep = 0;
            const increment = paidCount / steps;
            const timer = setInterval(() => {
                currentStep++;
                setAnimatedPaidCount(Math.min(Math.floor(increment * currentStep), paidCount));
                if (currentStep >= steps) {
                    clearInterval(timer);
                    setAnimatedPaidCount(paidCount);
                }
            }, stepDuration);
        };

        // انيميشن غير المدفوع
        const animateUnpaidCount = () => {
            let currentStep = 0;
            const increment = unpaidCount / steps;
            const timer = setInterval(() => {
                currentStep++;
                setAnimatedUnpaidCount(Math.min(Math.floor(increment * currentStep), unpaidCount));
                if (currentStep >= steps) {
                    clearInterval(timer);
                    setAnimatedUnpaidCount(unpaidCount);
                }
            }, stepDuration);
        };

        // انيميشن المبلغ
        const animateTotalAmount = () => {
            let currentStep = 0;
            const increment = totalAmount / steps;
            const timer = setInterval(() => {
                currentStep++;
                setAnimatedTotalAmount(Math.min(Math.floor(increment * currentStep), totalAmount));
                if (currentStep >= steps) {
                    clearInterval(timer);
                    setAnimatedTotalAmount(totalAmount);
                }
            }, stepDuration);
        };

        // تشغيل جميع الانيميشن
        animateVisibleCount();
        animatePaidCount();
        animateUnpaidCount();
        animateTotalAmount();
    }, [visibleCount, paidCount, unpaidCount, totalAmount]);

    return (
        <div className="flex justify-end">
            <div className="bg-white/80 backdrop-blur-sm border border-donation-teal/20 rounded-lg p-3 flex items-center gap-6">
                <div className="text-center">
                    <div className="text-lg font-bold text-donation-teal font-somar">
                        {animatedVisibleCount}
                    </div>
                    <div className="text-xs text-donation-teal font-somar">ظاهر</div>
                </div>
                <div className="text-center">
                    <div className="text-lg font-bold text-green-600 font-somar">
                        {animatedPaidCount}
                    </div>
                    <div className="text-xs text-green-600 font-somar">مدفوع</div>
                </div>
                <div className="text-center">
                    <div className="text-lg font-bold text-blue-600 font-somar">
                        {animatedUnpaidCount}
                    </div>
                    <div className="text-xs text-blue-600 font-somar">غير مدفوع</div>
                </div>
                <div className="text-center">
                    <div className="text-lg font-bold text-donation-gold font-somar">
                        ${animatedTotalAmount.toLocaleString()}
                    </div>
                    <div className="text-xs text-donation-gold font-somar">المبلغ</div>
                </div>
            </div>
        </div>
    );
}
