'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { LeadsTable } from './LeadsTable';
import { EnhancedAnalytics } from './EnhancedAnalytics';
import { useAuth } from '@/contexts/AuthContext';

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

export default function AdminDashboard() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'leads' | 'analytics'>('leads');
  
  const { user, logout } = useAuth();

  const fetchLeads = async () => {
    try {
      setLoading(true);
      
      // Try to fetch from Appwrite first
      try {
        const response = await fetch('/api/leads/appwrite');
        const data = await response.json();
        
        if (data.success) {
          setLeads(data.leads);
          setError(null);
          return;
        }
      } catch (appwriteError) {
        console.log('Appwrite API failed, trying fallback:', appwriteError);
      }
      
      // Fallback to original API if Appwrite fails
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

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Get stats for quick overview
  const stats = {
    total: leads.length,
    new: leads.filter(lead => lead.status === 'new').length,
    contacted: leads.filter(lead => lead.status === 'contacted').length,
    qualified: leads.filter(lead => lead.status === 'qualified').length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-white/20 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                  <span className="text-white text-lg sm:text-xl font-bold">R</span>
                </div>
                <div>
                  <h1 className="text-lg sm:text-xl font-bold text-gray-900">
                    RenovatePro Admin
                  </h1>
                  <p className="text-xs sm:text-sm text-gray-500 hidden sm:block">
                    Welcome back, {user?.name || user?.email}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              {/* User info on mobile */}
              <div className="sm:hidden">
                <p className="text-xs text-gray-500">
                  {user?.name || user?.email?.split('@')[0]}
                </p>
              </div>
              
              <Button
                onClick={handleLogout}
                variant="outline"
                size="sm"
                className="border-gray-200 text-gray-600 hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition-all duration-200"
              >
                <span className="hidden sm:inline">Logout</span>
                <span className="sm:hidden">👋</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Mobile Tabs */}
        <div className="flex bg-white/60 backdrop-blur-sm rounded-xl p-1 mb-6 lg:hidden">
          <button
            onClick={() => setActiveTab('leads')}
            className={`flex-1 py-3 px-4 rounded-lg font-medium text-sm transition-all duration-200 ${
              activeTab === 'leads'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Leads ({stats.total})
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex-1 py-3 px-4 rounded-lg font-medium text-sm transition-all duration-200 ${
              activeTab === 'analytics'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Analytics
          </button>
        </div>

        {/* Content */}
        <div className="space-y-6 lg:space-y-8">
          {/* Leads Section */}
          <div className={`${activeTab === 'analytics' ? 'hidden lg:block' : ''}`}>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 shadow-lg">
              <div className="p-4 sm:p-6 border-b border-gray-100">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Leads</h2>
                    <p className="text-sm text-gray-500">Manage your renovation inquiries</p>
                  </div>
                  <Button 
                    onClick={fetchLeads} 
                    size="sm" 
                    disabled={loading}
                    className="bg-blue-500 hover:bg-blue-600 text-white self-start sm:self-auto"
                  >
                    {loading ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Loading...</span>
                      </div>
                    ) : (
                      '🔄 Refresh'
                    )}
                  </Button>
                </div>
              </div>
              
              <div className="p-4 sm:p-6">
                {loading && leads.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mb-4"></div>
                    <span className="text-gray-600">Loading leads...</span>
                  </div>
                ) : error ? (
                  <div className="text-center py-12">
                    <div className="text-red-500 mb-4 text-lg">⚠️</div>
                    <div className="text-red-600 mb-4 font-medium">{error}</div>
                    <Button onClick={fetchLeads} className="bg-red-500 hover:bg-red-600 text-white">
                      Try Again
                    </Button>
                  </div>
                ) : (
                  <LeadsTable leads={leads} onLeadUpdate={fetchLeads} />
                )}
              </div>
            </div>
          </div>

          {/* Analytics Section */}
          <div className={`${activeTab === 'leads' ? 'hidden lg:block' : ''}`}>
            <EnhancedAnalytics />
          </div>
        </div>
      </div>
    </div>
  );
} 