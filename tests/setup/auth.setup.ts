import { test, expect } from '@playwright/test';
import { users } from '../../data/testData';
import path from 'path';

const authFile = path.join(__dirname, '../../.auth.json');

test('authenticate', async ({ page }) => {
  // Navigate to login page
  await page.goto('https://www.saucedemo.com');

  // Fill credentials
  await page.locator('[data-test="username"]').fill(users.standard.username);
  await page.locator('[data-test="password"]').fill(users.standard.password);
  await page.locator('[data-test="login-button"]').click();

  // Wait for login to complete
  await expect(page).toHaveURL(/.*inventory\.html/);

  // End of authentication steps.
  await page.context().storageState({ path: authFile });
});
