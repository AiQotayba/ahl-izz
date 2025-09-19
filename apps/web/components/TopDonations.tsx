'use client';

import { Star } from 'lucide-react';

interface TopDonation {
  _id: string;
  amount: number;
  fullName: string;
}

interface TopDonationsProps {
  donations?: TopDonation[];
  isLoading?: boolean;
}

export function TopDonations({ donations, isLoading }: TopDonationsProps) {

  if (isLoading) {
    return (
      <div className="w-full overflow-hidden max-w-[797px]">
        <div className="bg-donation-teal max-w-[250px] pb-8 -mb-4 rounded-t-lg px-6 py-4">
          <div className="flex items-center gap-3">
            <Star className="w-6 h-6 text-donation-yellow fill-current" />
            <h2 className="text-white h-[38px] font-somar font-bold text-2xl leading-none tracking-tight flex items-center">
              أعلى التبرعات
            </h2>
          </div>
        </div>
        <div className="p-6 bg-white rounded-2xl">
          <div className="gap-4 overflow-x-auto grid lg:grid-cols-5">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex-shrink-0">
                <div className="rounded-lg overflow-hidden gap-2">
                  <div className="bg-gray-200 w-[137px] h-[42px] rounded-t-md animate-pulse"></div>
                  <div className="bg-gray-200 p-4 py-3 h-[60px] animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full shadow-lg overflow-hidden max-w-[900px]">
      {/* Header */}
      <div className="bg-donation-teal max-w-[250px] pb-8 -mb-4 rounded-t-lg px-6 py-4">
        <div className="flex items-center gap-3">
          <Star className="w-6 h-6 text-donation-yellow fill-current" />
          <h2 className="text-white h-[38px] font-somar font-bold text-2xl leading-none tracking-tight flex items-center">
            أعلى التبرعات
          </h2>
        </div>
      </div>

      {/* Cards Container */}
      <div className="p-6 bg-white rounded-2xl ">
        <div className=" gap-4 overflow-x-auto grid lg:grid-cols-5">
          {donations?.map((donation) => (
            <div key={donation._id} className="flex-shrink-0 ">
              <div className="rounded-lg overflow-hidden gap-2">
                {/* Amount Section */}
                <div className="bg-donation-gold h-[42px] justify-center items-center flex rounded-t-md text-center" title={donation.amount.toLocaleString()}>
                  <div className="text-white font-somar font-bold text-sm w-full h-full leading-none tracking-tight text-center flex items-center justify-center">
                    ${donation.amount.toLocaleString()}
                  </div>
                </div>

                {/* Company Section */}
                <div className="bg-donation-teal p-4 py-3 flex items-center justify-center">
                  <div className="text-white font-somar font-bold text-sm leading-none tracking-tight text-center line-clamp-1" title={donation.fullName || 'فاعل خير'}>
                    {donation.fullName || 'فاعل خير'}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
