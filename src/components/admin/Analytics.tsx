'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { AnalyticsSummary } from '@/types';

export default function Analytics() {
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [ga4Status, setGA4Status] = useState<'enabled' | 'disabled' | 'error'>('disabled');

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await fetch('/api/analytics');
        if (!response.ok) {
          throw new Error('Failed to fetch analytics');
        }
        const result = await response.json();
        setAnalytics(result.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    // Check GA4 status
    const checkGA4Status = () => {
      if (process.env.NEXT_PUBLIC_GA_ID) {
        if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
          setGA4Status('enabled');
        } else {
          setGA4Status('error');
        }
      } else {
        setGA4Status('disabled');
      }
    };

    fetchAnalytics();
    checkGA4Status();
    
    // Refresh analytics every 30 seconds
    const interval = setInterval(fetchAnalytics, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <Card className="bg-white/95 backdrop-blur-sm border-yellow-400/20">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <span className="text-yellow-500">📊</span>
            Analytics Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64">
            <div className="text-yellow-500 text-lg">Loading analytics...</div>
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
            Analytics Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64">
            <div className="text-red-500 text-lg">Error: {error}</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const analyticsCards = [
    {
      title: 'Total Leads',
      value: analytics?.totalLeads.toString() || '0',
      description: 'All time',
      icon: '👥',
    },
    {
      title: 'This Month',
      value: analytics?.thisMonth.leads.toString() || '0',
      description: 'New leads',
      icon: '📈',
    },
    {
      title: 'Conversion Rate',
      value: `${analytics?.conversionRate || 0}%`,
      description: 'Visitors to leads',
      icon: '🎯',
    },
    {
      title: 'Page Views',
      value: analytics?.thisMonth.pageViews.toString() || '0',
      description: 'This month',
      icon: '👁️',
    },
  ];

  const getGA4StatusInfo = () => {
    switch (ga4Status) {
      case 'enabled':
        return {
          color: 'text-green-600',
          bgColor: 'bg-green-100',
          icon: '✅',
          text: 'Google Analytics 4 Active',
          description: 'Dual tracking enabled (Custom + GA4)'
        };
      case 'error':
        return {
          color: 'text-orange-600',
          bgColor: 'bg-orange-100',
          icon: '⚠️',
          text: 'GA4 Configuration Issue',
          description: 'Check GA4 setup in browser console'
        };
      default:
        return {
          color: 'text-blue-600',
          bgColor: 'bg-blue-100',
          icon: 'ℹ️',
          text: 'Custom Analytics Only',
          description: 'Add NEXT_PUBLIC_GA_ID to enable GA4'
        };
    }
  };

  const ga4Info = getGA4StatusInfo();

  return (
    <Card className="bg-white/95 backdrop-blur-sm border-yellow-400/20">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <span className="text-yellow-500">📊</span>
          Analytics Overview
        </CardTitle>
        
        {/* GA4 Status Indicator */}
        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm ${ga4Info.bgColor} ${ga4Info.color}`}>
          <span>{ga4Info.icon}</span>
          <span className="font-medium">{ga4Info.text}</span>
          <span className="text-xs opacity-75">• {ga4Info.description}</span>
        </div>
      </CardHeader>
      <CardContent>
        {/* Analytics Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {analyticsCards.map((card, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-yellow-400/10 to-yellow-400/5 rounded-xl p-6 border border-yellow-400/20"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-2xl">{card.icon}</span>
                <div className="text-right">
                  <div className="text-2xl font-bold text-slate-800">{card.value}</div>
                </div>
              </div>
              <h3 className="font-semibold text-slate-800">{card.title}</h3>
              <p className="text-sm text-gray-600">{card.description}</p>
            </div>
          ))}
        </div>

        {/* Analytics Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Project Types */}
          <div className="bg-gradient-to-br from-yellow-400/5 to-yellow-400/10 rounded-xl p-6 border border-yellow-400/20">
            <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <span className="text-yellow-500">🏠</span>
              Popular Project Types
            </h3>
            <div className="space-y-3">
              {analytics?.topProjectTypes.length ? (
                analytics.topProjectTypes.map((project) => (
                  <div key={project.type} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-yellow-400" />
                      <span className="text-sm font-medium text-slate-700">{project.type}</span>
                    </div>
                    <span className="text-sm font-bold text-slate-800">{project.count} leads</span>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-500 py-8">
                  <div className="text-2xl text-yellow-400/50 mb-2">🏗️</div>
                  <p className="text-sm">No project data yet</p>
                </div>
              )}
            </div>
          </div>

          {/* Top Budget Ranges */}
          <div className="bg-gradient-to-br from-yellow-400/5 to-yellow-400/10 rounded-xl p-6 border border-yellow-400/20">
            <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <span className="text-yellow-500">💰</span>
              Budget Distribution
            </h3>
            <div className="space-y-3">
              {analytics?.topBudgets.length ? (
                analytics.topBudgets.map((budget) => (
                  <div key={budget.budget} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-green-400" />
                      <span className="text-sm font-medium text-slate-700">{budget.budget}</span>
                    </div>
                    <span className="text-sm font-bold text-slate-800">{budget.count} leads</span>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-500 py-8">
                  <div className="text-2xl text-yellow-400/50 mb-2">💳</div>
                  <p className="text-sm">No budget data yet</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Analytics Information Panel */}
        <div className="mt-6">
          <div className="bg-gradient-to-br from-yellow-400/5 to-yellow-400/10 rounded-xl p-6 border border-yellow-400/20">
            <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <span className="text-yellow-500">📊</span>
              Analytics Configuration
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Current System */}
              <div>
                <h4 className="font-medium text-slate-800 mb-2">Current System</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Custom analytics API</li>
                  <li>• Real-time tracking</li>
                  <li>• Session-based storage</li>
                  <li>• Custom dashboard</li>
                </ul>
              </div>
              
              {/* GA4 Integration */}
              <div>
                <h4 className="font-medium text-slate-800 mb-2">Google Analytics 4</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li className={ga4Status === 'enabled' ? 'text-green-600' : 'text-gray-400'}>
                    • Professional reporting
                  </li>
                  <li className={ga4Status === 'enabled' ? 'text-green-600' : 'text-gray-400'}>
                    • Advanced user insights
                  </li>
                  <li className={ga4Status === 'enabled' ? 'text-green-600' : 'text-gray-400'}>
                    • Conversion tracking
                  </li>
                  <li className={ga4Status === 'enabled' ? 'text-green-600' : 'text-gray-400'}>
                    • Long-term data retention
                  </li>
                </ul>
              </div>
            </div>
            
            {ga4Status === 'disabled' && (
              <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>💡 Tip:</strong> To enable Google Analytics 4 tracking, add your GA4 Measurement ID 
                  to the <code className="bg-blue-100 px-1 rounded">NEXT_PUBLIC_GA_ID</code> environment variable.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-6">
          <div className="bg-gradient-to-br from-yellow-400/5 to-yellow-400/10 rounded-xl p-6 border border-yellow-400/20">
            <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <span className="text-yellow-500">📊</span>
              7-Day Summary
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-slate-800">{analytics?.uniqueVisitors || 0}</div>
                <div className="text-sm text-gray-600">Total Visitors</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-slate-800">{analytics?.totalPageViews || 0}</div>
                <div className="text-sm text-gray-600">Page Views</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-slate-800">{analytics?.totalLeads || 0}</div>
                <div className="text-sm text-gray-600">Leads Generated</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-slate-800">{analytics?.conversionRate || 0}%</div>
                <div className="text-sm text-gray-600">Conversion Rate</div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 