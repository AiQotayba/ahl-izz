'use client';

import { useState, useEffect } from 'react';
import { Star } from 'lucide-react';

interface TopDonation {
  id: string;
  amount: number;
  companyName: string;
}

interface TopDonationsProps {
  donations?: TopDonation[];
}

export function TopDonations({ donations }: TopDonationsProps) {
  const [displayDonations, setDisplayDonations] = useState<TopDonation[]>([]);

  useEffect(() => {
    // Mock data for demonstration
    const mockDonations: TopDonation[] = [
      { id: '1', amount: 5000000, companyName: 'شركة الجبل للاستثمار' },
      { id: '2', amount: 3500000, companyName: 'مجموعة الخليج التجارية' },
      { id: '3', amount: 2800000, companyName: 'مؤسسة النور الخيرية' },
      { id: '4', amount: 2200000, companyName: 'شركة الأمل للتنمية' },
      { id: '5', amount: 1800000, companyName: 'جمعية الإحسان' },
    ];

    setDisplayDonations(donations || mockDonations);
  }, [donations]);

  return (
    <div className="w-full shadow-lg overflow-hidden max-w-[797px]">
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
          {displayDonations.map((donation) => (
            <div key={donation.id} className="flex-shrink-0 ">
              <div className="rounded-lg overflow-hidden gap-2">
                {/* Amount Section */}
                <div className="bg-donation-gold w-[137px] h-[42px] justify-center items-center flex rounded-t-md text-center">
                  <div className="text-white font-somar font-bold text-sm w-full h-full leading-none tracking-tight text-center flex items-center justify-center">
                    ${donation.amount.toLocaleString()}
                  </div>
                </div>

                {/* Company Section */}
                <div className="bg-donation-teal p-4 py-3 flex items-center justify-center">
                  <div className="text-white font-somar font-bold text-lg leading-none tracking-tight text-center">
                    {donation.companyName}
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
