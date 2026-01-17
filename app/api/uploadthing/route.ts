import { createRouteHandler } from "uploadthing/next";

import { manyImageRouter, singleImageRouter } from "./core";

// Create a combined router that includes both endpoints
const combinedRouter = {
  ...manyImageRouter,
  ...singleImageRouter,
};

// Export routes for Next App Router
export const { GET, POST } = createRouteHandler({
  router: combinedRouter as any,
});
