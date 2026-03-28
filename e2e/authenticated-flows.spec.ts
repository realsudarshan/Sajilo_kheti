import { test } from "@playwright/test";

/**
 * Full auth, land browse, proposal, and GetStream chat E2E require:
 * - Clerk testing helpers or staging credentials (see https://clerk.com/docs/testing)
 * - Seeded land + two users (owner + leaser)
 * - BACKEND_URL + Stream keys for payment/chat paths
 *
 * Un-skip and implement when a dedicated E2E environment is available.
 */
test.describe("E2E / system (staging-only)", () => {
  test.skip(true, "Configure Clerk testing + seed data to enable");

  test("sign-up, login, role-based redirect (Playwright)", async () => {});

  test("tenant: browse lands, filters, land detail", async () => {});

  test("proposal: submit → owner dashboard lists application", async () => {});

  test("lease + GetStream: escrow mock unlocks chat", async () => {});
});
