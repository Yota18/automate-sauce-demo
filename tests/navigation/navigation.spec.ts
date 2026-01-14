import { test, expect } from '../../fixtures/fixtures';
import { step } from 'allure-js-commons';

test.describe('navigation - negative scenarios', () => {
  test('should handle invalid page (404) by verifying empty body or custom behavior', async ({
    page,
  }) => {
    await step('Navigate to a non-existent page', async () => {
      await page.goto('/invalid-page-12345');
    });

    await step('Validation: Verify page content for 404 (known SauceDemo behavior)', async () => {
      // Based on research, SauceDemo returns an empty root div and a noscript message for 404s
      const bodyContent = await page.textContent('body');
      expect(bodyContent?.trim()).toBe('You need to enable JavaScript to run this app.');

      // Verify the app root is indeed empty
      const rootContent = await page.innerHTML('#root');
      expect(rootContent).toBe('');

      // Verify the page title still shows "Swag Labs"
      await expect(page).toHaveTitle('Swag Labs');
    });
  });
});
