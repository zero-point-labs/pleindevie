'use client';

import { Button } from '@/components/ui/button';
import LeadsTable from './LeadsTable';
import Analytics from './Analytics';

interface AdminDashboardProps {
  onLogout?: () => void;
}

export default function AdminDashboard({ onLogout }: AdminDashboardProps) {
  return (
    <div className="min-h-screen bg-[#2C3E50] p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center py-8 relative">
          {onLogout && (
            <Button
              onClick={onLogout}
              variant="outline"
              className="absolute top-0 right-0 bg-white/10 border-yellow-400/30 text-white hover:bg-yellow-400 hover:text-slate-800"
            >
              Logout
            </Button>
          )}
          <h1 className="text-4xl font-bold text-white mb-2">
            Admin Dashboard
          </h1>
          <p className="text-yellow-300/80">
            Manage leads and view analytics
          </p>
        </div>

        {/* Leads Table Section */}
        <section>
          <LeadsTable />
        </section>

        {/* Analytics Section */}
        <section>
          <Analytics />
        </section>
      </div>
    </div>
  );
} 