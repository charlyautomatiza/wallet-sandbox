import { Page } from '@playwright/test';
import * as path from 'path';
import { promises as fs } from 'fs';

// Default output directory from Playwright config
const DEFAULT_OUTPUT_DIR = 'test-results';

/**
 * Wait for navigation and network idle
 * @param page The Playwright page object
 */
export async function waitForPageLoad(page: Page): Promise<void> {
  await page.waitForLoadState('networkidle');
}

/**
 * Generate a random email for testing
 * @returns A random email address
 */
export function generateTestEmail(): string {
  const timestamp = new Date().getTime();
  return `test-user-${timestamp}@example.com`;
}

/**
 * Format currency value for assertions
 * @param amount The amount to format
 * @returns Formatted amount string
 */
export function formatCurrency(amount: number): string {
  return `$${amount.toFixed(2)}`;
}

/**
 * Capture screenshot with timestamp
 * @param page The Playwright page object
 * @param name Base name for the screenshot
 */
export async function captureScreenshot(page: Page, name: string): Promise<void> {
  const timestamp = new Date().toISOString().replace(/:/g, '-').replace(/\./g, '-');
  const outputDir = process.env.PLAYWRIGHT_OUTPUT_DIR || DEFAULT_OUTPUT_DIR;
  const screenshotDir = path.join(outputDir, 'screenshots');
  
  // Ensure screenshot directory exists
  try {
    await fs.access(screenshotDir);
  } catch {
    await fs.mkdir(screenshotDir, { recursive: true });
  }
  
  await page.screenshot({ 
    path: path.join(screenshotDir, `${name}-${timestamp}.png`) 
  });
}
