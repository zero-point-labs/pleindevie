import { NextResponse } from 'next/server';
import { AnalyticsSummary, AnalyticsEvent } from '../../../src/types';
import { fetchGA4Analytics, fetchGA4DailyStats, fetchGA4PagePerformance } from '../../../src/lib/googleAnalytics';

// In-memory storage for demo purposes
// In production, you'd use a proper database
const analyticsEvents: AnalyticsEvent[] = [];
const analyticsSessions: Array<{
  id: string;
  startTime: string;
  endTime?: string;
  pageViews: number;
  userAgent: string;
  referrer: string;
  ipAddress: string;
}> = [];

// Helper functions
function parseUserAgent(userAgent: string) {
  const device = /Mobile|Android|iPhone|iPad/.test(userAgent) ? 
    (/iPad/.test(userAgent) ? 'tablet' : 'mobile') : 'desktop';
  
  let browser = 'Unknown';
  if (userAgent.includes('Chrome')) browser = 'Chrome';
  else if (userAgent.includes('Firefox')) browser = 'Firefox';
  else if (userAgent.includes('Safari')) browser = 'Safari';
  else if (userAgent.includes('Edge')) browser = 'Edge';
  
  const os = /Windows/.test(userAgent) ? 'Windows' :
    /Mac/.test(userAgent) ? 'macOS' :
    /Linux/.test(userAgent) ? 'Linux' :
    /Android/.test(userAgent) ? 'Android' :
    /iOS/.test(userAgent) ? 'iOS' : 'Unknown';
  
  return { device, browser, os };
}

function getTrafficSource(referrer: string): string {
  if (!referrer) return 'direct';
  if (referrer.includes('google.com')) return 'organic';
  if (referrer.includes('facebook.com') || referrer.includes('twitter.com') || 
      referrer.includes('linkedin.com') || referrer.includes('instagram.com')) return 'social';
  return 'referral';
}

