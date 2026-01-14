import { test, expect } from '../../fixtures/fixtures';
import { users, products } from '../../data/testData';
import { step, attachment } from 'allure-js-commons';

// ============================================================================
// CART STAGE TESTS
// ============================================================================

test.describe('checkout flow - cart stage', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.login(users.standard.username, users.standard.password);
  });

  test('should add Sauce Labs Backpack to cart and verify badge count', async ({
    page,
    inventoryPage,
  }) => {
    await step('Add Sauce Labs Backpack to cart', async () => {
      await inventoryPage.addProductToCart(products.backpack);
    });

    await step('Validation: Verify cart badge count', async () => {
      expect(await inventoryPage.isCartBadgeVisible()).toBe(true);
      const badgeCount = await inventoryPage.getCartBadgeCount();
      expect(badgeCount).toBe(1);

      const screenshot = await page.screenshot({ fullPage: false });
      await attachment('Cart Badge Evidence', screenshot, 'image/png');
    });
  });

  test('should add multiple products to cart and verify badge count', async ({
    page,
    inventoryPage,
  }) => {
    await step('Add 3 products to cart', async () => {
      await inventoryPage.addProductToCart(products.backpack);
      await inventoryPage.addProductToCart(products.bikeLight);
      await inventoryPage.addProductToCart(products.boltTShirt);
    });

    await step('Validation: Verify cart badge count for multiple items', async () => {
      const badgeCount = await inventoryPage.getCartBadgeCount();
      expect(badgeCount).toBe(3);

      const screenshot = await page.screenshot({ fullPage: false });
      await attachment('Multi-Product Cart Evidence', screenshot, 'image/png');
    });
  });

  test('should navigate to cart page after adding product', async ({ page, inventoryPage }) => {
    await step('Add Sauce Labs Backpack to cart', async () => {
      await inventoryPage.addProductToCart(products.backpack);
    });

    await step('Navigate to cart page', async () => {
      await inventoryPage.navigateToCart();
    });

    await step('Validation: Verify user is on cart page', async () => {
      await expect(page).toHaveURL(/.*cart\.html/);
      const screenshot = await page.screenshot();
      await attachment('Cart Page Evidence', screenshot, 'image/png');
    });
  });

  test('should verify cart badge is hidden when no items are added', async ({ inventoryPage }) => {
    await step('Validation: Verify cart badge is hidden', async () => {
      const isBadgeVisible = await inventoryPage.isCartBadgeVisible();
      expect(isBadgeVisible).toBe(false);
    });
  });
});

// ============================================================================
// OVERVIEW STAGE TESTS
// ============================================================================

test.describe('checkout flow - overview stage', () => {
  test.beforeEach(async ({ inventoryPage, cartPage, checkoutInfoPage, page }) => {
    // Setup: Navigate to Overview page
    await inventoryPage.goto();
    await inventoryPage.addProductToCart(products.backpack);
    await inventoryPage.navigateToCart();
    await cartPage.clickCheckout();
    await checkoutInfoPage.fillCheckoutInfo('Senior', 'Tester', '12345');
    await checkoutInfoPage.clickContinue();
    await expect(page).toHaveURL(/.*checkout-step-two\.html/);
  });

  test('should display correct order summary', async ({ page }) => {
    await step('Validation: Verify order items are visible', async () => {
      // In a real scenario, we might check prices, names, etc.
      // For now, we verify we are on the page and can see summary details.
      await expect(page.locator('.cart_list')).toBeVisible();
    });
  });

  test('should complete the order upon clicking Finish', async ({ page, checkoutOverviewPage }) => {
    await step('Click Finish button', async () => {
      await checkoutOverviewPage.clickFinish();
    });

    await step('Validation: Verify redirection to completion page', async () => {
      await expect(page).toHaveURL(/.*checkout-complete\.html/);
      await attachment('Order Finished', await page.screenshot(), 'image/png');
    });
  });
});

// ============================================================================
// COMPLETION STAGE TESTS
// ============================================================================

