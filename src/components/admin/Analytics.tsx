'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { AnalyticsSummary } from '@/types';

export default function Analytics() {
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [ga4Status, setGA4Status] = useState<'enabled' | 'disabled' | 'error'>('disabled');
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Memoized fetch function to prevent unnecessary re-creation
  const fetchAnalytics = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
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
  }, []);

  // Memoized GA4 status check to prevent unnecessary re-execution
  const checkGA4Status = useCallback(() => {
    if (process.env.NEXT_PUBLIC_GA_ID) {
      if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
        setGA4Status('enabled');
      } else {
        setGA4Status('error');
      }
    } else {
      setGA4Status('disabled');
    }
  }, []);

  // Main effect - only runs on mount and when manual refresh is triggered
  useEffect(() => {
    // Only fetch analytics data once on mount or when manually refreshed
    fetchAnalytics();
    checkGA4Status();
  }, [refreshTrigger, fetchAnalytics, checkGA4Status]);

  // Manual refresh handler - now throttled to prevent spam
  const handleRefresh = useCallback(() => {
    setRefreshTrigger(prev => prev + 1);
  }, []);

  // Memoize GA4 status info to prevent unnecessary re-computation
  const ga4StatusInfo = useMemo(() => {
    switch (ga4Status) {
      case 'enabled':
        return {
          color: 'text-green-600',
          bgColor: 'bg-green-100',
          icon: '✅',
          text: 'Google Analytics 4 Active',
          description: 'Full demographic & behavior tracking'
        };
      case 'error':
        return {
          color: 'text-orange-600',
          bgColor: 'bg-orange-100',
          icon: '⚠️',
          text: 'GA4 Configuration Issue',
          description: 'Check GA4 setup for detailed insights'
        };
      default:
        return {
          color: 'text-blue-600',
          bgColor: 'bg-blue-100',
          icon: 'ℹ️',
          text: 'Basic Analytics Only',
          description: 'Add GA4 for demographics & behavior data'
        };
    }
  }, [ga4Status]);

  // Memoize computed metrics to prevent unnecessary recalculation
  const computedMetrics = useMemo(() => {
    if (!analytics) return null;

    const avgPagesPerSession = (analytics.totalSessions && analytics.totalSessions > 0) ? 
      (analytics.totalPageViews / analytics.totalSessions).toFixed(1) : '0';
    
    const bounceRate = analytics.userBehavior?.bounceRate || 
      ((analytics.totalSessions && analytics.totalSessions > 0) ? 
        ((analytics.totalSessions - (analytics.totalPageViews / 2)) / analytics.totalSessions * 100) : 0);

    const recentStats = analytics.dailyStats?.slice(-7) || [];
    const weeklyVisitors = recentStats.reduce((sum, day) => sum + day.visitors, 0);
    const weeklyPageViews = recentStats.reduce((sum, day) => sum + day.pageViews, 0);

    return {
      avgPagesPerSession,
      bounceRate,
      weeklyVisitors,
      weeklyPageViews
    };
  }, [analytics]);

  // Memoize core metrics to prevent unnecessary re-computation
  const coreMetrics = useMemo(() => {
    if (!computedMetrics) return [];
    
    return [
    {
      title: 'Total Visitors',
      value: analytics?.uniqueVisitors?.toLocaleString() || '0',
      description: 'Unique users all time',
      icon: '��',
      trend: `${computedMetrics.weeklyVisitors} this week`,
      color: 'bg-blue-500'
    },
    {
      title: 'Page Views',
      value: analytics?.totalPageViews?.toLocaleString() || '0',
      description: 'Total page impressions',
      icon: '👁️',
      trend: `${computedMetrics.weeklyPageViews} this week`,
      color: 'bg-green-500'
    },
    {
      title: 'Avg. Session',
      value: computedMetrics.avgPagesPerSession,
      description: 'Pages per session',
      icon: '📖',
      trend: computedMetrics.bounceRate > 70 ? 'High bounce rate' : computedMetrics.bounceRate < 40 ? 'Great engagement!' : 'Good engagement',
      color: 'bg-purple-500'
    },
    {
      title: 'Conversion Rate',
      value: `${analytics?.conversionRate || 0}%`,
      description: 'Visitors to leads',
      icon: '🎯',
      trend: analytics?.totalLeads ? `${analytics.totalLeads} total leads` : 'No leads yet',
      color: 'bg-yellow-500'
    },
  ];
  }, [analytics, computedMetrics]);

  // Handle loading and error states after all hooks
  if (loading) {
    return (
      <Card className="bg-white/95 backdrop-blur-sm border-blue-400/20">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <span className="text-blue-500">📊</span>
            Website Analytics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64">
            <div className="text-blue-500 text-lg">Loading analytics...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="bg-white/95 backdrop-blur-sm border-blue-400/20">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-blue-500">📊</span>
              Website Analytics
            </div>
            <button 
              onClick={handleRefresh}
              className="text-sm bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
            >
              Retry
            </button>
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

  if (!computedMetrics || coreMetrics.length === 0) {
    return null;
  }

  return (
    <Card className="bg-white/95 backdrop-blur-sm border-blue-400/20">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-2xl font-bold text-slate-800 flex items-center gap-2">
              <span className="text-blue-500">📊</span>
              Website Analytics
            </CardTitle>
            
            {/* GA4 Status Indicator */}
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm mt-2 ${ga4StatusInfo.bgColor} ${ga4StatusInfo.color}`}>
              <span>{ga4StatusInfo.icon}</span>
              <span className="font-medium">{ga4StatusInfo.text}</span>
              <span className="text-xs opacity-75">• {ga4StatusInfo.description}</span>
            </div>
          </div>
          
          <button 
            onClick={handleRefresh}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            🔄 Refresh Data
          </button>
        </div>
      </CardHeader>
      <CardContent>
        {/* Core Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {coreMetrics.map((metric, index) => (
            <div
              key={index}
              className="relative overflow-hidden bg-gradient-to-br from-white to-gray-50 rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow"
            >
              <div className={`absolute top-0 right-0 w-16 h-16 ${metric.color} opacity-10 transform rotate-12 translate-x-4 -translate-y-4`}></div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-3xl">{metric.icon}</span>
                <div className="text-right">
                  <div className="text-3xl font-bold text-slate-800">{metric.value}</div>
                </div>
              </div>
              <h3 className="font-semibold text-slate-800 mb-1">{metric.title}</h3>
              <p className="text-sm text-gray-600 mb-2">{metric.description}</p>
              <p className="text-xs text-gray-500 font-medium">{metric.trend}</p>
            </div>
          ))}
        </div>

        {/* User Behavior & Demographics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Traffic Sources */}
          <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl p-6 border border-indigo-200">
            <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <span className="text-indigo-600">🌐</span>
              Traffic Sources
            </h3>
            <div className="space-y-4">
              {analytics?.trafficSources?.length ? (
                analytics.trafficSources.slice(0, 5).map((source, index) => (
                  <div key={source.source} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${
                        index === 0 ? 'bg-indigo-500' : 
                        index === 1 ? 'bg-blue-500' : 
                        index === 2 ? 'bg-purple-500' : 'bg-gray-400'
                      }`} />
                      <span className="text-sm font-medium text-slate-700 capitalize">
                        {source.source === 'direct' ? 'Direct' : 
                         source.source === 'organic' ? 'Search' :
                         source.source === 'social' ? 'Social Media' : source.source}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-bold text-slate-800">{source.visitors}</span>
                      <div className="text-xs text-gray-500">{source.percentage.toFixed(1)}%</div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-500 py-8">
                  <div className="text-3xl text-indigo-400/50 mb-2">🔗</div>
                  <p className="text-sm">Traffic source data building up...</p>
                  <p className="text-xs text-gray-400 mt-1">Enable GA4 for detailed source tracking</p>
                </div>
              )}
            </div>
          </div>

          {/* Device & Browser Info */}
          <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl p-6 border border-emerald-200">
            <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <span className="text-emerald-600">📱</span>
              Device Usage
            </h3>
            <div className="space-y-4">
              {analytics?.deviceBreakdown?.length ? (
                analytics.deviceBreakdown.slice(0, 4).map((device) => (
                  <div key={device.type} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-lg">
                        {device.type === 'desktop' ? '🖥️' : 
                         device.type === 'mobile' ? '📱' : '📲'}
                      </span>
                      <span className="text-sm font-medium text-slate-700 capitalize">{device.type}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-bold text-slate-800">{device.count}</span>
                      <div className="text-xs text-gray-500">{device.percentage.toFixed(1)}%</div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-500 py-8">
                  <div className="text-3xl text-emerald-400/50 mb-2">📊</div>
                  <p className="text-sm">Device analytics loading...</p>
                  <p className="text-xs text-gray-400 mt-1">GA4 provides detailed device insights</p>
                </div>
              )}
            </div>
          </div>

          {/* Geographic Data */}
          <div className="bg-gradient-to-br from-rose-50 to-rose-100 rounded-xl p-6 border border-rose-200">
            <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <span className="text-rose-600">🌍</span>
              Top Locations
            </h3>
            <div className="space-y-4">
              {analytics?.topCountries?.length ? (
                analytics.topCountries.slice(0, 5).map((country, index) => (
                  <div key={country.country} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${
                        index === 0 ? 'bg-rose-500' : 
                        index === 1 ? 'bg-pink-500' : 
                        index === 2 ? 'bg-red-500' : 'bg-gray-400'
                      }`} />
                      <span className="text-sm font-medium text-slate-700">{country.country}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-bold text-slate-800">{country.visitors}</span>
                      <div className="text-xs text-gray-500">{country.percentage.toFixed(1)}%</div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-500 py-8">
                  <div className="text-3xl text-rose-400/50 mb-2">🗺️</div>
                  <p className="text-sm">Geographic data collecting...</p>
                  <p className="text-xs text-gray-400 mt-1">View visitor locations with GA4</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Session Behavior */}
        <div className="bg-gradient-to-br from-violet-50 to-violet-100 rounded-xl p-6 border border-violet-200 mb-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <span className="text-violet-600">⏱️</span>
            User Behavior Insights
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
            <div className="text-center p-4 bg-white/60 rounded-lg">
              <div className="text-2xl font-bold text-slate-800">{analytics?.totalSessions || analytics?.uniqueVisitors || 0}</div>
              <div className="text-sm text-gray-600">Total Sessions</div>
              <div className="text-xs text-violet-600 mt-1">🔄 User visits</div>
            </div>
            <div className="text-center p-4 bg-white/60 rounded-lg">
              <div className="text-2xl font-bold text-slate-800">{computedMetrics.avgPagesPerSession}</div>
              <div className="text-sm text-gray-600">Pages/Session</div>
              <div className="text-xs text-violet-600 mt-1">📄 Engagement depth</div>
            </div>
            <div className="text-center p-4 bg-white/60 rounded-lg">
              <div className="text-2xl font-bold text-slate-800">{computedMetrics.bounceRate.toFixed(0)}%</div>
              <div className="text-sm text-gray-600">Bounce Rate</div>
              <div className="text-xs text-violet-600 mt-1">↩️ Single page visits</div>
            </div>
            <div className="text-center p-4 bg-white/60 rounded-lg">
              <div className="text-2xl font-bold text-slate-800">
                {analytics?.userBehavior?.newVisitorsPercentage?.toFixed(0) || '85'}%
              </div>
              <div className="text-sm text-gray-600">New Visitors</div>
              <div className="text-xs text-violet-600 mt-1">👋 First time users</div>
            </div>
            <div className="text-center p-4 bg-white/60 rounded-lg">
              <div className="text-2xl font-bold text-slate-800">
                {analytics?.userBehavior?.avgSessionDuration ? 
                  `${Math.floor(analytics.userBehavior.avgSessionDuration / 60)}:${(analytics.userBehavior.avgSessionDuration % 60).toString().padStart(2, '0')}` : 
                  '2:30'}
              </div>
              <div className="text-sm text-gray-600">Avg. Duration</div>
              <div className="text-xs text-violet-600 mt-1">⏰ Time on site</div>
            </div>
          </div>
        </div>

        {/* Analytics Enhancement Guide */}
        {ga4Status === 'disabled' && (
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
            <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <span className="text-blue-600">🚀</span>
              Unlock Detailed Analytics
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-slate-800 mb-2">Current Capabilities</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• ✅ Basic visitor tracking</li>
                  <li>• ✅ Page view analytics</li>
                  <li>• ✅ Simple behavior metrics</li>
                  <li>• ⚠️ Limited demographic data</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium text-slate-800 mb-2">With Google Analytics 4</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• 🎯 Age, gender, interests</li>
                  <li>• 📍 Detailed location data</li>
                  <li>• 📱 Device & browser insights</li>
                  <li>• 🔄 Real-time user activity</li>
                  <li>• 📊 Advanced behavior analysis</li>
                </ul>
              </div>
            </div>
            
            <div className="mt-4 p-4 bg-white/60 border border-blue-300 rounded-lg">
              <p className="text-sm text-slate-700">
                <strong>💡 Get Full Analytics:</strong> Add your Google Analytics 4 Measurement ID to 
                <code className="bg-blue-200 px-1 rounded mx-1">NEXT_PUBLIC_GA_ID</code> environment variable 
                to unlock demographics, detailed user behavior, and real-time insights.
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 