'use client';

import { useState } from 'react';
import { DollarSign, Clock, CheckCircle, XCircle, CreditCard, Hand } from 'lucide-react';

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

interface PledgeStatsProps {
    pledges: Pledge[];
    totalCount?: number;
    filteredPledges?: Pledge[];
    onStatusFilter?: (status: string) => void;
    onPaymentMethodFilter?: (method: string) => void;
}

export default function PledgeStats({ pledges, totalCount, onStatusFilter, onPaymentMethodFilter }: PledgeStatsProps) {
    const [activeStatusFilter, setActiveStatusFilter] = useState('all');
    const [activePaymentFilter, setActivePaymentFilter] = useState('');

    const handleStatusFilter = (status: string) => {
        setActiveStatusFilter(status);
        onStatusFilter?.(status);
    };

    const handlePaymentFilter = (method: string) => {
        setActivePaymentFilter(method);
        onPaymentMethodFilter?.(method);
    };

    return (
        <div className="flex flex-row gap-4">
            {/* حالة الطلبات - Tabs */}
            <div className='bg-white/50 backdrop-blur-sm border border-donation-teal/20 rounded-lg p-1 flex flex-row items-center'>
                <h3 className="text-lg font-bold text-donation-teal font-somar mx-3">حالة الطلبات:</h3>
                <div className="flex gap-1">
                    <button
                        onClick={() => handleStatusFilter('all')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-somar transition-all duration-200 ${
                            activeStatusFilter === 'all' 
                                ? 'bg-donation-teal text-white' 
                                : 'text-donation-teal hover:bg-donation-teal/10'
                        }`}
                    >
                        <DollarSign className="w-4 h-4" />
                        الكل ({totalCount || pledges.length})
                    </button>

                    <button
                        onClick={() => handleStatusFilter('confirmed')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-somar transition-all duration-200 ${
                            activeStatusFilter === 'confirmed' 
                                ? 'bg-donation-teal text-white' 
                                : 'text-donation-teal hover:bg-donation-teal/10'
                        }`}
                    >
                        <CheckCircle className="w-4 h-4" />
                        تم التأكيد ({pledges.filter(p => p.pledgeStatus === 'confirmed').length})
                    </button>

                    <button
                        onClick={() => handleStatusFilter('pending')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-somar transition-all duration-200 ${
                            activeStatusFilter === 'pending' 
                                ? 'bg-donation-teal text-white' 
                                : 'text-donation-teal hover:bg-donation-teal/10'
                        }`}
                    >
                        <Clock className="w-4 h-4" />
                        في المراجعة ({pledges.filter(p => p.pledgeStatus === 'pending').length})
                    </button>

                    <button
                        onClick={() => handleStatusFilter('rejected')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-somar transition-all duration-200 ${
                            activeStatusFilter === 'rejected' 
                                ? 'bg-donation-teal text-white' 
                                : 'text-donation-teal hover:bg-donation-teal/10'
                        }`}
                    >
                        <XCircle className="w-4 h-4" />
                        تم الرفض ({pledges.filter(p => p.pledgeStatus === 'rejected').length})
                    </button>
                </div>
            </div>

            {/* حالة الدفع - Tabs */}
            <div className='bg-white/50 backdrop-blur-sm border border-donation-teal/20 rounded-lg p-1 flex flex-row items-center'>
                <h3 className="text-lg font-bold text-donation-teal font-somar mx-3">حالة الدفع:</h3>
                <div className="flex gap-1">
                    <button
                        onClick={() => handlePaymentFilter('received')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-somar transition-all duration-200 ${
                            activePaymentFilter === 'received' 
                                ? 'bg-donation-teal text-white' 
                                : 'text-donation-teal hover:bg-donation-teal/10'
                        }`}
                    >
                        <Hand className="w-4 h-4" />
                        مقبوض ({pledges.filter(p => p.paymentMethod === 'received').length})
                    </button>

                    <button
                        onClick={() => handlePaymentFilter('pledged')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-somar transition-all duration-200 ${
                            activePaymentFilter === 'pledged' 
                                ? 'bg-donation-teal text-white' 
                                : 'text-donation-teal hover:bg-donation-teal/10'
                        }`}
                    >
                        <CreditCard className="w-4 h-4" />
                        غير مقبوض ({pledges.filter(p => p.paymentMethod === 'pledged').length})
                    </button>
                </div>
            </div>
        </div>
    );
}