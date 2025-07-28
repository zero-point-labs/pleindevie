'use client';

import React, { useState, useEffect, useMemo, useCallback, memo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Filter, Download, TrendingUp, Users, MousePointer, Clock } from 'lucide-react';
import { RefreshCw, Activity, Smartphone, Monitor, Globe } from 'lucide-react';
import { AnalyticsSummary, DateRange } from '@/types';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { 
  TopPagesChart,
  GenderDemographicsChart,
  AgeDemographicsChart
} from '@/components/ui/charts';
import { format, subDays } from 'date-fns';

interface EnhancedAnalyticsProps {
  className?: string;
}

export default function EnhancedAnalytics({ className }: EnhancedAnalyticsProps) {
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [dateRangeLoading, setDateRangeLoading] = useState(false);
  const initialLoadRef = React.useRef(true);
  
  // Date range state - default to last 30 days
  const [dateRange, setDateRange] = useState<DateRange>({
    startDate: format(subDays(new Date(), 29), 'yyyy-MM-dd'),
    endDate: format(new Date(), 'yyyy-MM-dd')
  });

  // Fetch analytics data with date range support
  const fetchAnalytics = useCallback(async (isRefresh = false, isDateRangeChange = false, customDateRange?: DateRange) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else if (isDateRangeChange) {
        setDateRangeLoading(true);
      } else {
        setLoading(true);
      }
      setError(null);

      const currentDateRange = customDateRange || dateRange;
      const params = new URLSearchParams({
        startDate: currentDateRange.startDate,
        endDate: currentDateRange.endDate,
      });

      const response = await fetch(`/api/analytics?${params}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch analytics');
      }
      
      const result = await response.json();
      setAnalytics(result.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      console.error('Error fetching analytics:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
      setDateRangeLoading(false);
    }
  }, []); // Remove dateRange dependency

  // Fetch data when component mounts or date range changes
  useEffect(() => {
    if (initialLoadRef.current) {
      // Initial load
      fetchAnalytics(false, false);
      initialLoadRef.current = false;
    } else {
      // Date range change
      fetchAnalytics(false, true, dateRange);
    }
  }, [dateRange, fetchAnalytics]);

  // Handle date range changes
  const handleDateRangeChange = useCallback((newDateRange: DateRange) => {
    setDateRange(newDateRange);
  }, []);

  // Handle refresh
  const handleRefresh = useCallback(() => {
    fetchAnalytics(true);
  }, [fetchAnalytics]);

  // Export data functionality
  const handleExport = useCallback(() => {
    if (!analytics) return;
    
    const exportData = {
      dateRange,
      summary: {
        totalPageViews: analytics.totalPageViews,
        uniqueVisitors: analytics.uniqueVisitors,
        totalSessions: analytics.totalSessions,
        conversionRate: analytics.conversionRate,
        totalLeads: analytics.totalLeads,
      },
      trafficSources: analytics.trafficSources,
      topPages: analytics.topPages.slice(0, 5),
      deviceBreakdown: analytics.deviceBreakdown,
      generatedAt: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json',
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics-${dateRange.startDate}-to-${dateRange.endDate}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [analytics, dateRange]);

  // Key metrics computation
  const keyMetrics = useMemo(() => {
    if (!analytics) return [];

    return [
      {
        title: 'Total Visitors',
        value: analytics.uniqueVisitors.toLocaleString(),
        change: '+12%',
        trend: 'up',
        icon: Users,
        color: 'from-blue-500 to-blue-600',
        description: 'Unique website visitors'
      },
      {
        title: 'Page Views',
        value: analytics.totalPageViews.toLocaleString(),
        change: '+8%',
        trend: 'up',
        icon: MousePointer,
        color: 'from-emerald-500 to-emerald-600',
        description: 'Total pages viewed'
      },
      {
        title: 'Conversion Rate',
        value: `${analytics.conversionRate}%`,
        change: analytics.conversionRate > 2 ? '+15%' : '-5%',
        trend: analytics.conversionRate > 2 ? 'up' : 'down',
        icon: Filter,
        color: 'from-amber-500 to-amber-600',
        description: 'Visitors to leads conversion'
      },
      {
        title: 'Total Leads',
        value: analytics.totalLeads.toString(),
        change: '+25%',
        trend: 'up',
        icon: Download,
        color: 'from-purple-500 to-purple-600',
        description: 'Project inquiries received'
      },
      {
        title: 'Avg. Session Duration',
        value: `${Math.floor(analytics.userBehavior.avgSessionDuration / 60)}:${(analytics.userBehavior.avgSessionDuration % 60).toString().padStart(2, '0')}`,
        change: '+5%',
        trend: 'up',
        icon: Clock,
        color: 'from-indigo-500 to-indigo-600',
        description: 'Time spent on site'
      },
      {
        title: 'Bounce Rate',
        value: `${analytics.userBehavior.bounceRate.toFixed(1)}%`,
        change: analytics.userBehavior.bounceRate < 50 ? '-3%' : '+2%',
        trend: analytics.userBehavior.bounceRate < 50 ? 'down' : 'up',
        icon: TrendingUp,
        color: 'from-rose-500 to-rose-600',
        description: 'Single page sessions'
      },

    ];
  }, [analytics]);

  // Mobile vs Desktop performance
  const deviceInsights = useMemo(() => {
    if (!analytics) return null;

    const mobile = analytics.deviceBreakdown.find(d => d.type === 'mobile');
    const desktop = analytics.deviceBreakdown.find(d => d.type === 'desktop');

    return {
      mobile: mobile || { type: 'mobile', count: 0, percentage: 0, browser: '', os: '' },
      desktop: desktop || { type: 'desktop', count: 0, percentage: 0, browser: '', os: '' },
      recommendation: (mobile?.percentage || 0) > 60 ? 'mobile-first' : 'desktop-first'
    };
  }, [analytics]);

  if (loading && !analytics) {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 shadow-lg p-6">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Loading comprehensive analytics...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 shadow-lg p-6">
          <div className="text-center py-12">
            <div className="text-red-500 text-3xl mb-4">⚠️</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Analytics</h3>
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={handleRefresh} className="bg-red-500 hover:bg-red-600 text-white">
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 shadow-lg p-6">
          <div className="text-center py-12">
            <div className="text-gray-300 text-3xl mb-4">📊</div>
            <p className="text-gray-500">No analytics data available</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-8 overflow-x-hidden ${className}`}>
      {/* Header with Controls */}
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl border border-blue-400/20 shadow-lg p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
              <Activity className="w-6 h-6 text-blue-500" />
              Analytics Dashboard
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Comprehensive insights for your renovation business
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={handleExport}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
              disabled={dateRangeLoading}
            >
              <Download className="w-4 h-4" />
              Export Data
            </Button>
            <Button
              onClick={handleRefresh}
              disabled={refreshing || dateRangeLoading}
              size="sm"
              className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              {refreshing ? 'Refreshing...' : 'Refresh'}
            </Button>
          </div>
        </div>
        
        {/* Date Range Picker with Loading State */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="relative overflow-hidden">
            <DateRangePicker
              value={dateRange}
              onChange={handleDateRangeChange}
              className="w-full"
            />
            {dateRangeLoading && (
              <div className="absolute inset-0 bg-white/70 backdrop-blur-sm rounded-lg flex items-center justify-center">
                <div className="flex items-center gap-2 text-blue-600">
                  <div className="w-4 h-4 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
                  <span className="text-sm font-medium">Updating data...</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="relative">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6 gap-6">
          {keyMetrics.map((metric, index) => {
            const IconComponent = metric.icon;
            return (
              <div
                key={index}
                className="bg-gradient-to-br from-white to-gray-50/80 rounded-2xl border border-gray-200/60 shadow-sm hover:shadow-lg transition-all duration-300 p-6 relative overflow-hidden"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`p-3 rounded-xl bg-gradient-to-r ${metric.color} shadow-lg`}>
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">{metric.title}</p>
                        <p className="text-xs text-gray-500">{metric.description}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-end gap-2">
                      <span className="text-3xl font-bold text-gray-900">
                        {metric.value}
                      </span>
                      <span className={`text-sm font-medium flex items-center gap-1 ${
                        metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        <TrendingUp className={`w-3 h-3 ${
                          metric.trend === 'down' ? 'rotate-180' : ''
                        }`} />
                        {metric.change}
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Loading overlay for individual metric */}
                {dateRangeLoading && (
                  <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Charts Section */}
      <div className="relative">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Age Demographics */}
          <AgeDemographicsChart 
            data={[
              { ageGroup: '25-34', count: 28, percentage: 35.0 },
              { ageGroup: '35-44', count: 22, percentage: 27.5 },
              { ageGroup: '45-54', count: 18, percentage: 22.5 },
              { ageGroup: '55+', count: 12, percentage: 15.0 }
            ]}
            loading={loading || dateRangeLoading}
            error={error || undefined}
          />

          {/* Top Pages */}
          <TopPagesChart 
            data={analytics.topPages}
            loading={loading || dateRangeLoading}
            error={error || undefined}
          />

          {/* Gender Demographics */}
          <GenderDemographicsChart 
            data={analytics.genderBreakdown || [
              { gender: 'Male', count: 45, percentage: 55 },
              { gender: 'Female', count: 37, percentage: 45 }
            ]}
            loading={loading || dateRangeLoading}
            error={error || undefined}
          />


        </div>
        
        {/* Charts loading overlay */}
        {dateRangeLoading && (
          <div className="absolute inset-0 bg-white/20 backdrop-blur-[1px] rounded-2xl flex items-center justify-center">
            <div className="bg-white/95 backdrop-blur-sm rounded-lg px-6 py-3 shadow-lg">
              <div className="flex items-center gap-3 text-blue-600">
                <div className="w-5 h-5 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
                <span className="text-sm font-medium">Updating charts...</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Business Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Device Performance Insights */}
        {deviceInsights && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Smartphone className="w-5 h-5 text-blue-500" />
              Device Performance
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center gap-3">
                  <Smartphone className="w-5 h-5 text-blue-600" />
                  <div>
                    <div className="font-medium text-gray-900">Mobile Users</div>
                    <div className="text-sm text-gray-600">
                      {deviceInsights.mobile.count} visitors
                    </div>
                  </div>
                </div>
                <div className="text-2xl font-bold text-blue-600">
                  {deviceInsights.mobile.percentage.toFixed(0)}%
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center gap-3">
                  <Monitor className="w-5 h-5 text-gray-600" />
                  <div>
                    <div className="font-medium text-gray-900">Desktop Users</div>
                    <div className="text-sm text-gray-600">
                      {deviceInsights.desktop.count} visitors
                    </div>
                  </div>
                </div>
                <div className="text-2xl font-bold text-gray-600">
                  {deviceInsights.desktop.percentage.toFixed(0)}%
                </div>
              </div>

              <div className="mt-4 p-3 bg-amber-50 rounded-lg border border-amber-200">
                <p className="text-sm text-amber-800">
                  <strong>Recommendation:</strong> Optimize for{' '}
                  {deviceInsights.recommendation === 'mobile-first' ? 'mobile' : 'desktop'} experience first
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Geographic Insights */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Globe className="w-5 h-5 text-green-500" />
            Geographic Reach
          </h3>
          
          <div className="space-y-3">
            {analytics.topCountries.slice(0, 5).map((country, index) => (
              <div key={country.country} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${
                    index === 0 ? 'bg-green-500' : 
                    index === 1 ? 'bg-blue-500' : 
                    index === 2 ? 'bg-purple-500' : 'bg-gray-400'
                  }`}></div>
                  <span className="text-sm font-medium text-gray-900">
                    {country.country}
                  </span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900">
                    {country.visitors}
                  </div>
                  <div className="text-xs text-gray-500">
                    {country.percentage.toFixed(1)}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>


    </div>
  );
}

export { EnhancedAnalytics }; 