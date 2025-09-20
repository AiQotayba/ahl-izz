'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Search } from 'lucide-react';
import PledgeCard from './PledgeCard';

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

interface PledgeListProps {
    pledges: Pledge[];
    filteredPledges: Pledge[];
    totalCount?: number;
    onPledgeSelect: (pledge: Pledge) => void;
    onEditPledge?: (pledge: Pledge) => void;
}

export default function PledgeList({
    pledges,
    filteredPledges,
    totalCount,
    onPledgeSelect,
    onEditPledge
}: any) {
    return (
        <Card className="bg-white/90 backdrop-blur-sm border-donation-teal/20 shadow-lg">
            <CardHeader>
                <CardTitle className="text-donation-darkTeal font-somar">سجل التبرعات</CardTitle>
                <CardDescription className="text-donation-teal font-somar">
                    عرض {filteredPledges.length} تبرع من أصل {totalCount || pledges.length} تبرع إجمالي
                </CardDescription>
            </CardHeader>
            <CardContent className='p-2 md:p-4'>
                <div className="space-y-4">
                    {filteredPledges.map((pledge: Pledge) => (
                        <PledgeCard
                            key={pledge._id}
                            pledge={pledge}
                            onSelect={onPledgeSelect}
                            onEdit={onEditPledge}
                        />
                    ))}

                    {filteredPledges.length === 0 && (
                        <div className="text-center py-8 text-donation-teal font-somar">
                            <div className="mb-4">
                                <Search className="w-12 h-12 text-donation-teal/50 mx-auto" />
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
