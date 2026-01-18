import { createRouteHandler } from "uploadthing/next";

import { CitizenshipbackpicRouter, CitizenshipfrontpicRouter, manyImageRouter, singleImageRouter } from "./core";

// Create a combined router that includes both endpoints
const combinedRouter = {
  ...manyImageRouter,
  ...singleImageRouter,
  ...CitizenshipfrontpicRouter,
  ...CitizenshipbackpicRouter
};

// Export routes for Next App Router
export const { GET, POST } = createRouteHandler({
  router: combinedRouter as any,
});