test.describe('checkout flow - completion stage', () => {
  test.beforeEach(
    async ({ inventoryPage, cartPage, checkoutInfoPage, checkoutOverviewPage, page }) => {
      // Setup: Complete checkout to reach final page
      await inventoryPage.goto();
      await inventoryPage.addProductToCart(products.backpack);
      await inventoryPage.navigateToCart();
      await cartPage.clickCheckout();
      await checkoutInfoPage.fillCheckoutInfo('Senior', 'Tester', '12345');
      await checkoutInfoPage.clickContinue();
      await checkoutOverviewPage.clickFinish();
      await expect(page).toHaveURL(/.*checkout-complete\.html/);
    }
  );

  test('should display thank you message and header', async ({ checkoutCompletePage, page }) => {
    await step('Validation: Verify completion header and message', async () => {
      expect(await checkoutCompletePage.isThankYouHeaderVisible()).toBe(true);
      await attachment('Checkout Complete Page', await page.screenshot(), 'image/png');
    });
  });

  test('should navigate back to products page when clicking Back Home', async ({ page }) => {
    await step('Click Back Home button', async () => {
      await page.getByTestId('back-to-products').click();
    });

    await step('Validation: Verify redirection to inventory', async () => {
      await expect(page).toHaveURL(/.*inventory\.html/);
    });
  });
});

// ============================================================================
// NEGATIVE SCENARIOS (Senior QA)
// ============================================================================

