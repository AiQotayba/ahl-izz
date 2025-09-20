'use client';

import { Button } from '@/components/ui/button';
import { List, Table } from 'lucide-react';

interface ViewToggleProps {
    currentView: 'list' | 'table';
    onViewChange: (view: 'list' | 'table') => void;
}

export default function ViewToggle({ currentView, onViewChange }: ViewToggleProps) {
    return (
        <div className="flex items-center gap-2 bg-white/50 backdrop-blur-sm border border-donation-teal/20 rounded-lg p-1">
            <Button
                variant={currentView === 'table' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => onViewChange('table')}
                className={`flex items-center gap-2 font-somar ${currentView === 'table'
                    ? 'bg-donation-teal text-white hover:bg-donation-teal/90'
                    : 'text-donation-teal hover:bg-donation-teal/10'
                    }`}
            >
                <Table className="w-4 h-4" />
                جدول
            </Button>
            <Button
                variant={currentView === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => onViewChange('list')}
                className={`flex items-center gap-2 font-somar ${currentView === 'list'
                    ? 'bg-donation-teal text-white hover:bg-donation-teal/90'
                    : 'text-donation-teal hover:bg-donation-teal/10'
                    }`}
            >
                <List className="w-4 h-4" />
                قائمة
            </Button>
        </div>
    );
}
