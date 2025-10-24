# Authentication System Implementation Guide

This guide will walk you through implementing the complete authentication system with user login, admin console, and invite-only mode toggle.

---

## Table of Contents

1. [Overview](#overview)
2. [What's Included](#whats-included)
3. [Prerequisites](#prerequisites)
4. [Step-by-Step Implementation](#step-by-step-implementation)
5. [Database Setup](#database-setup)
6. [Configuration](#configuration)
7. [Testing](#testing)
8. [Security Considerations](#security-considerations)
9. [Troubleshooting](#troubleshooting)

---

## Overview

This authentication system provides:

✅ **User Registration & Login** with email/password  
✅ **Invite-Only Mode** with admin toggle switch  
✅ **Admin Console** for user management  
✅ **Invite Code System** for controlled access  
✅ **Invite Request System** for users to request access  
✅ **Protected Routes** requiring authentication  
✅ **Role-Based Access Control** (user vs admin)  

---

## What's Included

### Frontend Pages
- `app/auth/login/page.tsx` - Login page
- `app/auth/signup/page.tsx` - Signup page with invite code support
- `app/auth/request-invite/page.tsx` - Invite request form
- `app/admin/dashboard/page.tsx` - Admin console with user management

### API Routes
- `app/api/auth/login/route.ts` - Login endpoint
- `app/api/auth/signup/route.ts` - Signup endpoint
- `app/api/auth/settings/route.ts` - Get system settings
- `app/api/auth/request-invite/route.ts` - Submit invite request
- **Admin API routes** (see ADMIN_API_ROUTES.md)

### Libraries & Middleware
- `lib/auth-helpers.ts` - Authentication helper functions
- `middleware/auth.ts` - Route protection middleware

### Database
- `DATABASE_SCHEMA.sql` - Complete database schema

---

## Prerequisites

Before implementing, ensure you have:

1. ✅ Next.js 14+ project (App Router)
2. ✅ Database (MySQL, PostgreSQL, or SQLite)
3. ✅ Node.js 18+ installed
4. ✅ Basic understanding of Next.js and React

---

## Step-by-Step Implementation

### Step 1: Upload Frontend Pages

Upload these files to your GitHub repository:

**1.1 Login Page**
- Location: `app/auth/login/page.tsx`
- File: Provided in the package

**1.2 Signup Page**
- Location: `app/auth/signup/page.tsx`
- File: Provided in the package

**1.3 Request Invite Page**
- Location: `app/auth/request-invite/page.tsx`
- File: Provided in the package

**1.4 Admin Dashboard**
- Location: `app/admin/dashboard/page.tsx`
- File: Provided in the package

### Step 2: Upload Libraries & Middleware

**2.1 Auth Helpers**
- Location: `lib/auth-helpers.ts`
- File: Provided in the package
- **Important:** Update the import path in API routes if needed

**2.2 Middleware**
- Location: `middleware.ts` (root of project, NOT in a folder)
- File: Copy content from `middleware/auth.ts`
- **Note:** Next.js requires middleware to be at the root level

### Step 3: Upload API Routes

**3.1 Auth API Routes**
Create these files:
- `app/api/auth/login/route.ts`
- `app/api/auth/signup/route.ts`
- `app/api/auth/settings/route.ts`
- `app/api/auth/request-invite/route.ts`

**3.2 Admin API Routes**
Create these files (see ADMIN_API_ROUTES.md for code):
- `app/api/admin/users/route.ts`
- `app/api/admin/invite-requests/route.ts`
- `app/api/admin/invite-codes/route.ts`
- `app/api/admin/settings/route.ts`
- `app/api/admin/stats/route.ts`
- `app/api/admin/invite-requests/approve/route.ts`
- `app/api/admin/invite-requests/reject/route.ts`

### Step 4: Set Up Database

**4.1 Create Database**
```bash
# MySQL
mysql -u root -p
CREATE DATABASE etsy_pod_automation;
USE etsy_pod_automation;
```

**4.2 Run Schema**
```bash
mysql -u root -p etsy_pod_automation < DATABASE_SCHEMA.sql
```

**4.3 Verify Tables**
```sql
SHOW TABLES;
-- Should show: users, invite_codes, invite_requests, system_settings, sessions
```

### Step 5: Configure Environment Variables

Create/update `.env.local`:

```env
# Database
DATABASE_URL="mysql://user:password@localhost:3306/etsy_pod_automation"

# JWT Secret (generate a random string)
JWT_SECRET="your-super-secret-jwt-key-change-this"

# Admin Email (for first-time setup)
ADMIN_EMAIL="admin@etsypodbuilder.com"
ADMIN_PASSWORD="Admin123!"

# App URL
NEXT_PUBLIC_APP_URL="https://etsypodbuilder.nextwaveaisuite.com"

# Email (for sending invite codes - optional)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"
```

### Step 6: Install Dependencies

```bash
npm install bcrypt jsonwebtoken
npm install --save-dev @types/bcrypt @types/jsonwebtoken
```

### Step 7: Update Auth Helpers for Production

**Replace demo code with real database queries:**

Edit `lib/auth-helpers.ts`:

```typescript
// Add at the top
import mysql from 'mysql2/promise';

// Add database connection
export async function getDatabase() {
  return await mysql.createConnection(process.env.DATABASE_URL!);
}

// Update hashPassword to use bcrypt
import bcrypt from 'bcrypt';

export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return await bcrypt.compare(password, hashedPassword);
}

// Update generateToken to use jsonwebtoken
import jwt from 'jsonwebtoken';

export function generateToken(user: User): string {
  return jwt.sign(
    { userId: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET!,
    { expiresIn: '7d' }
  );
}

export function verifyToken(token: string): { userId: string; email: string; role: string } | null {
  try {
    return jwt.verify(token, process.env.JWT_SECRET!) as any;
  } catch (error) {
    return null;
  }
}
```

### Step 8: Update API Routes for Production

**Replace demo data with database queries in each API route.**

Example for `app/api/auth/login/route.ts`:

```typescript
// Replace demo users with database query
const db = await getDatabase();
const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
const user = rows[0];

if (!user) {
  return NextResponse.json(
    { success: false, error: 'Invalid email or password' },
    { status: 401 }
  );
}

// Rest of the code...
await db.end();
```

**Repeat this process for all API routes.**

### Step 9: Protect Existing Routes

**Update your main layout to check authentication:**

Edit `app/layout.tsx`:

```typescript
import { getCurrentUser } from '@/lib/auth-helpers';
import { redirect } from 'next/navigation';

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  
  // If not logged in, redirect to login (except for auth pages)
  // This is handled by middleware, but you can add additional checks here
  
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
```

### Step 10: Update Navigation

**Add login/logout to your navigation:**

Edit `app/components/NavigationNew.tsx`:

```typescript
// Add at the top
import { getCurrentUser } from '@/lib/auth-helpers';

// Inside component
const user = await getCurrentUser();

// Add to navigation
{user ? (
  <>
    <span>Welcome, {user.name}</span>
    <form action="/api/auth/logout" method="POST">
      <button type="submit">Logout</button>
    </form>
  </>
) : (
  <Link href="/auth/login">Login</Link>
)}
```

### Step 11: Create Logout Route

Create `app/api/auth/logout/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const response = NextResponse.redirect(new URL('/auth/login', request.url));
  response.cookies.delete('auth_token');
  return response;
}
```

### Step 12: Test the System

**12.1 Test Login**
1. Go to `/auth/login`
2. Login with:
   - Email: `admin@etsypodbuilder.com`
   - Password: `Admin123!`
3. Should redirect to admin dashboard

**12.2 Test Signup (Invite-Only)**
1. Go to `/auth/signup`
2. Should see "invite code required" message
3. Try signing up without code - should fail
4. Try with code `BETA-2025-ABCD` - should succeed

**12.3 Test Admin Console**
1. Login as admin
2. Go to `/admin/dashboard`
3. Toggle invite-only mode
4. Generate invite codes
5. View users

**12.4 Test Invite Requests**
1. Go to `/auth/request-invite`
2. Submit a request
3. Login as admin
4. Approve/reject request in admin console

---

## Database Setup

### Option 1: MySQL (Recommended)

```bash
# Install MySQL
sudo apt-get install mysql-server

# Create database
mysql -u root -p
CREATE DATABASE etsy_pod_automation;
USE etsy_pod_automation;
source DATABASE_SCHEMA.sql;
```

### Option 2: PostgreSQL

```bash
# Install PostgreSQL
sudo apt-get install postgresql

# Create database
sudo -u postgres psql
CREATE DATABASE etsy_pod_automation;
\c etsy_pod_automation
\i DATABASE_SCHEMA.sql
```

### Option 3: SQLite (Development Only)

```bash
npm install better-sqlite3
```

**Note:** You'll need to convert the SQL schema for SQLite.

---

## Configuration

### Invite-Only Mode

**Enable/Disable via Admin Console:**
1. Login as admin
2. Go to Admin Dashboard
3. Toggle the "Invite-Only Mode" switch

**Enable/Disable via Database:**
```sql
UPDATE system_settings 
SET setting_value = 'true' 
WHERE setting_key = 'invite_only';
```

### Generate Invite Codes

**Via Admin Console:**
1. Go to Admin Dashboard → Codes tab
2. Click "Generate New Code"

**Via Database:**
```sql
INSERT INTO invite_codes (code, created_by) 
VALUES ('YOUR-CODE-HERE', 'admin-001');
```

### Change Admin Password

```sql
-- Generate hash for new password (use bcrypt online tool or Node.js)
UPDATE users 
SET password_hash = 'new-bcrypt-hash-here' 
WHERE email = 'admin@etsypodbuilder.com';
```

---

## Testing

### Manual Testing Checklist

- [ ] User can access login page
- [ ] User can login with valid credentials
- [ ] User cannot login with invalid credentials
- [ ] User can access signup page
- [ ] User cannot signup without invite code (if enabled)
- [ ] User can signup with valid invite code
- [ ] Invite code is marked as used after signup
- [ ] User can request invite access
- [ ] Admin can view invite requests
- [ ] Admin can approve invite requests
- [ ] Admin can reject invite requests
- [ ] Admin can toggle invite-only mode
- [ ] Admin can generate invite codes
- [ ] Admin can view all users
- [ ] Protected routes redirect to login
- [ ] Admin routes are only accessible to admins
- [ ] Logout works correctly

### Automated Testing (Optional)

```bash
npm install --save-dev jest @testing-library/react
```

Create tests in `__tests__/auth.test.ts`:

```typescript
describe('Authentication', () => {
  it('should login with valid credentials', async () => {
    // Test code
  });
  
  it('should reject invalid credentials', async () => {
    // Test code
  });
});
```

---

## Security Considerations

### Production Checklist

- [ ] **Use bcrypt** for password hashing (NOT SHA-256)
- [ ] **Use JWT** with proper secret key
- [ ] **Enable HTTPS** in production
- [ ] **Set httpOnly cookies** for tokens
- [ ] **Implement rate limiting** on login/signup
- [ ] **Add CSRF protection**
- [ ] **Sanitize user inputs**
- [ ] **Use prepared statements** for database queries
- [ ] **Log authentication events**
- [ ] **Implement password reset** functionality
- [ ] **Add email verification** (optional)
- [ ] **Set strong password requirements**
- [ ] **Implement account lockout** after failed attempts
- [ ] **Use environment variables** for secrets
- [ ] **Never commit .env files** to Git

### Password Requirements

Enforce these in signup:
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character

### Rate Limiting

Add to login/signup routes:

```typescript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5 // 5 requests per window
});
```

---

## Troubleshooting

### Issue: "Module not found" errors

**Solution:**
- Check import paths in all files
- Ensure `@/` alias is configured in `tsconfig.json`:

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

### Issue: Middleware not working

**Solution:**
- Ensure `middleware.ts` is at the root (not in a folder)
- Check `config.matcher` pattern
- Verify cookies are being set correctly

### Issue: Database connection fails

**Solution:**
- Check `DATABASE_URL` in `.env.local`
- Verify database is running
- Check credentials are correct
- Ensure database exists

### Issue: "Unauthorized" on protected routes

**Solution:**
- Check if token is being set in cookies
- Verify token is not expired
- Check middleware is running
- Inspect browser cookies (DevTools → Application → Cookies)

### Issue: Admin console not accessible

**Solution:**
- Verify user role is 'admin' in database
- Check admin route protection in middleware
- Ensure admin user exists in database

### Issue: Invite codes not working

**Solution:**
- Check `invite_codes` table has codes
- Verify `is_used` is FALSE
- Check code format matches (e.g., "XXXX-XXXX-XXXX")
- Ensure invite-only mode is enabled

---

## Next Steps

After implementing authentication:

1. **Customize the UI** to match your brand
2. **Add email notifications** for invite codes
3. **Implement password reset** functionality
4. **Add email verification** (optional)
5. **Set up monitoring** for failed login attempts
6. **Create user profile page**
7. **Add OAuth providers** (Google, GitHub, etc.)
8. **Implement 2FA** for enhanced security

---

## Support

If you encounter issues:

1. Check this guide thoroughly
2. Review error messages in console
3. Check database logs
4. Verify all files are uploaded correctly
5. Ensure environment variables are set

---

## Summary

You now have a complete authentication system with:

✅ User registration and login  
✅ Invite-only mode with admin control  
✅ Admin console for user management  
✅ Protected routes  
✅ Role-based access control  

**Default Admin Login:**
- Email: `admin@etsypodbuilder.com`
- Password: `Admin123!`

**⚠️ IMPORTANT: Change the admin password immediately after first login!**

---

**Good luck with your implementation! 🚀**

