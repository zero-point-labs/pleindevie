# Admin Components

This directory contains the admin panel components for the renovation landing page.

## Components

### AdminLogin
- Handles access code authentication
- Code: "Renovation123"
- Displays error messages for invalid codes

### AdminDashboard
- Main admin interface
- Contains leads table and analytics sections
- Includes logout functionality

### LeadsTable
- Displays leads from contact form submissions
- Empty state ready for future integration
- Table columns: Name, Email, Phone, Project Type, Date, Status

### Analytics
- Shows key metrics and analytics cards using GA4 data
- Optimized to fetch data only on page load and manual refresh
- No longer polls repeatedly - significantly reduced server load
- Custom analytics fallback only for critical events (lead submissions)

## Access

Navigate to `/admin` to access the admin panel.

## Recent Optimizations (2024)

- **Removed automatic polling** - Analytics data now fetches only once on load
- **GA4 Integration** - Primary analytics now handled by Google Analytics 4
- **Reduced API calls** - Custom analytics API only used for essential lead tracking
- **Performance improvements** - Memoized components and callbacks to prevent unnecessary re-renders 