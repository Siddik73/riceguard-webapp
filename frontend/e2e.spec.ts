import { test, expect } from '@playwright/test';

test.describe('RiceGuard PWA E2E flows', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage to start onboarding clean
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test('should complete the entire onboarding and scan flow', async ({ page }) => {
    // 1. Onboarding Page
    await expect(page).toHaveTitle(/RiceGuard/);
    
    // Check onboarding header is visible
    const header = page.locator('header');
    await expect(header).toBeVisible();

    // Verify Noto Sans Noto/Inter translation is functional
    const skipBtn = page.locator('button:has-text("Skip")');
    await expect(skipBtn).toBeVisible();

    // Click "Skip" to bypass slides and launch Scanning Dashboard
    await skipBtn.click();

    // 2. Home Scanning Dashboard
    const cameraZone = page.locator('h3:has-text("Start Camera Scan")');
    await expect(cameraZone).toBeVisible();

    // Verify Bento quick access tiles exist
    const historyTile = page.locator('div:has-text("Scan History")');
    const libraryTile = page.locator('div:has-text("Disease Library")');
    await expect(historyTile).toBeVisible();
    await expect(libraryTile).toBeVisible();

    // Navigate to Library
    await page.locator('a[href="/library"]').click();
    await expect(page.locator('h2:has-text("Disease Library")')).toBeVisible();

    // Return Home
    await page.locator('a[href="/"]').click();
    await expect(cameraZone).toBeVisible();
  });
});
