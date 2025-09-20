'use client';

import { cn } from "@/lib/utils";


interface LiveDonation {
    _id: string;
    fullName: string;
    amount: number;
    message: string;
    createdAt: string;
}

interface LiveDonationsProps {
    donations?: LiveDonation[];
    isLoading?: boolean;
}

export function LiveDonations({ donations = [], isLoading }: LiveDonationsProps) {

    // Use provided donations or fallback to mock data 

    if (isLoading) {
        return (
            <div className="w-[400px] h-[620px] bg-white rounded-2xl shadow-lg overflow-hidden p-6">
                {/* Header */}
                <div className="w-full rounded-[11px] p-4 border-[0.4px] border-[#FEFEFE] bg-[#BBAC15] flex items-center justify-center">
                    <h2 className=" font-somar font-bold text-2xl leading-none tracking-tight text-center flex items-center justify-center text-white">
                        التبرعات المباشرة
                    </h2>
                </div>

                {/* Loading Skeleton */}
                <div className="py-4 space-y-3">
                    {[...Array(9)].map((_, i) => (
                        <div key={i} className="flex w-full items-center justify-between gap-4">
                            <div className="bg-gray-200 h-6 w-32 rounded animate-pulse"></div>
                            <div className="w-24 h-8 bg-gray-200 rounded-lg animate-pulse"></div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="w-[400px] h-[640px] bg-white rounded-2xl shadow-lg overflow-hidden p-6">
            {/* Header */}
            <div className="w-full rounded-[11px] p-4 border-[0.4px] border-[#FEFEFE] bg-[#BBAC15] flex items-center justify-center">
                <h2 className=" font-somar font-bold text-2xl leading-none tracking-tight text-center flex items-center justify-center text-white">
                    التبرعات المباشرة
                </h2>
            </div>

            {/* Donations List */}
            <div className="py-4 space-y-4">
                {donations.slice(0, 9).map((donation) => (
                    <div key={donation._id} className="flex w-full items-center justify-between gap-4">

                        {/* Donor Name */}
                        <div className=" text-donation-teal  flex items-start  max-w-[130px] flex-col">
                            <span className="text-lg max-w-[200px]  leading-none line-clamp-1 tracking-tight truncate font-somar font-semibold text-md  text-right">

                                {donation.fullName || 'فاعل خير'}
                            </span>
                            <span className="text-sm max-w-[200px] mt-1 leading-none line-clamp-1 tracking-tight truncate font-somar font-thin text-md  text-right">
                                {donation.message || ''}
                            </span>
                        </div>

                        {/* Amount Button */}
                        <div className={cn(
                            "w-32 text-xl bg-[#0AAE89] font-somar text-white font-bold px-4 py-2 rounded-lg text-center",
                            donation.amount.toLocaleString().length < 6 ? "text-xl" : "text-md"
                        )}>
                            ${donation.amount.toLocaleString()}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
