import { test, expect } from "@playwright/test";

test.describe("Public pages", () => {
  test("home loads", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("body")).toBeVisible();
  });

  test("login page shows welcome and email field", async ({ page }) => {
    await page.goto("/login");
    await expect(
      page.getByRole("heading", { name: /Welcome back/i })
    ).toBeVisible();
    await expect(page.getByPlaceholder("hari@example.com")).toBeVisible();
  });

  test("terms page loads (static, no CMS)", async ({ page }) => {
    await page.goto("/terms");
    await expect(
      page.getByRole("heading", { name: /Terms & Conditions/i })
    ).toBeVisible();
  });
});
