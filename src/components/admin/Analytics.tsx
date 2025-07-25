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
            <span className="text-yellow-500">��</span>
            Universal Analytics Dashboard
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
            Universal Analytics Dashboard
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

  // Mock data for universal analytics (in real implementation, this would come from API)
  const universalMetrics = {
    userBehavior: {
      avgTimeOnPage: '2m 34s',
      bounceRate: '42%',
      avgScrollDepth: '68%',
      exitIntentRate: '15%',
    },
    engagement: {
      highEngagement: '23%',
      mediumEngagement: '45%',
      lowEngagement: '32%',
      avgSessionDepth: '3.2 pages',
    },
    devices: {
      mobile: '67%',
      desktop: '28%',
      tablet: '5%',
      topResolution: '1920x1080',
    },
    demographics: {
      topAgeGroup: '25-34 (34%)',
      genderSplit: 'Female 58%, Male 42%',
      topLocation: 'United States',
      topLanguage: 'English (US)',
    },
    contactIntent: {
      high: '18%',
      medium: '35%',
      low: '47%',
      phoneClicks: '12',
    },
    timing: {
      peakHour: '2-3 PM',
      peakDay: 'Tuesday',
      avgVisitDuration: '3m 45s',
      returnVisitorRate: '28%',
    }
  };

  const getGA4StatusInfo = () => {
    switch (ga4Status) {
      case 'enabled':
        return {
          color: 'text-green-600',
          bgColor: 'bg-green-100',
          icon: '✅',
          text: 'Universal Analytics Active',
          description: 'Full tracking enabled (Custom + GA4 + Demographics)'
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
          description: 'Add NEXT_PUBLIC_GA_ID to enable universal tracking'
        };
    }
  };

  const ga4Info = getGA4StatusInfo();

  return (
    <Card className="bg-white/95 backdrop-blur-sm border-yellow-400/20">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <span className="text-yellow-500">📊</span>
          Universal Analytics Dashboard
        </CardTitle>
        
        {/* GA4 Status Indicator */}
        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm ${ga4Info.bgColor} ${ga4Info.color}`}>
          <span>{ga4Info.icon}</span>
          <span className="font-medium">{ga4Info.text}</span>
          <span className="text-xs opacity-75">• {ga4Info.description}</span>
        </div>
      </CardHeader>
      <CardContent>
        {/* Main Analytics Cards */}
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

        {/* Universal Analytics Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
          
          {/* User Behavior Analytics */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl p-6 border border-blue-200/50">
            <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <span className="text-blue-500">🎯</span>
              User Behavior
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">Avg Time on Page</span>
                <span className="font-semibold text-slate-800">{universalMetrics.userBehavior.avgTimeOnPage}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">Bounce Rate</span>
                <span className="font-semibold text-slate-800">{universalMetrics.userBehavior.bounceRate}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">Avg Scroll Depth</span>
                <span className="font-semibold text-slate-800">{universalMetrics.userBehavior.avgScrollDepth}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">Exit Intent Rate</span>
                <span className="font-semibold text-slate-800">{universalMetrics.userBehavior.exitIntentRate}</span>
              </div>
            </div>
          </div>

          {/* Engagement Levels */}
          <div className="bg-gradient-to-br from-green-50 to-green-100/50 rounded-xl p-6 border border-green-200/50">
            <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <span className="text-green-500">💚</span>
              Engagement Levels
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">High Engagement</span>
                <span className="font-semibold text-green-600">{universalMetrics.engagement.highEngagement}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">Medium Engagement</span>
                <span className="font-semibold text-yellow-600">{universalMetrics.engagement.mediumEngagement}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">Low Engagement</span>
                <span className="font-semibold text-slate-600">{universalMetrics.engagement.lowEngagement}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">Avg Session Depth</span>
                <span className="font-semibold text-slate-800">{universalMetrics.engagement.avgSessionDepth}</span>
              </div>
            </div>
          </div>

          {/* Device Analytics */}
          <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-xl p-6 border border-purple-200/50">
            <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <span className="text-purple-500">📱</span>
              Device Analytics
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">Mobile</span>
                <span className="font-semibold text-slate-800">{universalMetrics.devices.mobile}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">Desktop</span>
                <span className="font-semibold text-slate-800">{universalMetrics.devices.desktop}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">Tablet</span>
                <span className="font-semibold text-slate-800">{universalMetrics.devices.tablet}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">Top Resolution</span>
                <span className="font-semibold text-slate-800">{universalMetrics.devices.topResolution}</span>
              </div>
            </div>
          </div>

          {/* Demographics */}
          <div className="bg-gradient-to-br from-orange-50 to-orange-100/50 rounded-xl p-6 border border-orange-200/50">
            <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <span className="text-orange-500">👤</span>
              Demographics
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">Top Age Group</span>
                <span className="font-semibold text-slate-800">{universalMetrics.demographics.topAgeGroup}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">Gender Split</span>
                <span className="font-semibold text-slate-800">{universalMetrics.demographics.genderSplit}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">Top Location</span>
                <span className="font-semibold text-slate-800">{universalMetrics.demographics.topLocation}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">Language</span>
                <span className="font-semibold text-slate-800">{universalMetrics.demographics.topLanguage}</span>
              </div>
            </div>
          </div>

          {/* Contact Intent */}
          <div className="bg-gradient-to-br from-pink-50 to-pink-100/50 rounded-xl p-6 border border-pink-200/50">
            <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <span className="text-pink-500">📞</span>
              Contact Intent
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">High Intent</span>
                <span className="font-semibold text-green-600">{universalMetrics.contactIntent.high}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">Medium Intent</span>
                <span className="font-semibold text-yellow-600">{universalMetrics.contactIntent.medium}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">Low Intent</span>
                <span className="font-semibold text-slate-600">{universalMetrics.contactIntent.low}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">Phone Clicks</span>
                <span className="font-semibold text-slate-800">{universalMetrics.contactIntent.phoneClicks}</span>
              </div>
            </div>
          </div>

          {/* Timing & Patterns */}
          <div className="bg-gradient-to-br from-indigo-50 to-indigo-100/50 rounded-xl p-6 border border-indigo-200/50">
            <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <span className="text-indigo-500">⏰</span>
              Timing & Patterns
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">Peak Hour</span>
                <span className="font-semibold text-slate-800">{universalMetrics.timing.peakHour}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">Peak Day</span>
                <span className="font-semibold text-slate-800">{universalMetrics.timing.peakDay}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">Avg Visit Duration</span>
                <span className="font-semibold text-slate-800">{universalMetrics.timing.avgVisitDuration}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">Return Visitors</span>
                <span className="font-semibold text-slate-800">{universalMetrics.timing.returnVisitorRate}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Original Project Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
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
              <span className="text-yellow-500">⚡</span>
              Universal Analytics Features
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Automatic Tracking */}
              <div>
                <h4 className="font-medium text-slate-800 mb-2">Automatic Tracking</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Scroll depth milestones</li>
                  <li>• Time on page intervals</li>
                  <li>• Exit intent detection</li>
                  <li>• Device categorization</li>
                </ul>
              </div>
              
              {/* GA4 Demographics */}
              <div>
                <h4 className="font-medium text-slate-800 mb-2">GA4 Demographics</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li className={ga4Status === 'enabled' ? 'text-green-600' : 'text-gray-400'}>
                    • Age and gender insights
                  </li>
                  <li className={ga4Status === 'enabled' ? 'text-green-600' : 'text-gray-400'}>
                    • Interest categories
                  </li>
                  <li className={ga4Status === 'enabled' ? 'text-green-600' : 'text-gray-400'}>
                    • Geographic data
                  </li>
                  <li className={ga4Status === 'enabled' ? 'text-green-600' : 'text-gray-400'}>
                    • Technology preferences
                  </li>
                </ul>
              </div>

              {/* Business Intelligence */}
              <div>
                <h4 className="font-medium text-slate-800 mb-2">Business Intelligence</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Engagement scoring</li>
                  <li>• Contact intent analysis</li>
                  <li>• User journey mapping</li>
                  <li>• Conversion optimization</li>
                </ul>
              </div>
            </div>
            
            {ga4Status === 'disabled' && (
              <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>🚀 Universal Analytics Ready:</strong> Add your GA4 Measurement ID 
                  to unlock demographics, advanced user insights, and professional reporting.
                </p>
              </div>
            )}

            {ga4Status === 'enabled' && (
              <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-800">
                  <strong>✅ Universal Analytics Active:</strong> Full tracking enabled with demographics, 
                  user behavior analysis, and professional GA4 reporting. Works for any business type!
                </p>
              </div>
            )}
          </div>
        </div>

        {/* 7-Day Summary */}
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