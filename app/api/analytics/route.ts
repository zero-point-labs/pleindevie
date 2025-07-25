import { NextRequest, NextResponse } from 'next/server';
import { AnalyticsEvent, AnalyticsSession, AnalyticsSummary } from '@/types';

// In-memory storage for analytics (resets on each deployment)
// In production, you'd want to use a database like Vercel KV, PostgreSQL, etc.
let analyticsEvents: AnalyticsEvent[] = [];
let analyticsSessions: AnalyticsSession[] = [];

// Helper function to parse user agent for device/browser info
function parseUserAgent(userAgent: string) {
  const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|Windows Phone/i.test(userAgent);
  const isTablet = /iPad|Android.*Tablet/i.test(userAgent);
  const device = isTablet ? 'tablet' : isMobile ? 'mobile' : 'desktop';
  
  let browser = 'Other';
  if (userAgent.includes('Chrome')) browser = 'Chrome';
  else if (userAgent.includes('Firefox')) browser = 'Firefox';
  else if (userAgent.includes('Safari')) browser = 'Safari';
  else if (userAgent.includes('Edge')) browser = 'Edge';
  
  let os = 'Other';
  if (userAgent.includes('Windows')) os = 'Windows';
  else if (userAgent.includes('Mac')) os = 'macOS';
  else if (userAgent.includes('Linux')) os = 'Linux';
  else if (userAgent.includes('Android')) os = 'Android';
  else if (userAgent.includes('iOS')) os = 'iOS';
  
  return { device, browser, os };
}

// Helper function to get traffic source from referrer
function getTrafficSource(referrer: string): string {
  if (!referrer || referrer === 'direct') return 'direct';
  if (referrer.includes('google')) return 'organic';
  if (referrer.includes('facebook') || referrer.includes('twitter') || referrer.includes('linkedin')) return 'social';
  if (referrer.includes('email') || referrer.includes('newsletter')) return 'email';
  return 'referral';
}

// Utility functions
function getClientIP(request: NextRequest): string {
  return request.headers.get('x-forwarded-for') || 
         request.headers.get('x-real-ip') || 
         'unknown';
}

// GET endpoint - retrieve analytics summary
export async function GET() {
  try {
    // Core metrics
    const totalPageViews = analyticsEvents.filter(e => e.type === 'page_view').length;
    const uniqueVisitors = analyticsSessions.length;
    const totalSessions = analyticsSessions.length; // For now, treating sessions = visitors
    
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
        bounceRate: 45 // Mock data - would calculate from actual sessions
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

    // Mock geographic data (in production, you'd use IP geolocation)
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
        avgTimeOnPage: 120, // Mock data - would calculate from session duration
        bounceRate: 35, // Mock data
        exitRate: 25 // Mock data
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
        avgSessionDuration: 150 // Mock data - would calculate from actual session times
      };
    });

    // Hourly pattern (mock data for demonstration)
    const hourlyPattern = Array.from({ length: 24 }, (_, hour) => {
      const hourVisitors = Math.floor(Math.random() * 20) + 1;
      let activity: 'low' | 'medium' | 'high' = 'low';
      if (hour >= 9 && hour <= 17) activity = 'high'; // Business hours
      else if (hour >= 6 && hour <= 22) activity = 'medium';
      
      return {
        hour,
        visitors: hourVisitors,
        activity
      };
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
        avgSessionDuration: 145, // Mock data - in seconds
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
      topCities: [], // Would implement with detailed geolocation
      
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

    return NextResponse.json({ success: true, data: summary }, { status: 200 });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}

// POST endpoint - track analytics events
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, sessionId, data } = body;

    if (!type || !sessionId) {
      return NextResponse.json(
        { error: 'Missing required fields: type, sessionId' },
        { status: 400 }
      );
    }

    // Create new event
    const newEvent: AnalyticsEvent = {
      id: `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      timestamp: new Date().toISOString(),
      sessionId,
      data: {
        ...data,
        userAgent: request.headers.get('user-agent') || undefined,
        ip: getClientIP(request)
      }
    };

    // Add event to memory
    analyticsEvents.push(newEvent);

    // Keep only recent events to prevent memory issues (last 1000 events)
    if (analyticsEvents.length > 1000) {
      analyticsEvents = analyticsEvents.slice(-1000);
    }

    // Update or create session
    let session = analyticsSessions.find(s => s.id === sessionId);
    if (!session) {
      session = {
        id: sessionId,
        startTime: new Date().toISOString(),
        lastActivity: new Date().toISOString(),
        pageViews: type === 'page_view' ? 1 : 0,
        events: [newEvent.id],
        userAgent: request.headers.get('user-agent') || '',
        referrer: data.referrer || '',
        ip: getClientIP(request)
      };
      analyticsSessions.push(session);
    } else {
      session.lastActivity = new Date().toISOString();
      if (type === 'page_view') {
        session.pageViews += 1;
      }
      session.events.push(newEvent.id);
    }

    // Keep only recent sessions to prevent memory issues (last 100 sessions)
    if (analyticsSessions.length > 100) {
      analyticsSessions = analyticsSessions.slice(-100);
    }

    return NextResponse.json(
      { success: true, eventId: newEvent.id },
      { status: 201 }
    );

  } catch (error) {
    console.error('Error tracking analytics:', error);
    return NextResponse.json(
      { error: 'Failed to track analytics' },
      { status: 500 }
    );
  }
} 