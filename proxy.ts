import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

// Define which routes need authentication
const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/landowner-dashboard(.*)',
  '/admin(.*)',
]);

export default clerkMiddleware(async (auth, req) => {
  // If the user hits a protected route, Clerk will redirect them to sign-in
  if (isProtectedRoute(req)) await auth.protect();
});

export const config = {
  matcher: [
    // Standard Clerk matcher to catch all relevant requests
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};