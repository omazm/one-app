import { createAuthClient } from "better-auth/react"
import { organizationClient } from "better-auth/client/plugins"

// Use the current origin in browser, or env variable for SSR, or localhost for development
const getBaseURL = () => {
  if (typeof window !== 'undefined') {
    return window.location.origin
  }
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL
  }
  if (process.env.NEXT_PUBLIC_VERCEL_URL) {
    return `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
  }
  return "http://localhost:3000"
}

export const authClient = createAuthClient({
  baseURL: getBaseURL(),
  plugins: [organizationClient()],
})

export const { signIn, signUp, signOut, useSession } = authClient

// Google OAuth sign in
export const signInWithGoogle = async () => {
  await authClient.signIn.social({
    provider: "google",
    callbackURL: "/",
  })
}
