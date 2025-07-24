'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { LeadsTable } from './LeadsTable';
import Analytics from './Analytics';

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  projectType: string;
  budget: string;
  timeline: string;
  message?: string;
  timestamp: string;
  status: 'new' | 'contacted' | 'qualified' | 'closed';
}

interface AdminDashboardProps {
  onLogout?: () => void;
}

export default function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/leads');
      const data = await response.json();
      
      if (data.success) {
        setLeads(data.leads);
        setError(null);
      } else {
        setError('Failed to fetch leads');
      }
    } catch (err) {
      setError('Error fetching leads');
      console.error('Error fetching leads:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

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
        <section className="bg-white/95 backdrop-blur-sm border border-yellow-400/20 rounded-lg">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Leads Management</h2>
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600">
                  Total: {leads.length} leads
                </span>
                <Button 
                  onClick={fetchLeads} 
                  size="sm" 
                  variant="outline"
                  disabled={loading}
                  className="border-yellow-400 text-yellow-600 hover:bg-yellow-50"
                >
                  {loading ? 'Loading...' : 'Refresh'}
                </Button>
              </div>
            </div>
            
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500"></div>
                <span className="ml-3 text-gray-600">Loading leads...</span>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <div className="text-red-500 mb-4">⚠️ {error}</div>
                <Button onClick={fetchLeads} className="bg-yellow-500 hover:bg-yellow-600">
                  Retry
                </Button>
              </div>
            ) : (
              <LeadsTable leads={leads} />
            )}
          </div>
        </section>

        {/* Analytics Section */}
        <section>
          <Analytics />
        </section>
      </div>
    </div>
  );
} 