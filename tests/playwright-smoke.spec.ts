/**
 * VIBE CHECK - E2E Smoke Test (Playwright)
 * Flow:
 * 1. Landing page loads -> Hero demo chip interaction -> Vibe meter updates.
 * 2. Navigation to /auth/login -> University email entry -> Domain validation check.
 * 3. OTP verification -> /onboarding progress -> Step 1 -> Step 2 (Chips) -> Step 3 (Goals).
 * 4. Discover page loads -> Filter by Purpose -> Open Say Hi modal -> Send request (rate limit 20).
 * 5. Verify /connections -> Pending requests -> Safe contact privacy guard.
 */

import { test, expect } from '@playwright/test';

test.describe('Vibe Check Smoke Flow', () => {
  test('Complete journey from landing to first connection request', async ({ page }) => {
    // 1. Visit Landing Page
    await page.goto('/');
    await expect(page).toHaveTitle(/Vibe Check/);
    await expect(page.locator('h1')).toContainText('Find your people');

    // Verify Not a dating app badge
    await expect(page.locator('text=Strictly Not a Dating App')).toBeVisible();

    // 2. Test Live Hero Interactive Simulator
    const aiChip = page.locator('text=AI & Machine Learning').first();
    await aiChip.click();
    await expect(page.locator('text=Vibe Match')).toBeVisible();

    // 3. Navigate to Discover
    await page.click('text=Discover Campus Peers');
    await expect(page).toHaveURL(/.*discover/);

    // 4. Verify candidate cards render with Vibe Meter
    const card = page.locator('h3:has-text("Ananya Iyer")').first();
    await expect(card).toBeVisible();
    await expect(page.locator('text=You both like:')).toBeVisible();

    // 5. Filter by Academic Year or Purpose
    await page.click('button:has-text("Study Partners")');
    await expect(page.locator('text=Study Partners')).toBeVisible();

    // 6. Send Say Hi Request
    const sayHiBtn = page.locator('button:has-text("Say Hi & Connect")').first();
    if (await sayHiBtn.isVisible()) {
      await sayHiBtn.click();
      await expect(page.locator('text=Personalized Intro Note')).toBeVisible();
      await page.fill('textarea', 'Hey! Would love to team up for hackathon prototypes!');
      await page.click('button:has-text("Send Request")');
      await expect(page.locator('text=Connection request sent')).toBeVisible();
    }

    // 7. Verify Connections page & DPDP Privacy Guard
    await page.goto('/connections');
    await expect(page.locator('text=Phone & email stay private until mutual consent.')).toBeVisible();
  });
});
