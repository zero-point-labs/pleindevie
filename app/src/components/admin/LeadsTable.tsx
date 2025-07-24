'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  projectType: string;
  budget: string;
  timeline: string;
  message: string;
  termsAccepted: boolean;
  marketingConsent: boolean;
  timestamp: string;
  status: 'new' | 'contacted' | 'qualified' | 'closed';
}

interface LeadDetailsModalProps {
  lead: Lead;
  onClose: () => void;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'new': return 'bg-blue-100 text-blue-800';
    case 'contacted': return 'bg-yellow-100 text-yellow-800';
    case 'qualified': return 'bg-green-100 text-green-800';
    case 'closed': return 'bg-gray-100 text-gray-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

function LeadDetailsModal({ lead, onClose }: LeadDetailsModalProps) {
  return (
    <DialogContent className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
      <DialogHeader className="pb-4">
        <DialogTitle className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <span className="text-yellow-500">👤</span>
          Lead Details - {lead.name}
        </DialogTitle>
      </DialogHeader>
      
      <div className="space-y-6 text-slate-800">
        {/* Contact Information */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
            <span className="text-blue-500">📞</span>
            Contact Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-600 block">Full Name</label>
              <p className="text-slate-800 font-medium mt-1">{lead.name}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600 block">Email Address</label>
              <p className="text-slate-800 mt-1">{lead.email}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600 block">Phone Number</label>
              <p className="text-slate-800 mt-1">{lead.phone}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600 block">Submission Date</label>
              <p className="text-slate-800 mt-1">{new Date(lead.timestamp).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}</p>
            </div>
          </div>
        </div>

        {/* Project Information */}
        <div className="bg-blue-50 rounded-lg p-4">
          <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
            <span className="text-green-500">🏠</span>
            Project Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-600 block">Project Type</label>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 mt-1">
                {lead.projectType}
              </span>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600 block">Budget Range</label>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 mt-1">
                {lead.budget}
              </span>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600 block">Timeline</label>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800 mt-1">
                {lead.timeline}
              </span>
            </div>
          </div>
        </div>

        {/* Message */}
        {lead.message && (
          <div className="bg-yellow-50 rounded-lg p-4">
            <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
              <span className="text-orange-500">💬</span>
              Project Message
            </h3>
            <p className="text-slate-700 whitespace-pre-wrap leading-relaxed">{lead.message}</p>
          </div>
        )}

        {/* Status and Consent */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
            <span className="text-purple-500">⚙️</span>
            Status & Consent
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-600 block">Current Status</label>
              <div className="mt-1">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(lead.status)}`}>
                  {lead.status}
                </span>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600 block">Terms Accepted</label>
              <div className="mt-1 flex items-center gap-2">
                <span className={`text-sm font-medium ${lead.termsAccepted ? 'text-green-600' : 'text-red-600'}`}>
                  {lead.termsAccepted ? '✓ Yes' : '✗ No'}
                </span>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600 block">Marketing Consent</label>
              <div className="mt-1 flex items-center gap-2">
                <span className={`text-sm font-medium ${lead.marketingConsent ? 'text-green-600' : 'text-red-600'}`}>
                  {lead.marketingConsent ? '✓ Yes' : '✗ No'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DialogContent>
  );
}

export default function LeadsTable() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

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

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };



  if (loading) {
    return (
      <Card className="bg-white/95 backdrop-blur-sm border-yellow-400/20">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <span className="text-yellow-500">📊</span>
            Leads Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500"></div>
            <span className="ml-3 text-gray-600">Loading leads...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="bg-white/95 backdrop-blur-sm border-yellow-400/20">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <span className="text-yellow-500">📊</span>
            Leads Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <div className="text-red-500 mb-4">⚠️ {error}</div>
            <Button onClick={fetchLeads} className="bg-yellow-500 hover:bg-yellow-600">
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="bg-white/95 backdrop-blur-sm border-yellow-400/20">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-slate-800 flex items-center gap-2 justify-between">
            <div className="flex items-center gap-2">
              <span className="text-yellow-500">📊</span>
              Leads Management
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm font-normal text-gray-600">
                Total: {leads.length} leads
              </span>
              <Button 
                onClick={fetchLeads} 
                size="sm" 
                variant="outline"
                className="border-yellow-400 text-yellow-600 hover:bg-yellow-50"
              >
                Refresh
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {leads.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <div className="flex flex-col items-center gap-3">
                <div className="text-4xl text-yellow-400/50">📋</div>
                <p className="text-lg font-medium">No leads yet</p>
                <p className="text-sm">Leads from the contact form will appear here</p>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-yellow-400/20">
                    <th className="text-left py-3 px-4 font-semibold text-slate-800">Name</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-800">Email</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-800">Phone</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-800">Project Type</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-800">Budget</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-800">Timeline</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-800">Date</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-800">Status</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-800">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {leads.map((lead) => (
                    <tr key={lead.id} className="border-b border-gray-100 hover:bg-yellow-50/50 transition-colors">
                      <td className="py-4 px-4">
                        <div className="font-medium text-slate-800">{lead.name}</div>
                        {lead.marketingConsent && (
                          <div className="text-xs text-green-600 flex items-center gap-1 mt-1">
                            <span>✓</span> Marketing consent
                          </div>
                        )}
                      </td>
                      <td className="py-4 px-4 text-slate-600">{lead.email}</td>
                      <td className="py-4 px-4 text-slate-600">{lead.phone}</td>
                      <td className="py-4 px-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {lead.projectType}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {lead.budget}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                          {lead.timeline}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-slate-600 text-sm">
                        {formatDate(lead.timestamp)}
                      </td>
                      <td className="py-4 px-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(lead.status)}`}>
                          {lead.status}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-xs border-gray-300 text-gray-700 hover:bg-gray-100 hover:text-gray-900 hover:border-gray-400 transition-colors"
                                onClick={() => setSelectedLead(lead)}
                              >
                                View
                              </Button>
                            </DialogTrigger>
                            {selectedLead && selectedLead.id === lead.id && (
                              <LeadDetailsModal 
                                lead={selectedLead} 
                                onClose={() => setSelectedLead(null)} 
                              />
                            )}
                          </Dialog>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
} 