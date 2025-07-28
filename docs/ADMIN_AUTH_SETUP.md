# 🔐 Admin Authentication Setup with Appwrite

## Overview

The admin panel now uses **Appwrite authentication** instead of hardcoded passwords for enhanced security. Only users created in the Appwrite dashboard can access the admin panel.

## ⚠️ Breaking Changes

- **Old**: Simple password authentication with "Renovation123"
- **New**: Appwrite email/password authentication
- **Migration**: No automatic migration - you need to create admin users manually

## Setup Steps

### 1. Enable Authentication in Appwrite

1. Go to your **Appwrite Console**
2. Navigate to **Auth** section
3. Ensure authentication is enabled for your project

### 2. Create Admin User

1. In Appwrite Console, go to **Auth → Users**
2. Click **"Add User"**
3. Fill in the details:
   ```
   Email: your-admin@email.com
   Password: your-secure-password
   Name: Admin User (optional)
   ```
4. Click **"Create"**

### 3. Test Admin Access

1. Open your app and go to `/admin`
2. You should see the new login form with email/password fields
3. Use the credentials you created in Appwrite
4. You should be logged in and see the admin dashboard

## Features

### ✅ What Works Now

- **Secure Authentication**: Email/password login through Appwrite
- **Session Management**: Automatic session handling with proper logout
- **User Display**: Shows logged-in user's name/email in header
- **Protected Routes**: Only authenticated users can access admin features
- **Automatic Redirects**: Seamless login/logout flow

### 🔒 Security Improvements

- **No Hardcoded Passwords**: Eliminates security risk of hardcoded credentials
- **Proper Session Management**: Uses Appwrite's secure session handling
- **User Management**: Centralized user management through Appwrite dashboard
- **Access Control**: Only authorized users can be created by you

## Usage

### For Developers

```typescript
// The AuthContext provides these utilities:
const { user, loading, login, logout, isAuthenticated } = useAuth();

// Login (handled by AdminLogin component)
await login('admin@example.com', 'password');

// Logout (handled by AdminDashboard component)
await logout();

// Check if user is authenticated
if (isAuthenticated) {
  // User is logged in
}
```

### For Admin Users

1. **Login**: Go to `/admin` and use your Appwrite credentials
2. **Logout**: Click the logout button in the admin header
3. **Session Persistence**: Your session will persist until logout or expiration

## Creating Additional Admin Users

Only you (the project owner) can create admin users:

1. **Appwrite Console** → **Auth** → **Users**
2. **Add User** → Fill in email/password
3. **No Self-Registration**: There's no signup page for security

## Troubleshooting

### Common Issues

**"Invalid email or password"**
- ✅ Check that the user exists in Appwrite Console → Auth → Users
- ✅ Verify the email and password are correct
- ✅ Ensure Auth is enabled in your Appwrite project

**"Authentication error"**
- ✅ Check your Appwrite configuration in `.env.local`
- ✅ Verify `NEXT_PUBLIC_APPWRITE_ENDPOINT` and `NEXT_PUBLIC_APPWRITE_PROJECT_ID`
- ✅ Test the connection to Appwrite

**"Loading forever"**
- ✅ Check browser console for errors
- ✅ Verify Appwrite client configuration
- ✅ Check network connectivity to Appwrite

**"Cannot access admin after login"**
- ✅ Check that the AuthProvider is properly set up
- ✅ Verify the authentication context is working
- ✅ Look for JavaScript errors in console

### Debug Steps

1. **Check Environment Variables**:
   ```bash
   # Make sure these are set in .env.local
   NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
   NEXT_PUBLIC_APPWRITE_PROJECT_ID=your_project_id
   ```

2. **Test Appwrite Connection**:
   ```bash
   npm run validate:setup
   ```

3. **Check Browser Console**:
   - Open Developer Tools → Console
   - Look for authentication errors
   - Check for network errors

## Migration from Old System

If you were using the old hardcoded password system:

1. **Remove old code**: The hardcoded password logic has been replaced
2. **Create admin user**: Use Appwrite Console to create your admin account  
3. **Update bookmarks**: The `/admin` URL remains the same
4. **New credentials**: Use your Appwrite email/password instead of "Renovation123"

## Security Best Practices

- ✅ **Use strong passwords** for admin accounts
- ✅ **Don't share credentials** - create separate accounts for different admins
- ✅ **Regular audits** - review admin users in Appwrite Console
- ✅ **Monitor access** - check Appwrite logs for unusual activity
- ✅ **Keep Appwrite updated** - use the latest Appwrite features

---

**Need help?** Check the main [ENV_SETUP.md](./ENV_SETUP.md) for Appwrite configuration details. 