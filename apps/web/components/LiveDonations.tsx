'use client';


interface LiveDonation {
    _id: string;
    fullName: string;
    amount: number;
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
            <div className="w-[322px] h-[592px] bg-white rounded-2xl shadow-lg overflow-hidden p-6">
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
        <div className="w-[322px] h-[620px] bg-white rounded-2xl shadow-lg overflow-hidden p-6">
            {/* Header */}
            <div className="w-full rounded-[11px] p-4 border-[0.4px] border-[#FEFEFE] bg-[#BBAC15] flex items-center justify-center">
                <h2 className=" font-somar font-bold text-2xl leading-none tracking-tight text-center flex items-center justify-center text-white">
                    التبرعات المباشرة
                </h2>
            </div>

            {/* Donations List */}
            <div className="py-4 space-y-3">
                {donations.map((donation) => (
                    <div key={donation._id} className="flex w-full items-center justify-between gap-4">

                        {/* Donor Name */}
                        <div className=" text-donation-teal font-somar font-bold text-lg tracking-tight text-right flex items-center truncate">
                            {donation.fullName || 'فاعل خير'}
                        </div>

                        {/* Amount Button */}
                        <div className="min-w-24  bg-[#0AAE89] font-somar text-white font-bold px-4 py-2 rounded-lg text-center">
                            ${donation.amount.toLocaleString()}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
