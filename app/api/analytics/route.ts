import { NextRequest, NextResponse } from 'next/server';
import { AnalyticsEvent, AnalyticsSession, AnalyticsSummary } from '@/types';

// In-memory storage for analytics (resets on each deployment)
// In production, you'd want to use a database like Vercel KV, PostgreSQL, etc.
let analyticsEvents: AnalyticsEvent[] = [];
let analyticsSessions: AnalyticsSession[] = [];

// Utility functions
function getClientIP(request: NextRequest): string {
  return request.headers.get('x-forwarded-for') || 
         request.headers.get('x-real-ip') || 
         'unknown';
}

function isThisMonth(dateString: string): boolean {
  const date = new Date(dateString);
  const now = new Date();
  return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
}

// GET endpoint - retrieve analytics summary
export async function GET() {
  try {
    // Create mock data for production demo
    const mockLeads = [
      { projectType: 'kitchen', budget: '$50,000-$75,000', timestamp: new Date().toISOString() },
      { projectType: 'bathroom', budget: '$25,000-$50,000', timestamp: new Date().toISOString() },
      { projectType: 'living-room', budget: '$15,000-$25,000', timestamp: new Date().toISOString() }
    ];

    // Calculate metrics
    const totalPageViews = analyticsEvents.filter(e => e.type === 'page_view').length;
    const uniqueVisitors = analyticsSessions.length;
    const totalLeads = process.env.NODE_ENV === 'production' ? mockLeads.length : 0;
    const conversionRate = totalPageViews > 0 ? (totalLeads / Math.max(uniqueVisitors, 1)) * 100 : 0;

    // This month metrics
    const thisMonthEvents = analyticsEvents.filter(e => isThisMonth(e.timestamp));
    const thisMonthLeads = mockLeads.filter(l => isThisMonth(l.timestamp));
    const thisMonthSessions = analyticsSessions.filter(s => isThisMonth(s.startTime));

    // Top project types from leads
    const projectTypeCounts = mockLeads.reduce((acc: Record<string, number>, lead) => {
      acc[lead.projectType] = (acc[lead.projectType] || 0) + 1;
      return acc;
    }, {});
    const topProjectTypes = Object.entries(projectTypeCounts)
      .map(([type, count]) => ({ type, count: count as number }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Top budgets from leads
    const budgetCounts = mockLeads.reduce((acc: Record<string, number>, lead) => {
      acc[lead.budget] = (acc[lead.budget] || 0) + 1;
      return acc;
    }, {});
    const topBudgets = Object.entries(budgetCounts)
      .map(([budget, count]) => ({ budget, count: count as number }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Daily stats for the last 30 days
    const last30Days = Array.from({ length: 30 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toISOString().split('T')[0];
    }).reverse();

    const dailyStats = last30Days.map(date => {
      const dayEvents = analyticsEvents.filter(e => e.timestamp.startsWith(date));
      const dayLeads = mockLeads.filter(l => l.timestamp.startsWith(date));
      const daySessions = analyticsSessions.filter(s => s.startTime.startsWith(date));
      
      return {
        date,
        pageViews: dayEvents.filter(e => e.type === 'page_view').length,
        leads: dayLeads.length,
        visitors: daySessions.length
      };
    });

    const summary: AnalyticsSummary = {
      totalPageViews: Math.max(totalPageViews, 1), // Ensure at least 1 for demo
      uniqueVisitors: Math.max(uniqueVisitors, 1),
      totalLeads,
      conversionRate: Math.round(conversionRate * 100) / 100,
      thisMonth: {
        pageViews: Math.max(thisMonthEvents.filter(e => e.type === 'page_view').length, 1),
        leads: thisMonthLeads.length,
        visitors: Math.max(thisMonthSessions.length, 1)
      },
      topProjectTypes,
      topBudgets,
      dailyStats
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