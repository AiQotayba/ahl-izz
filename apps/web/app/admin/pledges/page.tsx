'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, AlertCircle, LucideArrowUp, LucideArrowDown } from 'lucide-react';
import { pledgeAPI } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';
import AddPledgeForm from '@/components/Pledge/AddPledgeForm';
import PledgeStats from '@/components/Pledge/PledgeStats';
import PledgeCounter from '@/components/Pledge/PledgeCounter';
import PledgeFilters from '@/components/Pledge/PledgeFilters';
import PledgeList from '@/components/Pledge/PledgeList';
import PledgeTable from '@/components/Pledge/PledgeTable';
import ViewToggle from '@/components/Pledge/ViewToggle';
import PledgeDetailsDialog from '@/components/Pledge/PledgeDetailsDialog';

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


export default function PledgesManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [paymentMethodFilter, setPaymentMethodFilter] = useState<string>('all');
  const [selectedPledge, setSelectedPledge] = useState<Pledge | null>(null);
  const [isAddPledgeOpen, setIsAddPledgeOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'table'>('table');
  const [smallScreen, setSmallScreen] = useState(false);

  // Fetch pledges data
  const { data: pledgesResponse, isLoading, error, refetch } = useQuery({
    queryKey: ['pledges'],
    queryFn: () => pledgeAPI.getAll({ limit: 100 }),
    retry: 2,
    staleTime: 30000, // 30 seconds
  });

  // Extract pledges array from response
  const pledges: Pledge[] = pledgesResponse?.data?.data || [];

  const filteredPledges = pledges.filter(pledge => {
    const matchesSearch =
      pledge.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pledge.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pledge.phoneNumber?.includes(searchTerm);

    const matchesStatus = statusFilter === 'all' || pledge.pledgeStatus === statusFilter;
    const matchesPaymentMethod = paymentMethodFilter === 'all' || pledge.paymentMethod === paymentMethodFilter;

    return matchesSearch && matchesStatus && matchesPaymentMethod;
  });

  // Loading state
  if (isLoading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {[...Array(4)].map((_, i) => <div key={i} className="h-24 bg-gray-200 rounded"></div>)}
          </div>
          <div className="grid grid-cols-1 gap-4">
            {[...Array(5)].map((_, i) => <div key={i} className="h-20 bg-gray-200 rounded"></div>)}
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="p-8">
        <div className="text-center py-12">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">خطأ في تحميل البيانات</h3>
          <p className="text-gray-600 mb-4">
            حدث خطأ أثناء تحميل التبرعات. يرجى المحاولة مرة أخرى.
          </p>
          <Button onClick={() => window.location.reload()}>
            إعادة المحاولة
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className='p-4 space-y-4'>
      {/* Header */}
      <div className={`${smallScreen ? 'hidden' : ''}`}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold text-donation-darkTeal font-somar mb-2">مركز إدارة التبرعات</h1>
            <p className="text-donation-teal font-somar text-lg">تتبع ومراجعة جميع التبرعات المقدمة لحملة حلب الإغاثية</p>
          </div>
          {/* Counter */}
          <PledgeCounter
            pledges={pledges}
            filteredPledges={filteredPledges}
          />

        </div>
      </div>

      {/* Filters and View Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 !mt-0 ">
        <PledgeFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
        />
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

          <Button
            onClick={() => setIsAddPledgeOpen(true)}
            className="bg-gradient-to-r from-donation-teal to-donation-green hover:from-donation-teal/90 hover:to-donation-green/90 text-white font-somar"
          >
            <Plus className="w-4 h-4 ml-2" />
            إضافة تبرع جديد
          </Button>
          <ViewToggle
            currentView={viewMode}
            onViewChange={setViewMode}
          />
          <Button variant={"outline"} onClick={() => setSmallScreen(!smallScreen)}>
            {smallScreen ? <LucideArrowDown className="w-4 h-4" /> : <LucideArrowUp className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className={`${smallScreen ? 'hidden' : ''}`}>
        <PledgeStats
          pledges={pledges}
          totalCount={pledgesResponse?.data?.pagination?.total}
          onStatusFilter={setStatusFilter}
          onPaymentMethodFilter={setPaymentMethodFilter}
        />
      </div>

      {/* Pledges Display */}
      {viewMode === 'list' ? (
        <PledgeList
          pledges={pledges}
          filteredPledges={filteredPledges}
          totalCount={pledgesResponse?.data?.pagination?.total}
          onPledgeSelect={setSelectedPledge}
        />
      ) : (
        <PledgeTable
          pledges={pledges}
          filteredPledges={filteredPledges}
          totalCount={pledgesResponse?.data?.pagination?.total}
          onPledgeSelect={setSelectedPledge}
        />
      )}

      {/* Pledge Details Dialog */}
      <PledgeDetailsDialog
        pledge={selectedPledge}
        isOpen={!!selectedPledge}
        onClose={() => setSelectedPledge(null)}
      />

      {/* Add Pledge Form Component */}
      <AddPledgeForm
        isOpen={isAddPledgeOpen}
        onClose={() => setIsAddPledgeOpen(false)}
      />
    </div>
  );
}
