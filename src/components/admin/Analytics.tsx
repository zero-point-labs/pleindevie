'use client';

import { useState, useEffect, useCallback, useMemo, memo, useRef } from 'react';
import { AnalyticsSummary } from '@/types';

function Analytics() {
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [ga4Status, setGA4Status] = useState<'enabled' | 'disabled' | 'error'>('disabled');
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const lastFetchTime = useRef<number>(0);

  const fetchAnalytics = useCallback(async (force = false) => {
    const now = Date.now();
    if (!force && lastFetchTime.current && now - lastFetchTime.current < 10000) {
      console.log('🚫 Skipping duplicate analytics fetch');
      return;
    }
    
    try {
      lastFetchTime.current = now;
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

  useEffect(() => {
    const isManualRefresh = refreshTrigger > 0;
    fetchAnalytics(isManualRefresh);
    checkGA4Status();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshTrigger]);

  const handleRefresh = useCallback(() => {
    console.log('🔄 Manual refresh triggered');
    setRefreshTrigger(prev => prev + 1);
  }, []);

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

  const coreMetrics = useMemo(() => {
    if (!computedMetrics) return [];
    
    return [
      {
        title: 'Visitors',
        value: analytics?.uniqueVisitors?.toLocaleString() || '0',
        trend: `${computedMetrics.weeklyVisitors} this week`,
        icon: '👥',
        color: 'from-blue-500 to-blue-600'
      },
      {
        title: 'Page Views',
        value: analytics?.totalPageViews?.toLocaleString() || '0',
        trend: `${computedMetrics.weeklyPageViews} this week`,
        icon: '👁️',
        color: 'from-emerald-500 to-emerald-600'
      },
      {
        title: 'Conversion',
        value: `${analytics?.conversionRate || 0}%`,
        trend: analytics?.totalLeads ? `${analytics.totalLeads} leads` : 'No leads yet',
        icon: '🎯',
        color: 'from-amber-500 to-amber-600'
      },
      {
        title: 'Engagement',
        value: computedMetrics.avgPagesPerSession,
        trend: computedMetrics.bounceRate > 70 ? 'High bounce' : 'Good engagement',
        icon: '📊',
        color: 'from-purple-500 to-purple-600'
      },
    ];
  }, [analytics, computedMetrics]);

  // Handle loading state
  if (loading) {
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900">Analytics</h2>
          <div className="w-6 h-6 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
        </div>
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-gray-100 rounded-lg h-16 animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  // Handle error state
  if (error) {
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900">Analytics</h2>
          <button 
            onClick={handleRefresh}
            className="text-sm bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg transition-colors"
          >
            Retry
          </button>
        </div>
        <div className="text-center py-8">
          <div className="text-red-500 text-2xl mb-2">⚠️</div>
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  if (!computedMetrics || coreMetrics.length === 0) {
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 shadow-lg p-6">
        <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">Analytics</h2>
        <div className="text-center py-8">
          <div className="text-gray-300 text-2xl mb-2">📊</div>
          <p className="text-gray-500 text-sm">No data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl border border-blue-400/20 shadow-lg p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-800">Analytics</h2>
            <p className="text-sm text-gray-500">Website performance overview</p>
          </div>
          <button 
            onClick={handleRefresh}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors self-start sm:self-auto"
          >
            🔄 Refresh
          </button>
        </div>
      </div>

      {/* Core Metrics - Redesigned for better mobile experience */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        {coreMetrics.map((metric, index) => (
          <div
            key={index}
            className="bg-gradient-to-br from-white to-gray-50/80 rounded-2xl border border-gray-200/60 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
          >
            <div className="p-4 sm:p-5">
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center shadow-inner">
                  <span className="text-2xl sm:text-3xl filter drop-shadow-sm">{metric.icon}</span>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-bold text-gray-900 leading-none">{metric.value}</div>
                  <div className="text-xs sm:text-sm font-medium text-gray-600 mt-1">{metric.title}</div>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-gray-100">
                <p className="text-xs text-gray-500 text-center leading-relaxed">{metric.trend}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* GA4 Status */}
      <div className="bg-white/95 backdrop-blur-sm rounded-xl border border-white/20 shadow-lg p-4">
        <div className="flex items-center space-x-3">
          <div className={`w-3 h-3 rounded-full ${
            ga4Status === 'enabled' ? 'bg-green-500' :
            ga4Status === 'error' ? 'bg-orange-500' : 'bg-blue-500'
          }`}></div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-900">
                {ga4Status === 'enabled' ? 'Google Analytics 4 Active' :
                 ga4Status === 'error' ? 'GA4 Configuration Issue' : 'Basic Analytics Only'}
              </span>
              <span className="text-xs text-gray-500">
                {ga4Status === 'enabled' ? '✅' : ga4Status === 'error' ? '⚠️' : 'ℹ️'}
              </span>
            </div>
            <p className="text-xs text-gray-500">
              {ga4Status === 'enabled' ? 'Full demographic & behavior tracking' :
               ga4Status === 'error' ? 'Check GA4 setup for detailed insights' : 
               'Add GA4 for demographics & behavior data'}
            </p>
          </div>
        </div>
      </div>

      {/* Traffic Sources */}
      {analytics?.trafficSources && analytics.trafficSources.length > 0 && (
        <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl p-4 border border-indigo-200 shadow-lg">
          <h3 className="text-sm font-semibold text-slate-800 mb-3 flex items-center">
            <span className="text-indigo-600 mr-2">🌐</span>
            Traffic Sources
          </h3>
          <div className="space-y-2">
            {analytics.trafficSources.slice(0, 3).map((source, index) => (
              <div key={source.source} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${
                    index === 0 ? 'bg-indigo-500' : 
                    index === 1 ? 'bg-blue-500' : 'bg-purple-500'
                  }`}></div>
                  <span className="text-sm text-slate-700 capitalize">
                    {source.source === 'direct' ? 'Direct' : 
                     source.source === 'organic' ? 'Search' :
                     source.source === 'social' ? 'Social' : source.source}
                  </span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-slate-800">{source.visitors}</div>
                  <div className="text-xs text-gray-500">{source.percentage.toFixed(0)}%</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Device Breakdown */}
      {analytics?.deviceBreakdown && analytics.deviceBreakdown.length > 0 && (
        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl p-4 border border-emerald-200 shadow-lg">
          <h3 className="text-sm font-semibold text-slate-800 mb-3 flex items-center">
            <span className="text-emerald-600 mr-2">📱</span>
            Device Usage
          </h3>
          <div className="space-y-2">
            {analytics.deviceBreakdown.slice(0, 3).map((device) => (
              <div key={device.type} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-sm">
                    {device.type === 'desktop' ? '🖥️' : 
                     device.type === 'mobile' ? '📱' : '📲'}
                  </span>
                  <span className="text-sm text-slate-700 capitalize">{device.type}</span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-slate-800">{device.count}</div>
                  <div className="text-xs text-gray-500">{device.percentage.toFixed(0)}%</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* User Behavior */}
      <div className="bg-gradient-to-br from-violet-50 to-violet-100 rounded-xl p-4 border border-violet-200 shadow-lg">
        <h3 className="text-sm font-semibold text-slate-800 mb-3 flex items-center">
          <span className="text-violet-600 mr-2">⏱️</span>
          User Behavior
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-white/60 rounded-lg">
            <div className="text-lg font-bold text-slate-800">{analytics?.totalSessions || 0}</div>
            <div className="text-xs text-gray-600">Sessions</div>
          </div>
          <div className="text-center p-3 bg-white/60 rounded-lg">
            <div className="text-lg font-bold text-slate-800">{computedMetrics?.bounceRate.toFixed(0) || '0'}%</div>
            <div className="text-xs text-gray-600">Bounce Rate</div>
          </div>
          <div className="text-center p-3 bg-white/60 rounded-lg">
            <div className="text-lg font-bold text-slate-800">
              {analytics?.userBehavior?.newVisitorsPercentage?.toFixed(0) || '85'}%
            </div>
            <div className="text-xs text-gray-600">New Visitors</div>
          </div>
          <div className="text-center p-3 bg-white/60 rounded-lg">
            <div className="text-lg font-bold text-slate-800">
              {analytics?.userBehavior?.avgSessionDuration ? 
                `${Math.floor(analytics.userBehavior.avgSessionDuration / 60)}:${(analytics.userBehavior.avgSessionDuration % 60).toString().padStart(2, '0')}` : 
                '2:30'}
            </div>
            <div className="text-xs text-gray-600">Avg. Duration</div>
          </div>
        </div>
      </div>

      {/* Setup Guide for GA4 */}
      {ga4Status === 'disabled' && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200 p-4">
          <h3 className="text-sm font-semibold text-blue-900 mb-2 flex items-center">
            <span className="mr-2">🚀</span>
            Unlock Advanced Analytics
          </h3>
          <p className="text-xs text-blue-800 mb-3">
            Get detailed demographics, real-time insights, and advanced behavior analysis.
          </p>
          <div className="bg-white/60 rounded-lg p-3">
            <p className="text-xs text-blue-900">
              <strong>Setup:</strong> Add your Google Analytics 4 Measurement ID to 
              <code className="bg-blue-200/50 px-1 rounded mx-1 text-blue-900">NEXT_PUBLIC_GA_ID</code>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default memo(Analytics); 