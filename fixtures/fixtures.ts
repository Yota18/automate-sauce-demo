import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/loginPage';
import { InventoryPage, InventoryDetailsPage } from '../pages/inventoryPages';
import {
  CartPage,
  CheckoutInfoPage,
  CheckoutOverviewPage,
  CheckoutCompletePage,
} from '../pages/checkoutPages';

/**
 * Custom fixtures for SauceDemo tests
 * This allows us to inject page objects into tests without repeating initialization code
 */
type SauceDemoFixtures = {
  loginPage: LoginPage;
  inventoryPage: InventoryPage;
  inventoryDetailsPage: InventoryDetailsPage;
  cartPage: CartPage;
  checkoutInfoPage: CheckoutInfoPage;
  checkoutOverviewPage: CheckoutOverviewPage;
  checkoutCompletePage: CheckoutCompletePage;
};

/**
 * Extend Playwright's base test with custom fixtures
 * Usage: import { test, expect } from './fixtures';
 */
export const test = base.extend<SauceDemoFixtures>({
  // LoginPage fixture - automatically initialized before each test
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await use(loginPage);
  },

  // InventoryPage fixture
  inventoryPage: async ({ page }, use) => {
    await use(new InventoryPage(page));
  },
  inventoryDetailsPage: async ({ page }, use) => {
    await use(new InventoryDetailsPage(page));
  },

  // CartPage fixture
  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },

  // CheckoutInfoPage fixture
  checkoutInfoPage: async ({ page }, use) => {
    await use(new CheckoutInfoPage(page));
  },

  // CheckoutOverviewPage fixture
  checkoutOverviewPage: async ({ page }, use) => {
    await use(new CheckoutOverviewPage(page));
  },

  // CheckoutCompletePage fixture
  checkoutCompletePage: async ({ page }, use) => {
    await use(new CheckoutCompletePage(page));
  },
});

export { expect } from '@playwright/test';
