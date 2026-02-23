import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/landowner-dashboard(.*)',
  '/admin(.*)',
]);

// Add a matcher for Auth routes
const isAuthRoute = createRouteMatcher([
  '/login(.*)',
  '/sign-up(.*)',
]);

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();

  // 1. If user is logged in and tries to access login/sign-up, redirect them
  if (userId && isAuthRoute(req)) {
    // Note: Since middleware doesn't know the DB role, 
    // we send them to a generic loading/gate page or a default dashboard.
    // Your RoleGate component will then handle the specific role-based redirection.
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  // 2. Protect private routes
  if (isProtectedRoute(req)) {
    if (!userId) {
      const loginUrl = new URL('/login', req.url);
      return NextResponse.redirect(loginUrl);
    }
  }
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};