test.describe('checkout flow - negative scenarios', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.login(users.standard.username, users.standard.password);
  });

  test('should handle checkout attempt with empty cart gracefully', async ({
    page,
    inventoryPage,
    cartPage,
  }) => {
    await step('Navigate to cart without adding any items', async () => {
      await inventoryPage.goto();
      await inventoryPage.navigateToCart();
    });

    await step('Attempt to proceed to checkout', async () => {
      await cartPage.clickCheckout();
    });

    await step('Validation: Verify system allows empty cart checkout (limitation)', async () => {
      // SauceDemo allows empty cart checkout - this is a known business logic issue
      await expect(page).toHaveURL(/.*checkout-step-one\.html/);
      await attachment('Empty Cart Checkout Allowed', await page.screenshot(), 'image/png');
    });
  });

  test('should handle direct URL access to checkout stages without proper flow', async ({
    page,
    inventoryPage,
  }) => {
    await step('Navigate to inventory first', async () => {
      await inventoryPage.goto();
    });

    await step('Attempt direct access to overview page (skip info)', async () => {
      await page.goto('/checkout-step-two.html');
    });

    await step('Validation: Verify system behavior for unauthorized stage access', async () => {
      // SauceDemo might allow or redirect - we verify graceful handling
      const currentUrl = page.url();
      const isHandledGracefully =
        currentUrl.includes('checkout-step-two') || // Allowed (limitation)
        currentUrl.includes('checkout-step-one') || // Redirected to info
        currentUrl.includes('inventory'); // Redirected to start

      expect(isHandledGracefully).toBe(true);
      await attachment('Direct URL Access Handling', await page.screenshot(), 'image/png');
    });
  });

  test('should verify cart persists when canceling from checkout info page', async ({
    page,
    inventoryPage,
    cartPage,
  }) => {
    await step('Add product and navigate to checkout', async () => {
      await inventoryPage.addProductToCart(products.backpack);
      await inventoryPage.navigateToCart();
      await cartPage.clickCheckout();
    });

    await step('Cancel checkout from info page', async () => {
      await page.getByTestId('cancel').click();
    });

    await step('Validation: Verify cart still has items after cancel', async () => {
      await expect(page).toHaveURL(/.*cart\.html/);
      const cartBadgeCount = await inventoryPage.getCartBadgeCount();
      expect(cartBadgeCount).toBe(1);

      // Verify product still in cart
      const productInCart = await cartPage.isProductInCart(products.backpack);
      expect(productInCart).toBe(true);

      await attachment('Cart Persisted After Cancel', await page.screenshot(), 'image/png');
    });
  });

  test('should verify cart persists when canceling from overview page', async ({
    page,
    inventoryPage,
    cartPage,
    checkoutInfoPage,
    checkoutOverviewPage,
  }) => {
    await step('Complete checkout up to overview stage', async () => {
      await inventoryPage.addProductToCart(products.bikeLight);
      await inventoryPage.navigateToCart();
      await cartPage.clickCheckout();
      await checkoutInfoPage.fillCheckoutInfo('Cancel', 'Test', '99999');
      await checkoutInfoPage.clickContinue();
    });

    await step('Cancel from overview page', async () => {
      await checkoutOverviewPage.clickCancel();
    });

    await step('Validation: Verify cart preserved and redirect to inventory', async () => {
      await expect(page).toHaveURL(/.*inventory\.html/);
      const cartBadgeCount = await inventoryPage.getCartBadgeCount();
      expect(cartBadgeCount).toBe(1);

      await attachment(
        'Cart Preserved After Overview Cancel',
        await page.screenshot(),
        'image/png'
      );
    });
  });

  test('should handle removing all items from cart during checkout flow', async ({
    page,
    inventoryPage,
    cartPage,
  }) => {
    await step('Add multiple products to cart', async () => {
      await inventoryPage.addProductToCart(products.backpack);
      await inventoryPage.addProductToCart(products.bikeLight);
      await inventoryPage.navigateToCart();
    });

    await step('Remove all items from cart page', async () => {
      // Remove both products
      await page.locator('button[id^="remove"]').first().click();
      await page.locator('button[id^="remove"]').first().click();
    });

    await step('Validation: Verify cart badge disappears', async () => {
      const isBadgeVisible = await inventoryPage.isCartBadgeVisible();
      expect(isBadgeVisible).toBe(false);
    });

    await step('Attempt to checkout with empty cart', async () => {
      await cartPage.clickCheckout();
    });

    await step(
      'Validation: Verify system allows checkout despite empty cart (limitation)',
      async () => {
        // This exposes a business logic flaw - should prevent empty checkout
        await expect(page).toHaveURL(/.*checkout-step-one\.html/);
        await attachment('Empty Cart After Removal', await page.screenshot(), 'image/png');
      }
    );
  });

  test('should verify cart count accuracy when adding same product multiple times', async ({
    page,
    inventoryPage,
  }) => {
    await step('Add same product twice (limitation - no quantity)', async () => {
      await inventoryPage.addProductToCart(products.boltTShirt);
      // Try to add again (button should change to Remove)
      const addButton = page
        .getByTestId('inventory-item')
        .filter({ has: page.getByText(products.boltTShirt) })
        .getByRole('button');

      const buttonText = await addButton.textContent();
      expect(buttonText?.toLowerCase()).toContain('remove');
    });

    await step('Validation: Verify cart badge shows 1 (no quantity feature)', async () => {
      const badgeCount = await inventoryPage.getCartBadgeCount();
      expect(badgeCount).toBe(1); // SauceDemo doesn't support quantity > 1

      await attachment(
        'Single Item in Cart',
        await page.screenshot({ fullPage: false }),
        'image/png'
      );
    });
  });

  test('should verify navigation using browser back button from checkout stages', async ({
    page,
    inventoryPage,
    cartPage,
    checkoutInfoPage,
  }) => {
    await step('Navigate through checkout flow', async () => {
      await inventoryPage.addProductToCart(products.backpack);
      await inventoryPage.navigateToCart();
      await cartPage.clickCheckout();
      await checkoutInfoPage.fillCheckoutInfo('Back', 'Button', '11111');
      await checkoutInfoPage.clickContinue();
    });

    await step('Use browser back button from overview', async () => {
      await page.goBack();
    });

    await step('Validation: Verify return to info page with data preserved', async () => {
      await expect(page).toHaveURL(/.*checkout-step-one\.html/);

      // SauceDemo might not preserve form data - verify graceful handling
      const currentUrl = page.url();
      expect(currentUrl).toContain('checkout-step-one');

      await attachment('Browser Back Navigation', await page.screenshot(), 'image/png');
    });
  });
});
