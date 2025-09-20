'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, XCircle, Calendar, User } from 'lucide-react';

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

interface PledgeCardProps {
    pledge: Pledge;
    onSelect: (pledge: Pledge) => void;
}

export default function PledgeCard({ pledge, onSelect }: PledgeCardProps) {
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

    return (
        <div
            onClick={() => onSelect(pledge)}
            className="border cursor-pointer border-donation-teal/20 rounded-xl p-4 hover:bg-gradient-to-r hover:from-donation-teal/5 hover:to-donation-gold/5 transition-all duration-200 bg-white/50 backdrop-blur-sm"
        >
            <div className="flex items-center justify-between">
                <div className="flex-1">
                    <div className="flex items-center gap-4 mb-2 justify-between">
                        <h3 className="font-medium text-donation-darkTeal font-somar">
                            {pledge.fullName || 'مجهول'}
                        </h3>
                        <span className="text-lg font-bold text-donation-gold font-somar">
                            ${pledge.amount.toLocaleString()}
                        </span>

                    </div>

                    <div className="flex items-center gap-6 text-sm text-donation-teal font-somar justify-between">
                        <div className="flex items-center gap-1">
                            <User className="w-4 h-4" />
                            {pledge.email}
                        </div>
                    </div>
                    <div className="flex items-center gap-6 text-sm text-donation-teal font-somar justify-between">

                        {getStatusBadge(pledge.pledgeStatus)}
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
            </div>
        </div>
    );
}
