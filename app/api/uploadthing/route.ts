import { createRouteHandler } from "uploadthing/next";
import { ourFileRouter } from "./core";

// Export routes for Next App Router
// The router now contains imageUploader, photoUploader, citizenship, and selfie
export const { GET, POST } = createRouteHandler({
  router: ourFileRouter,
});