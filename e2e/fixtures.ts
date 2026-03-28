import { test as baseTest, expect } from '@playwright/test';
import { setupClerkTestingToken } from '@clerk/testing/playwright';

export const test = baseTest.extend({
  page: async ({ page, context }, use) => {
    // Inject testing token into the context/page before each test runs
    await setupClerkTestingToken({ page, context });
    await use(page);
  }
});

export { expect };
