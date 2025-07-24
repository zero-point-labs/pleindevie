import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { AnalyticsEvent, AnalyticsSession, AnalyticsSummary } from '@/types';

// Paths to analytics data files
const ANALYTICS_DIR = path.join(process.cwd(), 'data', 'analytics');
const EVENTS_FILE = path.join(ANALYTICS_DIR, 'events.json');
const SESSIONS_FILE = path.join(ANALYTICS_DIR, 'sessions.json');
const LEADS_FILE = path.join(process.cwd(), 'data', 'leads.json');

// Ensure analytics directory and files exist
async function ensureAnalyticsFiles() {
  try {
    await fs.mkdir(ANALYTICS_DIR, { recursive: true });
    
    // Check and create events file
    try {
      await fs.access(EVENTS_FILE);
    } catch {
      await fs.writeFile(EVENTS_FILE, JSON.stringify([], null, 2));
    }
    
    // Check and create sessions file
    try {
      await fs.access(SESSIONS_FILE);
    } catch {
      await fs.writeFile(SESSIONS_FILE, JSON.stringify([], null, 2));
    }
  } catch (error) {
    console.error('Error ensuring analytics files:', error);
  }
}

// Read analytics data
async function readEvents(): Promise<AnalyticsEvent[]> {
  try {
    await ensureAnalyticsFiles();
    const data = await fs.readFile(EVENTS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading events:', error);
    return [];
  }
}

async function readSessions(): Promise<AnalyticsSession[]> {
  try {
    await ensureAnalyticsFiles();
    const data = await fs.readFile(SESSIONS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading sessions:', error);
    return [];
  }
}

async function readLeads() {
  try {
    const data = await fs.readFile(LEADS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading leads:', error);
    return [];
  }
}

// Write analytics data
async function writeEvents(events: AnalyticsEvent[]): Promise<void> {
  try {
    await ensureAnalyticsFiles();
    await fs.writeFile(EVENTS_FILE, JSON.stringify(events, null, 2));
  } catch (error) {
    console.error('Error writing events:', error);
    throw error;
  }
}

async function writeSessions(sessions: AnalyticsSession[]): Promise<void> {
  try {
    await ensureAnalyticsFiles();
    await fs.writeFile(SESSIONS_FILE, JSON.stringify(sessions, null, 2));
  } catch (error) {
    console.error('Error writing sessions:', error);
    throw error;
  }
}

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
    const [events, sessions, leads] = await Promise.all([
      readEvents(),
      readSessions(),
      readLeads()
    ]);

    // Calculate metrics
    const totalPageViews = events.filter(e => e.type === 'page_view').length;
    const uniqueVisitors = sessions.length;
    const totalLeads = leads.length;
    const conversionRate = totalPageViews > 0 ? (totalLeads / uniqueVisitors) * 100 : 0;

    // This month metrics
    const thisMonthEvents = events.filter(e => isThisMonth(e.timestamp));
    const thisMonthLeads = leads.filter((l: { timestamp: string }) => isThisMonth(l.timestamp));
    const thisMonthSessions = sessions.filter(s => isThisMonth(s.startTime));

    // Top project types from leads
    const projectTypeCounts = leads.reduce((acc: Record<string, number>, lead: { projectType: string }) => {
      acc[lead.projectType] = (acc[lead.projectType] || 0) + 1;
      return acc;
    }, {});
    const topProjectTypes = Object.entries(projectTypeCounts)
      .map(([type, count]) => ({ type, count: count as number }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Top budgets from leads
    const budgetCounts = leads.reduce((acc: Record<string, number>, lead: { budget: string }) => {
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
      const dayEvents = events.filter(e => e.timestamp.startsWith(date));
      const dayLeads = leads.filter((l: { timestamp: string }) => l.timestamp.startsWith(date));
      const daySessions = sessions.filter(s => s.startTime.startsWith(date));
      
      return {
        date,
        pageViews: dayEvents.filter(e => e.type === 'page_view').length,
        leads: dayLeads.length,
        visitors: daySessions.length
      };
    });

    const summary: AnalyticsSummary = {
      totalPageViews,
      uniqueVisitors,
      totalLeads,
      conversionRate: Math.round(conversionRate * 100) / 100,
      thisMonth: {
        pageViews: thisMonthEvents.filter(e => e.type === 'page_view').length,
        leads: thisMonthLeads.length,
        visitors: thisMonthSessions.length
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

    const [events, sessions] = await Promise.all([
      readEvents(),
      readSessions()
    ]);

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

    // Add event
    events.push(newEvent);

    // Update or create session
    let session = sessions.find(s => s.id === sessionId);
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
      sessions.push(session);
    } else {
      session.lastActivity = new Date().toISOString();
      if (type === 'page_view') {
        session.pageViews += 1;
      }
      session.events.push(newEvent.id);
    }

    // Save data
    await Promise.all([
      writeEvents(events),
      writeSessions(sessions)
    ]);

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