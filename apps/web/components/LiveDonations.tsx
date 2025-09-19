'use client';

import { useState, useEffect } from 'react';

interface LiveDonationsProps {
    donations?: any[];
}

export function LiveDonations({ donations = [] }: LiveDonationsProps) {
    const [displayDonations, setDisplayDonations] = useState<any[]>([]);

    useEffect(() => {
        // Mock data for demonstration
        const mockDonations: any[] = [
            { _id: '1', donorName: 'محمد من ريف حلب', amount: 5000, createdAt: new Date() },
            { _id: '2', donorName: 'أحمد من خان طومان', amount: 2500, createdAt: new Date() },
            { _id: '3', donorName: 'فاطمة من جبل الحص', amount: 10000, createdAt: new Date() },
            { _id: '4', donorName: 'عبدالله من خناصر', amount: 7500, createdAt: new Date() },
            { _id: '5', donorName: 'نور من تل العيس', amount: 3000, createdAt: new Date() },
            { _id: '6', donorName: 'سارة من زيتان', amount: 15000, createdAt: new Date() },
            { _id: '7', donorName: 'خالد من الزربة', amount: 8000, createdAt: new Date() },
            { _id: '8', donorName: 'مريم من البرقوم', amount: 12000, createdAt: new Date() },
            { _id: '9', donorName: 'يوسف من الهضبة', amount: 6000, createdAt: new Date() },
        ];

        setDisplayDonations(donations.length > 0 ? donations : mockDonations);
    }, [donations]);

    return (
        <div className="w-[322px] h-[592px] bg-white rounded-2xl shadow-lg overflow-hidden p-6">
            {/* Header */}
            <div className="w-full rounded-[11px] p-4 border-[0.4px] border-[#FEFEFE] bg-[#BBAC15] flex items-center justify-center">
                <h2 className=" font-somar font-bold text-2xl leading-none tracking-tight text-center flex items-center justify-center text-white">
                    التبرعات المباشرة
                </h2>
            </div>

            {/* Donations List */}
            <div className="py-4 space-y-3">
                {displayDonations.map((donation) => (
                    <div key={donation._id} className="flex w-full items-center justify-between gap-4"> 

                        {/* Donor Name */}
                        <div className=" text-donation-teal font-somar font-bold text-lg leading-none tracking-tight text-right flex items-center truncate"> 
                            {donation.donorName || 'مجهول'}
                        </div>

                        {/* Amount Button */}
                        <div className="w-24  bg-[#0AAE89] font-somar text-white font-bold px-4 py-2 rounded-lg text-center">
                            ${donation.amount.toLocaleString()}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
