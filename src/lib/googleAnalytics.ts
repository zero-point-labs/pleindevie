import { BetaAnalyticsDataClient } from '@google-analytics/data';
import { DateRange, AnalyticsSummary, RenovationMetrics, PerformanceMetrics } from '@/types';
import { format, subDays } from 'date-fns';

// Google Analytics Data API client
let analyticsDataClient: BetaAnalyticsDataClient | null = null;

const GA4_PROPERTY_ID = process.env.GA4_PROPERTY_ID;
const GA4_CREDENTIALS = process.env.GA4_SERVICE_ACCOUNT_KEY;

// Cache for API responses to improve performance
const cache = new Map<string, { data: unknown; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

function getCachedData(key: string) {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }
  cache.delete(key);
  return null;
}

function setCachedData(key: string, data: unknown) {
  cache.set(key, { data, timestamp: Date.now() });
}

// Initialize the Analytics Data API client
function getAnalyticsClient() {
  if (analyticsDataClient) {
    return analyticsDataClient;
  }

  if (!GA4_CREDENTIALS) {
    console.warn('GA4_SERVICE_ACCOUNT_KEY not found. Using demo data instead.');
    return null;
  }

  try {
    const credentials = JSON.parse(GA4_CREDENTIALS);
    analyticsDataClient = new BetaAnalyticsDataClient({
      credentials,
    });
    return analyticsDataClient;
  } catch (error) {
    console.error('Failed to initialize GA4 client:', error);
    return null;
  }
}

