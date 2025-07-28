'use client';

import { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

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

interface LeadsTableProps {
  leads: Lead[];
  onLeadUpdate?: () => void;
}

interface LeadDetailsModalProps {
  lead: Lead | null;
  isOpen: boolean;
  onClose: () => void;
  onStatusUpdate?: (leadId: string, status: Lead['status']) => void;
}

function LeadDetailsModal({ lead, isOpen, onClose, onStatusUpdate }: LeadDetailsModalProps) {
  const [updating, setUpdating] = useState(false);

  if (!lead) return null;

  const handleStatusChange = async (newStatus: Lead['status']) => {
    if (!onStatusUpdate) return;

    setUpdating(true);
    try {
      await onStatusUpdate(lead.id, newStatus);
      onClose();
    } catch (error) {
      console.error('Failed to update status:', error);
    } finally {
      setUpdating(false);
    }
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'new':
        return {
          color: 'bg-blue-500 text-white border-blue-500',
          icon: '🆕',
          label: 'New Lead'
        };
      case 'contacted':
        return {
          color: 'bg-amber-500 text-white border-amber-500',
          icon: '📞',
          label: 'Contacted'
        };
      case 'qualified':
        return {
          color: 'bg-emerald-500 text-white border-emerald-500',
          icon: '✅',
          label: 'Qualified'
        };
      case 'closed':
        return {
          color: 'bg-gray-500 text-white border-gray-500',
          icon: '🏁',
          label: 'Closed'
        };
      default:
        return {
          color: 'bg-gray-500 text-white border-gray-500',
          icon: '❓',
          label: 'Unknown'
        };
    }
  };

  const currentStatus = getStatusConfig(lead.status);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="p-0 w-[95vw] max-w-4xl max-h-[90vh] overflow-hidden rounded-3xl shadow-2xl">
        {/* Modern Header */}
        <div className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20"></div>
          <div className="relative p-6 sm:p-8">
            <div className="mb-6">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <span className="text-lg sm:text-xl">👤</span>
                  </div>
                  <div>
                    <h1 className="text-xl sm:text-2xl font-bold tracking-tight">{lead.name}</h1>
                    <p className="text-blue-200 text-sm font-medium">{lead.email}</p>
                  </div>
                </div>
                
                {/* Status Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm">
                  <span className="text-lg">{currentStatus.icon}</span>
                  <span className="text-sm font-semibold">{currentStatus.label}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Area - Fixed scrolling */}
        <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto bg-gray-50/50" style={{ maxHeight: 'calc(90vh - 180px)' }}>
          {/* Status Management */}
          <div className="mb-6 sm:mb-8">
            <div className="flex items-center gap-2 mb-4">
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h2 className="text-lg font-semibold text-gray-900">Update Status</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {(['new', 'contacted', 'qualified', 'closed'] as const).map((status) => {
                const config = getStatusConfig(status);
                const isActive = lead.status === status;
                return (
                  <button
                    key={status}
                    onClick={() => handleStatusChange(status)}
                    disabled={updating || isActive}
                    className={`relative p-4 rounded-xl border-2 transition-all duration-300 transform hover:scale-105 ${
                      isActive
                        ? config.color + ' shadow-lg'
                        : 'border-gray-200 bg-white text-gray-700 hover:border-blue-300 hover:shadow-md'
                    } ${updating ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                  >
                    <div className="flex flex-col items-center gap-2">
                      <span className="text-2xl">{config.icon}</span>
                      <span className="text-sm font-medium">{config.label}</span>
                    </div>
                    {isActive && (
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Contact Information */}
          <div className="mb-6 sm:mb-8">
            <div className="flex items-center gap-2 mb-4 sm:mb-6">
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <h2 className="text-lg font-semibold text-gray-900">Contact Information</h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {/* Email */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Email Address</p>
                    <a
                      href={`mailto:${lead.email}`}
                      className="text-blue-600 hover:text-blue-700 font-semibold text-sm transition-colors"
                    >
                      {lead.email}
                    </a>
                  </div>
                </div>
              </div>

              {/* Phone */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Phone Number</p>
                    <a
                      href={`tel:${lead.phone}`}
                      className="text-green-600 hover:text-green-700 font-semibold text-sm transition-colors"
                    >
                      {lead.phone}
                    </a>
                  </div>
                </div>
              </div>

              {/* Submitted Date */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Submitted On</p>
                    <p className="text-gray-900 font-semibold text-sm">
                      {new Date(lead.timestamp).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Project Details */}
          <div className="mb-6 sm:mb-8">
            <div className="flex items-center gap-2 mb-4 sm:mb-6">
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <h2 className="text-lg font-semibold text-gray-900">Project Details</h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {/* Project Type */}
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center shadow-lg">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-blue-700">Project Type</p>
                    <p className="text-blue-900 font-bold text-lg">{lead.projectType}</p>
                  </div>
                </div>
              </div>

              {/* Budget */}
              <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-2xl p-6 border border-emerald-200 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-emerald-700">Budget Range</p>
                    <p className="text-emerald-900 font-bold text-lg">{lead.budget}</p>
                  </div>
                </div>
              </div>

              {/* Timeline */}
              <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-2xl p-6 border border-amber-200 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center shadow-lg">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-amber-700">Timeline</p>
                    <p className="text-amber-900 font-bold text-lg">{lead.timeline}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Message */}
          {lead.message && (
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-4">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <h2 className="text-lg font-semibold text-gray-900">Additional Details</h2>
              </div>
              <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100">
                <div className="prose prose-sm max-w-none">
                  <p className="text-gray-800 leading-relaxed whitespace-pre-wrap text-sm sm:text-base">{lead.message}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function LeadsTable({ leads, onLeadUpdate }: LeadsTableProps) {
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState<{ [key: string]: boolean }>({});

  const handleViewLead = (lead: Lead) => {
    setSelectedLead(lead);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedLead(null);
  };

  const handleStatusUpdate = async (leadId: string, newStatus: Lead['status']) => {
    try {
      setUpdatingStatus({ ...updatingStatus, [leadId]: true });
      
      const response = await fetch('/api/leads/appwrite', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          leadId,
          status: newStatus,
        }),
      });

      if (response.ok) {
        onLeadUpdate?.();
      } else {
        console.error('Failed to update lead status');
        throw new Error('Failed to update status');
      }
    } catch (error) {
      console.error('Error updating lead status:', error);
      throw error;
    } finally {
      setUpdatingStatus({ ...updatingStatus, [leadId]: false });
    }
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      new: 'bg-blue-100 text-blue-800',
      contacted: 'bg-amber-100 text-amber-800',
      qualified: 'bg-emerald-100 text-emerald-800',
      closed: 'bg-gray-100 text-gray-800'
    };
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[status as keyof typeof colors] || colors.new}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  if (leads.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl text-gray-300 mb-4">📋</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No leads yet</h3>
        <p className="text-gray-500">New renovation inquiries will appear here.</p>
      </div>
    );
  }

  return (
    <>
      {/* Mobile Card Layout */}
      <div className="space-y-3 sm:space-y-4 lg:hidden">
        {leads.map((lead) => (
          <div
            key={lead.id}
            onClick={() => handleViewLead(lead)}
            className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-all duration-200 cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">
                    {lead.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {lead.name}
                  </h3>
                  <p className="text-sm text-gray-500">{lead.projectType}</p>
                </div>
              </div>
              <div className="flex flex-col items-end space-y-2">
                {getStatusBadge(lead.status)}
                <span className="text-xs text-gray-400">
                  {new Date(lead.timestamp).toLocaleDateString()}
                </span>
              </div>
            </div>
            
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-4 text-gray-600">
                <span>💰 {lead.budget}</span>
                <span>⏱️ {lead.timeline}</span>
              </div>
              <div className="text-blue-500 group-hover:text-blue-600">
                <span className="text-sm font-medium">View Details →</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Table (Hidden on mobile) */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Name</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Contact</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Project</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Budget</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Date</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => (
              <tr key={lead.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-3 px-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold text-xs">
                        {lead.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <span className="font-medium text-gray-900">{lead.name}</span>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className="space-y-1">
                    <div className="text-sm text-gray-900">{lead.email}</div>
                    <div className="text-sm text-gray-500">{lead.phone}</div>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <span className="text-sm text-gray-900">{lead.projectType}</span>
                </td>
                <td className="py-3 px-4">
                  <span className="text-sm text-gray-900">{lead.budget}</span>
                </td>
                <td className="py-3 px-4">
                  {getStatusBadge(lead.status)}
                </td>
                <td className="py-3 px-4">
                  <span className="text-sm text-gray-500">
                    {new Date(lead.timestamp).toLocaleDateString()}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewLead(lead)}
                    className="text-blue-600 border-blue-200 hover:bg-blue-50"
                  >
                    View
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <LeadDetailsModal
        lead={selectedLead}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onStatusUpdate={handleStatusUpdate}
      />
    </>
  );
} 