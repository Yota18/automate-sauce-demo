import { test, expect } from '../../fixtures/fixtures';
import { users } from '../../data/testData';
import { step, attachment } from 'allure-js-commons';

test.describe('logout - positive scenarios', () => {
  test.beforeEach(async ({ page, loginPage }) => {
    await loginPage.login(users.standard.username, users.standard.password);
    await expect(page).toHaveURL(/.*inventory\.html/);
  });

  test('should successfully logout when user clicks logout button', async ({
    page,
    loginPage,
    inventoryPage,
  }) => {
    await step('Verify user is on inventory page', async () => {
      await inventoryPage.isInventoryPageLoaded();
    });

    await step('Perform logout', async () => {
      await inventoryPage.logout();
    });

    await step('Validation: Verify successful logout and redirection', async () => {
      await expect(page).toHaveURL(/.*saucedemo\.com\/?$/);
      expect(await loginPage.isOnLoginPage()).toBe(true);
      expect(await loginPage.isLoginButtonVisible()).toBe(true);

      const screenshot = await page.screenshot();
      await attachment('Success Logout Evidence', screenshot, 'image/png');
    });
  });
});

test.describe('logout - negative scenarios', () => {
  test.beforeEach(async ({ page, loginPage }) => {
    await loginPage.login(users.standard.username, users.standard.password);
    await expect(page).toHaveURL(/.*inventory\.html/);
  });

  test.afterEach(async ({ context }) => {
    await context.setOffline(false);
  });

  test('should handle logout attempt when network is offline (Graceful Failure)', async ({
    page,
    context,
    inventoryPage,
  }) => {
    await step('Verify user is on inventory page', async () => {
      await inventoryPage.isInventoryPageLoaded();
    });

    await step('Set network to offline mode', async () => {
      await context.setOffline(true);
    });

    try {
      await step('Attempt to open sidebar menu', async () => {
        await inventoryPage.openSidebarMenu();
      });

      await step('Verify sidebar is visible', async () => {
        await inventoryPage.isSidebarVisible();
      });

      await step('Attempt to click logout button', async () => {
        await inventoryPage.clickLogout();
      });

      await step(
        'Validation: Verify system handles offline scenario - No crash or unexpected state',
        async () => {
          // Logout attempt logic handled by previous steps, now verify the result
          // In SauceDemo, logout is handled client-side (clearing storage),
          // so it might still redirect to login even offline.
          // We verify that we are either still here or safely at the login page.
          const currentUrl = page.url();
          const isGraceful =
            currentUrl.includes('inventory.html') ||
            currentUrl === 'https://www.saucedemo.com/' ||
            currentUrl.endsWith('saucedemo.com/');

          expect(isGraceful).toBe(true);

          const screenshot = await page.screenshot();
          await attachment('Offline Logout Attempt Evidence', screenshot, 'image/png');
        }
      );
    } finally {
      await step('Restore network to online mode', async () => {
        await context.setOffline(false);
      });
    }
  });
});
