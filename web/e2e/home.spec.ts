import { test, expect } from '@playwright/test';

/**
 * E2E Tests for Home Page
 * 
 * Tests critical user flows on the home page including:
 * - Page loading
 * - Track playback
 * - Player controls
 * - Navigation
 */

test.describe('Home Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should load the home page', async ({ page }) => {
    await expect(page).toHaveTitle(/EmPulse/i);
    await expect(page.locator('main')).toBeVisible();
  });

  test('should display content sections', async ({ page }) => {
    // Wait for sections to load
    await page.waitForSelector('[data-testid="content-section"]', { timeout: 10000 });
    
    // Check that at least one section is visible
    const sections = page.locator('[data-testid="content-section"]');
    await expect(sections.first()).toBeVisible();
  });

  test('should play a track when clicked', async ({ page }) => {
    // Wait for tracks to load
    await page.waitForSelector('[data-testid="content-card"]', { timeout: 10000 });
    
    // Click on first track card
    const firstTrack = page.locator('[data-testid="content-card"]').first();
    await firstTrack.click();
    
    // Check that player controls are visible
    await expect(page.locator('#player-controls')).toBeVisible();
    
    // Check that play button is visible (indicating track is loaded)
    await expect(page.locator('button[aria-label*="Play"], button[aria-label*="Pause"]')).toBeVisible();
  });

  test('should toggle play/pause', async ({ page }) => {
    // Wait for tracks and click first one
    await page.waitForSelector('[data-testid="content-card"]', { timeout: 10000 });
    await page.locator('[data-testid="content-card"]').first().click();
    
    // Wait for player to be ready
    await page.waitForTimeout(1000);
    
    // Click play button
    const playButton = page.locator('button[aria-label*="Play"]').first();
    if (await playButton.isVisible()) {
      await playButton.click();
      
      // Should show pause button
      await expect(page.locator('button[aria-label*="Pause"]').first()).toBeVisible({ timeout: 2000 });
    }
  });

  test('should navigate to playlist page', async ({ page }) => {
    // Wait for content to load
    await page.waitForSelector('[data-testid="content-card"]', { timeout: 10000 });
    
    // Find a playlist card (if any)
    const playlistCards = page.locator('[data-testid="content-card"]').filter({
      hasText: /playlist/i
    });
    
    if (await playlistCards.count() > 0) {
      await playlistCards.first().click();
      await expect(page).toHaveURL(/\/playlist\//);
    }
  });

  test('should have accessible player controls', async ({ page }) => {
    // Wait for player controls
    await page.waitForSelector('#player-controls', { timeout: 10000 });
    
    // Check ARIA labels
    await expect(page.locator('button[aria-label*="Play"], button[aria-label*="Pause"]')).toBeVisible();
    await expect(page.locator('button[aria-label*="Next"]')).toBeVisible();
    await expect(page.locator('button[aria-label*="Previous"]')).toBeVisible();
  });

  test('should support keyboard navigation', async ({ page }) => {
    // Focus on first interactive element
    await page.keyboard.press('Tab');
    
    // Should be able to navigate with keyboard
    const focusedElement = page.locator(':focus');
    await expect(focusedElement).toBeVisible();
  });
});
