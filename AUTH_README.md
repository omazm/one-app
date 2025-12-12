# Authentication Setup

This application uses **better-auth** with Prisma for authentication, following Next.js 16 conventions.

## Features

- ✅ Email & Password authentication
- ✅ Google OAuth authentication
- ✅ Session management with 7-day expiry
- ✅ Server-side route protection (Next.js 16 pattern)
- ✅ User profile management
- ✅ Secure password hashing
- ✅ PostgreSQL database storage

## Setup

1. **Environment Variables**

Create a `.env` file based on `.env.example`:

```env
DATABASE_URL="your-postgresql-connection-string"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
BETTER_AUTH_SECRET="" # Will be auto-generated
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

2. **Google OAuth Setup**

To enable Google authentication:

a. Go to [Google Cloud Console](https://console.cloud.google.com/)
b. Create a new project or select an existing one
c. Enable the Google+ API
d. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client ID"
e. Configure the OAuth consent screen
f. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (development)
   - `https://yourdomain.com/api/auth/callback/google` (production)
g. Copy the Client ID and Client Secret to your `.env` file

3. **Database Setup**

The authentication tables have already been created. They include:
- `users` - User accounts
- `sessions` - Active user sessions
- `accounts` - OAuth provider accounts (Google, etc.)
- `verifications` - Email verification tokens

4. **Start Development**

```bash
npm run dev
```

## Usage

### Sign In

Navigate to `/login` to sign in with:
- Email and password
- Google OAuth (click "Sign in with Google")

### Sign Up

Navigate to `/signup` to create an account with:
- Email and password (requires name, email, and password)
- Google OAuth (click "Sign up with Google")

### Protected Routes (Next.js 16 Pattern)

Instead of middleware, this application uses server-side protection with the `requireAuth()` helper. Each protected page calls this function:

```tsx
import { requireAuth } from '@/lib/auth-helpers'

export default async function MyPage() {
  await requireAuth() // Redirects to /login if not authenticated
  
  // Your page content
}
```

This approach:
- ✅ Follows Next.js 16 conventions
- ✅ Works seamlessly with Server Components
- ✅ Provides better performance
- ✅ Easier to debug and maintain
- ✅ No middleware configuration needed

### User Navigation

The `UserNav` component in the header shows:
- User avatar with initials
- User name and email in dropdown
- Sign out button

### Using Authentication in Components

```tsx
'use client'

import { useSession } from '@/lib/auth-client'

export function MyComponent() {
  const { data: session, isPending } = useSession()
  
  if (isPending) return <div>Loading...</div>
  if (!session) return <div>Not authenticated</div>
  
  return <div>Welcome, {session.user.name}!</div>
}
```

### Server-Side Authentication

Get the current session (nullable):

```tsx
import { getSession } from '@/lib/auth-helpers'

export async function MyServerComponent() {
  const session = await getSession()
  
  if (!session) {
    return <div>Not authenticated</div>
  }
  
  return <div>Welcome, {session.user.name}!</div>
}
```

Require authentication (redirects if not authenticated):

```tsx
import { requireAuth } from '@/lib/auth-helpers'

export async function MyProtectedPage() {
  const session = await requireAuth() // Auto-redirects to /login
  
  return <div>Welcome, {session.user.name}!</div>
}
```

## API Routes

Authentication is handled through `/api/auth/[...all]` which includes:
- `/api/auth/sign-in/email` - Email sign in
- `/api/auth/sign-up/email` - Email sign up
- `/api/auth/sign-out` - Sign out
- `/api/auth/session` - Get current session

## Security Features

- Passwords are hashed using bcrypt
- Sessions are stored in the database
- CSRF protection enabled
- Session tokens are httpOnly cookies
- Automatic session refresh

## Future Enhancements

ThAdditional OAuth providers (GitHub, Microsoft
- OAuth providers (Google, GitHub, etc.)
- Email verification
- Password reset
- Two-factor authentication
- Role-based access control
