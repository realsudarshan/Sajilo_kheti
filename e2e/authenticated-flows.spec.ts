import { test, expect } from "./fixtures";

test.describe("E2E / system (staging-only)", () => {
  test("sign-up, login, role-based redirect (Playwright)", async ({ page }) => {
    // Navigate to the sign up page
    await page.goto("/sign-up");

    // Wait for the custom sign-up form to load
    const emailInput = page.locator('input[name="email"]');
    await expect(emailInput).toBeVisible({ timeout: 15000 });

    // Fill the registration form using Clerk's special testing email format
    const email = `sajilo+clerk_test_${Date.now()}@example.com`;
    await page.locator('input[name="firstName"]').fill("End");
    await page.locator('input[name="lastName"]').fill("User");
    await emailInput.fill(email);

    // Fill in a test password matching the validation criteria
    const pw = "TestingPassword123#";
    await page.locator('input[name="password"]').fill(pw);
    await page.locator('input[name="confirmPassword"]').fill(pw);

    // Accept terms checkbox
    await page.locator('input[name="terms"]').check();

    // Wait a brief moment to ensure Clerk's useSignUp hook is fully loaded `isLoaded = true` 
    // Otherwise, the very fast bot will click Continue and the submit handler ignores it!
    await page.waitForTimeout(1500);

    // Submit registration
    await page.getByRole("button", { name: "Continue", exact: true }).click();

    // Wait for Verification Code input OR server error
    const otpInput = page.locator('input[name="code"]');
    try {
      await otpInput.waitFor({ state: "visible", timeout: 5000 });
    } catch (e) {
      // Check for form or server errors, filtering out those red asterisks (*)
      const errors = await page.locator('.text-red-500, .text-red-600, .bg-red-50').allTextContents();
      const actualErrors = errors.filter(text => text.trim() && text.trim() !== "*");
      if (actualErrors.length > 0) {
        throw new Error("Form validation or server errors found: " + actualErrors.join(", "));
      }
      throw e; // rethrow to fail the test automatically
    }
    
    // According to Clerk testing docs, test OTPs are 424242
    await otpInput.fill("424242");
    await page.getByRole("button", { name: /Verify & Create Account/i }).click();

    // After sign-up, the app should redirect to dashboard
    await expect(page).toHaveURL(/.*\/dashboard/);
    await expect(page.getByRole("heading", { name: /Welcome back/i })).toBeVisible({ timeout: 15000 });
  });

  test.skip("tenant: browse lands, filters, land detail", async () => {});

  test.skip("proposal: submit → owner dashboard lists application", async () => {});

  test.skip("lease + GetStream: escrow mock unlocks chat", async () => {});
});
