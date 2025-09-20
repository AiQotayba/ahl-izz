'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    CheckCircle,
    Clock,
    XCircle,
    Eye,
    Calendar,
    User,
    DollarSign,
    Phone,
    Mail,
    MessageSquare
} from 'lucide-react';

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

interface PledgeTableProps {
    pledges: Pledge[];
    filteredPledges: Pledge[];
    totalCount?: number;
    onPledgeSelect: (pledge: Pledge) => void;
}

export default function PledgeTable({
    pledges,
    filteredPledges,
    totalCount,
    onPledgeSelect
}: PledgeTableProps) {
    const getStatusBadge = (status: string) => {
        const statusConfig = {
            pending: { color: 'bg-yellow-100 text-yellow-800', icon: Clock, text: 'في الانتظار' },
            confirmed: { color: 'bg-green-100 text-green-800', icon: CheckCircle, text: 'مؤكد' },
            rejected: { color: 'bg-red-100 text-red-800', icon: XCircle, text: 'مرفوض' },
        };

        const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
        const Icon = config.icon;

        return (
            <Badge className={`${config.color} flex items-center gap-1 w-fit`}>
                <Icon className="w-3 h-3" />
                {config.text}
            </Badge>
        );
    };

    const getPaymentMethodBadge = (paymentMethod?: string) => {
        const methodConfig = {
            pledged: { color: 'bg-blue-100 text-blue-800', text: 'تعهد' },
            received: { color: 'bg-green-100 text-green-800', text: 'تم الاستلام' },
        };

        const config = methodConfig[paymentMethod as keyof typeof methodConfig] || { color: 'bg-gray-100 text-gray-800', text: 'غير محدد' };

        return (
            <Badge className={`${config.color} w-fit`}>
                {config.text}
            </Badge>
        );
    };

    return (
        <Card className="bg-white/90 backdrop-blur-sm border-donation-teal/20 shadow-lg">
            <CardHeader>
                <CardTitle className="text-donation-darkTeal font-somar">جدول التبرعات</CardTitle>
                <CardDescription className="text-donation-teal font-somar">
                    عرض {filteredPledges.length} تبرع من أصل {totalCount || pledges.length} تبرع إجمالي
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-donation-teal/20">
                                <th className="text-right py-3 px-4 text-sm font-medium text-donation-darkTeal font-somar">المتبرع</th>
                                <th className="text-right py-3 px-4 text-sm font-medium text-donation-darkTeal font-somar">المبلغ</th>
                                <th className="text-right py-3 px-4 text-sm font-medium text-donation-darkTeal font-somar">الحالة</th>
                                <th className="text-right py-3 px-4 text-sm font-medium text-donation-darkTeal font-somar">طريقة الدفع</th>
                                <th className="text-right py-3 px-4 text-sm font-medium text-donation-darkTeal font-somar">التاريخ</th>
                                <th className="text-right py-3 px-4 text-sm font-medium text-donation-darkTeal font-somar">الإجراءات</th>
                            </tr>
                        </thead>
                        <tbody className='min-h-[500px]'>
                            {filteredPledges.map((pledge) => (
                                <tr
                                    key={pledge._id}
                                    className="border-b border-donation-teal/10 hover:bg-gradient-to-r hover:from-donation-teal/5 hover:to-donation-gold/5 transition-all duration-200"
                                >
                                    {/* المتبرع */}
                                    <td className="py-4 px-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-gradient-to-r from-donation-teal to-donation-gold rounded-full flex items-center justify-center text-white font-bold font-somar">
                                                {pledge.fullName?.charAt(0)?.toUpperCase() || 'م'}
                                            </div>
                                            <div>
                                                <div className="font-medium text-donation-darkTeal font-somar">
                                                    {pledge.fullName || 'مجهول'}
                                                </div>
                                                <div className="flex items-center gap-2 text-sm text-donation-teal">
                                                    <Mail className="w-3 h-3" />
                                                    {pledge.email}
                                                </div>
                                                <div className="flex items-center gap-2 text-sm text-donation-teal">
                                                    <Phone className="w-3 h-3" />
                                                    {pledge.phoneNumber}
                                                </div>
                                            </div>
                                        </div>
                                    </td>

                                    {/* المبلغ */}
                                    <td className="py-4 px-4">
                                        <div className="flex items-center gap-2">
                                            <DollarSign className="w-4 h-4 text-donation-gold" />
                                            <span className="font-bold text-donation-gold font-somar text-lg">
                                                {pledge.amount.toLocaleString()}
                                            </span>
                                        </div>
                                    </td>

                                    {/* الحالة */}
                                    <td className="py-4 px-4">
                                        {getStatusBadge(pledge.pledgeStatus)}
                                    </td>

                                    {/* طريقة الدفع */}
                                    <td className="py-4 px-4">
                                        {getPaymentMethodBadge(pledge.paymentMethod)}
                                    </td>

                                    {/* التاريخ */}
                                    <td className="py-4 px-4">
                                        <div className="flex items-center gap-2 text-sm text-donation-teal">
                                            <Calendar className="w-4 h-4" />
                                            <span className="font-somar">
                                                {new Date(pledge.createdAt).toLocaleDateString('ar-SA')}
                                            </span>
                                        </div>
                                    </td>

                                    {/* الإجراءات */}
                                    <td className="py-4 px-4">
                                        <div className="flex items-center gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => onPledgeSelect(pledge)}
                                                className="border-donation-teal/30 text-donation-teal hover:bg-donation-teal/10 font-somar"
                                            >
                                                <Eye className="w-4 h-4 ml-1" />
                                                عرض
                                            </Button> 
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {filteredPledges.length === 0 && (
                        <div className="text-center py-12 text-donation-teal font-somar">
                            <div className="mb-4">
                                <User className="w-12 h-12 text-donation-teal/50 mx-auto" />
                            </div>
                            <h3 className="text-lg font-medium text-donation-darkTeal mb-2">لم يتم العثور على تبرعات</h3>
                            <p className="text-donation-teal">جرب تغيير معايير البحث أو الفلترة للعثور على التبرعات المطلوبة</p>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