// GET endpoint - retrieve analytics summary
// OPTIMIZATION: This endpoint is now called only on admin page load and manual refresh
// Previous issue: Was being called repeatedly due to component re-renders
export async function GET() {
  try {
    // Try to fetch real GA4 data first (primary data source)
    const ga4Data = await fetchGA4Analytics();
    const ga4DailyStats = await fetchGA4DailyStats();
    const ga4PageData = await fetchGA4PagePerformance();

    if (ga4Data) {
      console.log('✅ Using real GA4 data for analytics dashboard');
      
      // Use real GA4 data
      const summary: AnalyticsSummary = {
        totalPageViews: ga4Data.totalPageViews,
        uniqueVisitors: ga4Data.uniqueVisitors,
        totalSessions: ga4Data.totalSessions,
        
        userBehavior: ga4Data.userBehavior,
        trafficSources: ga4Data.trafficSources,
        deviceBreakdown: ga4Data.deviceBreakdown,
        topBrowsers: ga4Data.topBrowsers,
        topCountries: ga4Data.topCountries,
        topCities: ga4Data.topCities,
        
        // Use GA4 daily stats or fallback to custom
        dailyStats: ga4DailyStats || [],
        
        // Use GA4 page data or fallback
        topPages: ga4PageData || [],
        
        // Mock hourly pattern - this would need a more complex GA4 query
        hourlyPattern: Array.from({ length: 24 }, (_, hour) => {
          const hourVisitors = Math.floor(Math.random() * 20) + 1;
          let activity: 'low' | 'medium' | 'high' = 'low';
          if (hour >= 9 && hour <= 17) activity = 'high';
          else if (hour >= 6 && hour <= 22) activity = 'medium';
          
          return { hour, visitors: hourVisitors, activity };
        }),
        
        // Minimal lead data (would be tracked separately)
        totalLeads: 0,
        conversionRate: 0,
        topProjectTypes: [],
      };

      return NextResponse.json({ 
        success: true, 
        data: summary,
        source: 'ga4'
      }, { status: 200 });
    }

    // Fallback to custom analytics with demo data
    console.log('⚠️ GA4 not configured, using custom analytics with demo data');
    
    // Core metrics from custom data
    const totalPageViews = analyticsEvents.filter(e => e.type === 'page_view').length;
    const uniqueVisitors = analyticsSessions.length;
    const totalSessions = analyticsSessions.length;
    
    // User behavior calculations
    const avgPagesPerSession = totalSessions > 0 ? totalPageViews / totalSessions : 0;
    const bounceRate = totalSessions > 0 ? 
      (analyticsSessions.filter(s => s.pageViews === 1).length / totalSessions) * 100 : 0;
    
    // Device breakdown analysis
    const deviceCounts: { [key: string]: number } = {};
    const browserCounts: { [key: string]: number } = {};
    const sourceCounts: { [key: string]: number } = {};
    
    analyticsSessions.forEach(session => {
      const { device, browser } = parseUserAgent(session.userAgent);
      const source = getTrafficSource(session.referrer);
      
      deviceCounts[device] = (deviceCounts[device] || 0) + 1;
      browserCounts[browser] = (browserCounts[browser] || 0) + 1;
      sourceCounts[source] = (sourceCounts[source] || 0) + 1;
    });

    // Create device breakdown with fallback demo data
    let deviceBreakdown = Object.entries(deviceCounts).map(([type, count]) => ({
      type: type as 'desktop' | 'mobile' | 'tablet',
      browser: 'Mixed',
      os: 'Mixed',
      count,
      percentage: totalSessions > 0 ? (count / totalSessions) * 100 : 0
    }));

    // Add demo data if no real data exists
    if (deviceBreakdown.length === 0) {
      deviceBreakdown = [
        { type: 'desktop', browser: 'Chrome', os: 'Mixed', count: Math.max(uniqueVisitors * 0.6, 3), percentage: 60 },
        { type: 'mobile', browser: 'Safari', os: 'Mixed', count: Math.max(uniqueVisitors * 0.35, 2), percentage: 35 },
        { type: 'tablet', browser: 'Mixed', os: 'Mixed', count: Math.max(uniqueVisitors * 0.05, 1), percentage: 5 },
      ];
    }

    // Create browser breakdown with fallback
    let topBrowsers = Object.entries(browserCounts)
      .map(([browser, count]) => ({
        browser,
        count,
        percentage: totalSessions > 0 ? (count / totalSessions) * 100 : 0
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    if (topBrowsers.length === 0) {
      topBrowsers = [
        { browser: 'Chrome', count: Math.max(uniqueVisitors * 0.6, 3), percentage: 60 },
        { browser: 'Safari', count: Math.max(uniqueVisitors * 0.25, 2), percentage: 25 },
        { browser: 'Firefox', count: Math.max(uniqueVisitors * 0.1, 1), percentage: 10 },
        { browser: 'Edge', count: Math.max(uniqueVisitors * 0.05, 1), percentage: 5 },
      ];
    }

    // Create traffic sources with fallback
    let trafficSources = Object.entries(sourceCounts)
      .map(([source, visitors]) => ({
        source,
        visitors,
        percentage: totalSessions > 0 ? (visitors / totalSessions) * 100 : 0,
        bounceRate: 45 // Mock data
      }))
      .sort((a, b) => b.visitors - a.visitors);

    if (trafficSources.length === 0) {
      trafficSources = [
        { source: 'direct', visitors: Math.max(uniqueVisitors * 0.4, 2), percentage: 40, bounceRate: 35 },
        { source: 'organic', visitors: Math.max(uniqueVisitors * 0.3, 2), percentage: 30, bounceRate: 25 },
        { source: 'social', visitors: Math.max(uniqueVisitors * 0.2, 1), percentage: 20, bounceRate: 55 },
        { source: 'referral', visitors: Math.max(uniqueVisitors * 0.1, 1), percentage: 10, bounceRate: 40 },
      ];
    }

    // Mock geographic data
    const topCountries = [
      { country: 'United States', visitors: Math.max(uniqueVisitors * 0.4, 2), percentage: 40 },
      { country: 'Canada', visitors: Math.max(uniqueVisitors * 0.2, 1), percentage: 20 },
      { country: 'United Kingdom', visitors: Math.max(uniqueVisitors * 0.15, 1), percentage: 15 },
      { country: 'Australia', visitors: Math.max(uniqueVisitors * 0.1, 1), percentage: 10 },
      { country: 'Germany', visitors: Math.max(uniqueVisitors * 0.08, 1), percentage: 8 },
    ].filter(country => country.visitors > 0);

    // Page performance analysis
    const pageViews: { [key: string]: number } = {};
    analyticsEvents.filter(e => e.type === 'page_view').forEach(event => {
      const page = event.data.page || '/';
      pageViews[page] = (pageViews[page] || 0) + 1;
    });

    let topPages = Object.entries(pageViews)
      .map(([page, views]) => ({
        page,
        views,
        avgTimeOnPage: 120,
        bounceRate: 35,
        exitRate: 25
      }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 5);

    // Add demo pages if no real data
    if (topPages.length === 0) {
      topPages = [
        { page: '/', views: Math.max(totalPageViews * 0.6, 3), avgTimeOnPage: 145, bounceRate: 32, exitRate: 28 },
        { page: '/admin', views: Math.max(totalPageViews * 0.25, 2), avgTimeOnPage: 95, bounceRate: 15, exitRate: 45 },
        { page: '/services', views: Math.max(totalPageViews * 0.1, 1), avgTimeOnPage: 85, bounceRate: 45, exitRate: 35 },
      ];
    }

    // Daily stats for the last 30 days
    const last30Days = Array.from({ length: 30 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toISOString().split('T')[0];
    }).reverse();

    const dailyStats = last30Days.map(date => {
      const dayEvents = analyticsEvents.filter(e => e.timestamp.startsWith(date));
      const daySessions = analyticsSessions.filter(s => s.startTime.startsWith(date));
      
      return {
        date,
        pageViews: dayEvents.filter(e => e.type === 'page_view').length,
        visitors: daySessions.length,
        sessions: daySessions.length,
        avgSessionDuration: 150
      };
    });

    // Hourly pattern (mock data)
    const hourlyPattern = Array.from({ length: 24 }, (_, hour) => {
      const hourVisitors = Math.floor(Math.random() * 20) + 1;
      let activity: 'low' | 'medium' | 'high' = 'low';
      if (hour >= 9 && hour <= 17) activity = 'high';
      else if (hour >= 6 && hour <= 22) activity = 'medium';
      
      return { hour, visitors: hourVisitors, activity };
    });

    // Lead data (minimal)
    const mockLeads = [
      { projectType: 'kitchen', budget: '$50,000-$75,000', timestamp: new Date().toISOString() },
      { projectType: 'bathroom', budget: '$25,000-$50,000', timestamp: new Date().toISOString() },
    ];
    const totalLeads = process.env.NODE_ENV === 'production' ? mockLeads.length : 0;
    const conversionRate = totalSessions > 0 ? (totalLeads / totalSessions) * 100 : 0;

    const summary: AnalyticsSummary = {
      // Core metrics
      totalPageViews: Math.max(totalPageViews, 1),
      uniqueVisitors: Math.max(uniqueVisitors, 1),
      totalSessions: Math.max(totalSessions, 1),
      
      // User behavior insights
      userBehavior: {
        avgSessionDuration: 145,
        avgPagesPerSession: Math.max(avgPagesPerSession, 1.2),
        newVisitorsPercentage: 75,
        returningVisitorsPercentage: 25,
        bounceRate: Math.max(bounceRate, 35)
      },
      
      // Traffic analysis
      trafficSources,
      topPages,
      
      // Demographics & technology
      deviceBreakdown,
      topBrowsers,
      
      // Geographic insights
      topCountries,
      topCities: [],
      
      // Time-based analytics
      dailyStats,
      hourlyPattern,
      
      // Minimal lead data
      totalLeads,
      conversionRate: Math.round(conversionRate * 100) / 100,
      topProjectTypes: mockLeads.reduce((acc: Array<{ type: string; count: number }>, lead) => {
        const existing = acc.find(item => item.type === lead.projectType);
        if (existing) {
          existing.count++;
        } else {
          acc.push({ type: lead.projectType, count: 1 });
        }
        return acc;
      }, [])
    };

    return NextResponse.json({ 
      success: true, 
      data: summary,
      source: 'custom'
    }, { status: 200 });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}

// POST endpoint - record analytics event
// OPTIMIZATION: Now only receives critical events (lead submissions)
// Page views and other events are handled by GA4 for better performance
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { type, data } = body;

    // Create analytics event
    const event: AnalyticsEvent = {
      id: Date.now().toString(),
      type,
      timestamp: new Date().toISOString(),
      sessionId: `session_${Date.now()}`, // Add required sessionId
      data,
    };

    // Store event
    analyticsEvents.push(event);

    // For page views, also track session data
    if (type === 'page_view') {
      const userAgent = request.headers.get('user-agent') || '';
      const referrer = request.headers.get('referer') || '';
      const ipAddress = request.headers.get('x-forwarded-for') || 
                       request.headers.get('x-real-ip') || 
                       'unknown';

      // Simple session tracking (in production, use proper session management)
      const sessionId = `session_${Date.now()}`;
      analyticsSessions.push({
        id: sessionId,
        startTime: new Date().toISOString(),
        pageViews: 1,
        userAgent,
        referrer,
        ipAddress,
      });
    }

    return NextResponse.json({ success: true, eventId: event.id }, { status: 200 });
  } catch (error) {
    console.error('Error recording analytics event:', error);
    return NextResponse.json(
      { error: 'Failed to record event' },
      { status: 500 }
    );
  }
} 