// Enhanced GA4 analytics with date range support and renovation business metrics
export async function fetchGA4Analytics(dateRange?: DateRange): Promise<Partial<AnalyticsSummary> | null> {
  const client = getAnalyticsClient();
  
  if (!client || !GA4_PROPERTY_ID) {
    console.warn('GA4 not configured. Returning null for real data.');
    return null;
  }

  // Default to last 30 days if no date range provided
  const startDate = dateRange?.startDate || format(subDays(new Date(), 29), 'yyyy-MM-dd');
  const endDate = dateRange?.endDate || format(new Date(), 'yyyy-MM-dd');
  
  const cacheKey = `ga4_analytics_${startDate}_${endDate}`;
  const cachedData = getCachedData(cacheKey);
  if (cachedData) {
    console.log('🚀 Using cached GA4 analytics data');
    return cachedData;
  }

  try {
    console.log(`📊 Fetching GA4 analytics for date range: ${startDate} to ${endDate}`);
    
    const [
      coreMetricsResponse, 
      deviceResponse, 
      geoResponse, 
      trafficResponse,
      servicePageResponse,
      eventResponse
    ] = await Promise.all([
      // Core metrics: users, sessions, page views, bounce rate
      client.runReport({
        property: `properties/${GA4_PROPERTY_ID}`,
        dateRanges: [{ startDate, endDate }],
        metrics: [
          { name: 'activeUsers' },
          { name: 'sessions' },
          { name: 'screenPageViews' },
          { name: 'bounceRate' },
          { name: 'averageSessionDuration' },
          { name: 'screenPageViewsPerSession' },
          { name: 'newUsers' },
        ],
      }),

      // Device and browser data
      client.runReport({
        property: `properties/${GA4_PROPERTY_ID}`,
        dateRanges: [{ startDate, endDate }],
        dimensions: [{ name: 'deviceCategory' }, { name: 'browser' }],
        metrics: [{ name: 'activeUsers' }],
      }),

      // Geographic data
      client.runReport({
        property: `properties/${GA4_PROPERTY_ID}`,
        dateRanges: [{ startDate, endDate }],
        dimensions: [{ name: 'country' }, { name: 'city' }],
        metrics: [{ name: 'activeUsers' }],
        limit: 20,
      }),

      // Traffic sources
      client.runReport({
        property: `properties/${GA4_PROPERTY_ID}`,
        dateRanges: [{ startDate, endDate }],
        dimensions: [{ name: 'sessionSource' }, { name: 'sessionMedium' }],
        metrics: [{ name: 'activeUsers' }, { name: 'bounceRate' }],
        limit: 15,
      }),

      // Service pages (renovation specific)
      client.runReport({
        property: `properties/${GA4_PROPERTY_ID}`,
        dateRanges: [{ startDate, endDate }],
        dimensions: [{ name: 'pagePath' }],
        metrics: [
          { name: 'screenPageViews' },
          { name: 'averageSessionDuration' },
          { name: 'bounceRate' },
        ],
        dimensionFilter: {
          filter: {
            fieldName: 'pagePath',
            stringFilter: {
              matchType: 'CONTAINS',
              value: 'service',
            },
          },
        },
        limit: 10,
      }),

      // Events (lead tracking)
      client.runReport({
        property: `properties/${GA4_PROPERTY_ID}`,
        dateRanges: [{ startDate, endDate }],
        dimensions: [{ name: 'eventName' }],
        metrics: [{ name: 'eventCount' }],
        dimensionFilter: {
          filter: {
            fieldName: 'eventName',
            stringFilter: {
              matchType: 'CONTAINS',
              value: 'lead',
            },
          },
        },
      }),
    ]);

    // Parse core metrics
    const coreMetrics = coreMetricsResponse[0].rows?.[0]?.metricValues || [];
    const activeUsers = parseInt(coreMetrics[0]?.value || '0');
    const sessions = parseInt(coreMetrics[1]?.value || '0');
    const pageViews = parseInt(coreMetrics[2]?.value || '0');
    const bounceRate = parseFloat(coreMetrics[3]?.value || '0');
    const avgSessionDuration = parseFloat(coreMetrics[4]?.value || '0');
    const pagesPerSession = parseFloat(coreMetrics[5]?.value || '0');
    const newUsers = parseInt(coreMetrics[6]?.value || '0');

    // Parse device data
    const deviceBreakdown = deviceResponse[0].rows?.map(row => {
      const deviceCategory = row.dimensionValues?.[0]?.value || 'unknown';
      const browser = row.dimensionValues?.[1]?.value || 'unknown';
      const users = parseInt(row.metricValues?.[0]?.value || '0');
      
      return {
        type: deviceCategory.toLowerCase() as 'desktop' | 'mobile' | 'tablet',
        browser,
        os: 'Mixed',
        count: users,
        percentage: activeUsers > 0 ? (users / activeUsers) * 100 : 0,
      };
    }) || [];

    // Parse geographic data
    const topCountries = geoResponse[0].rows?.slice(0, 5).map(row => {
      const country = row.dimensionValues?.[0]?.value || 'Unknown';
      const users = parseInt(row.metricValues?.[0]?.value || '0');
      
      return {
        country,
        visitors: users,
        percentage: activeUsers > 0 ? (users / activeUsers) * 100 : 0,
      };
    }) || [];

    const topCities = geoResponse[0].rows?.slice(0, 10).map(row => {
      const country = row.dimensionValues?.[0]?.value || 'Unknown';
      const city = row.dimensionValues?.[1]?.value || 'Unknown';
      const users = parseInt(row.metricValues?.[0]?.value || '0');
      
      return {
        country,
        city,
        visitors: users,
        percentage: activeUsers > 0 ? (users / activeUsers) * 100 : 0,
      };
    }) || [];

    // Parse traffic sources
    const trafficSources = trafficResponse[0].rows?.map(row => {
      const source = row.dimensionValues?.[0]?.value || 'unknown';
      const medium = row.dimensionValues?.[1]?.value || 'unknown';
      const users = parseInt(row.metricValues?.[0]?.value || '0');
      const sourceBounceRate = parseFloat(row.metricValues?.[1]?.value || '0');
      
      // Categorize traffic source
      let trafficType = 'referral';
      if (source === '(direct)') trafficType = 'direct';
      else if (medium === 'organic') trafficType = 'organic';
      else if (medium.includes('social')) trafficType = 'social';
      else if (medium.includes('cpc') || medium.includes('paid')) trafficType = 'paid';
      
      return {
        source: trafficType,
        visitors: users,
        percentage: activeUsers > 0 ? (users / activeUsers) * 100 : 0,
        bounceRate: sourceBounceRate,
      };
    }) || [];

    // Parse service page performance (renovation specific)
    const servicePageViews = servicePageResponse[0].rows?.map(row => {
      const pagePath = row.dimensionValues?.[0]?.value || '';
      const views = parseInt(row.metricValues?.[0]?.value || '0');
      const avgTime = parseFloat(row.metricValues?.[1]?.value || '0');
      const bounce = parseFloat(row.metricValues?.[2]?.value || '0');
      
      // Extract service type from path
      let service = 'Other';
      if (pagePath.includes('kitchen')) service = 'Kitchen';
      else if (pagePath.includes('bathroom')) service = 'Bathroom';
      else if (pagePath.includes('basement')) service = 'Basement';
      else if (pagePath.includes('roofing')) service = 'Roofing';
      else if (pagePath.includes('flooring')) service = 'Flooring';
      
      return {
        service,
        views,
        avgTimeOnPage: Math.round(avgTime),
        conversionRate: Math.max(0, 100 - bounce), // Simple conversion estimate
      };
    }) || [];

    // Parse events for lead tracking
    let totalLeads = 0;
    eventResponse[0].rows?.forEach(row => {
      const eventName = row.dimensionValues?.[0]?.value || '';
      const eventCount = parseInt(row.metricValues?.[0]?.value || '0');
      
      if (eventName.includes('lead') || eventName.includes('contact') || eventName.includes('form')) {
        totalLeads += eventCount;
      }
    });

    // Group browsers
    const browserCounts: { [key: string]: number } = {};
    deviceResponse[0].rows?.forEach(row => {
      const browser = row.dimensionValues?.[1]?.value || 'unknown';
      const users = parseInt(row.metricValues?.[0]?.value || '0');
      browserCounts[browser] = (browserCounts[browser] || 0) + users;
    });

    const topBrowsers = Object.entries(browserCounts)
      .map(([browser, count]) => ({
        browser,
        count,
        percentage: activeUsers > 0 ? (count / activeUsers) * 100 : 0,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Calculate conversion rate
    const conversionRate = sessions > 0 ? (totalLeads / sessions) * 100 : 0;

    // Calculate user behavior insights
    const newVisitorsPercentage = activeUsers > 0 ? (newUsers / activeUsers) * 100 : 75;
    const returningVisitorsPercentage = 100 - newVisitorsPercentage;

    // Build renovation metrics
    const renovationMetrics: RenovationMetrics = {
      totalProjects: Math.floor(totalLeads * 0.3),
      avgProjectValue: 45000,
      completionRate: 90,
      customerSatisfaction: 4.5,
      servicePageViews,
      projectInquiries: [
        { projectType: 'Kitchen', count: Math.floor(totalLeads * 0.3), averageBudget: '$50,000-$75,000', averageTimeline: '6-8 weeks' },
        { projectType: 'Bathroom', count: Math.floor(totalLeads * 0.25), averageBudget: '$25,000-$40,000', averageTimeline: '4-6 weeks' },
        { projectType: 'Basement', count: Math.floor(totalLeads * 0.2), averageBudget: '$30,000-$50,000', averageTimeline: '8-10 weeks' },
        { projectType: 'Other', count: Math.floor(totalLeads * 0.25), averageBudget: '$15,000-$30,000', averageTimeline: '3-5 weeks' },
      ],
      leadSources: trafficSources.map(source => ({
        source: source.source,
        leads: Math.floor((source.visitors / activeUsers) * totalLeads),
        quality: source.bounceRate < 40 ? 8 : source.bounceRate < 60 ? 6 : 4,
      })),
      conversionFunnel: {
        pageViews,
        formViews: Math.floor(pageViews * 0.15), // Estimated
        formSubmissions: totalLeads,
        qualifiedLeads: Math.floor(totalLeads * 0.7), // Estimated
        conversionRate: pageViews > 0 ? (totalLeads / pageViews) * 100 : 0,
      },
      seasonalTrends: [], // Would need historical data
      phoneClickThroughs: Math.floor(totalLeads * 0.3), // Estimated
      quotesRequested: totalLeads,
      formAbandonmentRate: 45, // Estimated
    };

    const result: Partial<AnalyticsSummary> = {
      totalPageViews: pageViews,
      uniqueVisitors: activeUsers,
      totalSessions: sessions,
      
      userBehavior: {
        avgSessionDuration: Math.round(avgSessionDuration),
        avgPagesPerSession: Math.round(pagesPerSession * 100) / 100,
        newVisitorsPercentage: Math.round(newVisitorsPercentage * 100) / 100,
        returningVisitorsPercentage: Math.round(returningVisitorsPercentage * 100) / 100,
        bounceRate: Math.round(bounceRate * 100) / 100,
      },
      
      trafficSources,
      deviceBreakdown,
      topBrowsers,
      topCountries,
      topCities,
      
      totalLeads,
      conversionRate: Math.round(conversionRate * 100) / 100,
      
      renovationMetrics,
      
      kpis: {
        leadQualityScore: trafficSources.reduce((acc, source) => acc + (100 - source.bounceRate), 0) / trafficSources.length || 70,
        returnVisitorRate: Math.round(returningVisitorsPercentage * 100) / 100,
      },
    };

    setCachedData(cacheKey, result);
    return result;
  } catch (error) {
    console.error('Error fetching GA4 data:', error);
    return null;
  }
}

// Fetch daily analytics for charts with date range support
export async function fetchGA4DailyStats(dateRange?: DateRange) {
  const client = getAnalyticsClient();
  
  if (!client || !GA4_PROPERTY_ID) {
    return null;
  }

  const startDate = dateRange?.startDate || format(subDays(new Date(), 29), 'yyyy-MM-dd');
  const endDate = dateRange?.endDate || format(new Date(), 'yyyy-MM-dd');
  
  const cacheKey = `ga4_daily_${startDate}_${endDate}`;
  const cachedData = getCachedData(cacheKey);
  if (cachedData) {
    return cachedData;
  }

  try {
    const response = await client.runReport({
      property: `properties/${GA4_PROPERTY_ID}`,
      dateRanges: [{ startDate, endDate }],
      dimensions: [{ name: 'date' }],
      metrics: [
        { name: 'activeUsers' },
        { name: 'sessions' },
        { name: 'screenPageViews' },
        { name: 'averageSessionDuration' },
      ],
      orderBys: [{ dimension: { dimensionName: 'date' } }],
    });

    const result = response[0].rows?.map(row => {
      const date = row.dimensionValues?.[0]?.value || '';
      const visitors = parseInt(row.metricValues?.[0]?.value || '0');
      const sessions = parseInt(row.metricValues?.[1]?.value || '0');
      const pageViews = parseInt(row.metricValues?.[2]?.value || '0');
      const avgSessionDuration = parseFloat(row.metricValues?.[3]?.value || '0');

      // Format date to YYYY-MM-DD
      const formattedDate = date.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3');

      return {
        date: formattedDate,
        visitors,
        sessions,
        pageViews,
        avgSessionDuration: Math.round(avgSessionDuration),
        leads: 0, // Add default leads value
      };
    }) || [];

    setCachedData(cacheKey, result);
    return result;
  } catch (error) {
    console.error('Error fetching GA4 daily stats:', error);
    return null;
  }
}

// Fetch page performance data with date range support
export async function fetchGA4PagePerformance(dateRange?: DateRange) {
  const client = getAnalyticsClient();
  
  if (!client || !GA4_PROPERTY_ID) {
    return null;
  }

  const startDate = dateRange?.startDate || format(subDays(new Date(), 29), 'yyyy-MM-dd');
  const endDate = dateRange?.endDate || format(new Date(), 'yyyy-MM-dd');
  
  const cacheKey = `ga4_pages_${startDate}_${endDate}`;
  const cachedData = getCachedData(cacheKey);
  if (cachedData) {
    return cachedData;
  }

  try {
    const response = await client.runReport({
      property: `properties/${GA4_PROPERTY_ID}`,
      dateRanges: [{ startDate, endDate }],
      dimensions: [{ name: 'pagePath' }],
      metrics: [
        { name: 'screenPageViews' },
        { name: 'averageSessionDuration' },
        { name: 'bounceRate' },
      ],
      orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }],
      limit: 10,
    });

    const result = response[0].rows?.map(row => {
      const page = row.dimensionValues?.[0]?.value || '/';
      const views = parseInt(row.metricValues?.[0]?.value || '0');
      const avgTimeOnPage = parseFloat(row.metricValues?.[1]?.value || '0');
      const bounceRate = parseFloat(row.metricValues?.[2]?.value || '0');

      return {
        page,
        views,
        avgTimeOnPage: Math.round(avgTimeOnPage),
        bounceRate: Math.round(bounceRate * 100) / 100,
        exitRate: Math.round(bounceRate * 0.8 * 100) / 100, // Estimated
      };
    }) || [];

    setCachedData(cacheKey, result);
    return result;
  } catch (error) {
    console.error('Error fetching GA4 page performance:', error);
    return null;
  }
} 