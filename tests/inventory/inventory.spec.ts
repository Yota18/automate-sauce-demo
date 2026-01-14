import { test, expect } from '../../fixtures/fixtures';
import { products } from '../../data/testData';
import { step, attachment } from 'allure-js-commons';

test.describe('inventory - positive scenarios', () => {
  test.beforeEach(async ({ inventoryPage }) => {
    await inventoryPage.goto();
  });

  test('should validate that all products are present in the list', async ({ inventoryPage }) => {
    await step('Validation: Verify product count', async () => {
      await expect(inventoryPage.inventoryItems).toHaveCount(6);
    });
  });

  test('should validate that product details can be opened', async ({
    inventoryPage,
    inventoryDetailsPage,
    page,
  }) => {
    const productName = products.backpack;
    await inventoryPage.openProductDetails(productName);

    await step('Validation: Verify details page loaded and name matches', async () => {
      expect(await inventoryDetailsPage.isLoaded()).toBe(true);
      expect(await inventoryDetailsPage.getProductName()).toBe(productName);
      await attachment('Product Details', await page.screenshot(), 'image/png');
    });
  });

  test('should be able to add/remove product from the details page', async ({
    inventoryPage,
    inventoryDetailsPage,
    page,
  }) => {
    const productName = products.backpack;
    await inventoryPage.openProductDetails(productName);

    await step('Add product from details page', async () => {
      await inventoryDetailsPage.clickAddToCart();
    });

    await step('Validation: Verify cart badge count is 1', async () => {
      expect(await inventoryPage.getCartBadgeCount()).toBe(1);
    });

    await step('Remove product from details page', async () => {
      await inventoryDetailsPage.clickRemove();
    });

    await step('Validation: Verify cart badge is empty', async () => {
      expect(await inventoryPage.getCartBadgeCount()).toBe(0);
      await attachment('Empty Cart After Removal', await page.screenshot(), 'image/png');
    });
  });

  test('should navigate back to products page from details', async ({
    inventoryPage,
    inventoryDetailsPage,
    page,
  }) => {
    await inventoryPage.openProductDetails(products.backpack);
    await inventoryDetailsPage.goBack();

    await step('Validation: Verify redirection to inventory list', async () => {
      await expect(page).toHaveURL(/.*inventory\.html/);
      expect(await inventoryPage.isInventoryPageLoaded()).toBe(true);
    });
  });

  // Sorting Tests (previously in sorting.spec.ts)
  test('should correctly sort products by Price (low to high)', async ({ page, inventoryPage }) => {
    await step('Apply sorting filter: Price (low to high)', async () => {
      await inventoryPage.selectSortOption('lohi');
    });

    await step('Validation: Verify price sorting logic', async () => {
      const prices = await inventoryPage.getAllProductPrices();

      const sortedPrices = [...prices].sort((a, b) => a - b);
      expect(prices).toEqual(sortedPrices);

      const screenshot = await page.screenshot();
      await attachment('Price Sorting Evidence (Low to High)', screenshot, 'image/png');
    });
  });

  test('should correctly sort products by Name (Z to A)', async ({ page, inventoryPage }) => {
    await step('Apply sorting filter: Name (Z to A)', async () => {
      await inventoryPage.selectSortOption('za');
    });

    await step('Validation: Verify name sorting logic', async () => {
      const names = await inventoryPage.getAllProductNames();

      const sortedNames = [...names].sort((a, b) => b.localeCompare(a));
      expect(names).toEqual(sortedNames);

      const screenshot = await page.screenshot();
      await attachment('Name Sorting Evidence (Z to A)', screenshot, 'image/png');
    });
  });
});

test.describe('inventory - negative scenarios', () => {
  test.beforeEach(async ({ inventoryPage }) => {
    await inventoryPage.goto();
  });

  test('should handle direct access to non-existent product details gracefully', async ({
    page,
    inventoryPage,
  }) => {
    await step('Navigate directly to invalid product URL', async () => {
      // Attempt to access product detail page with invalid/non-existent ID
      await page.goto('/inventory-item.html?id=999');
    });

    await step('Validation: Verify graceful handling (redirect or error state)', async () => {
      // SauceDemo might redirect to inventory or show empty state
      // We verify the app doesn't crash and handles it gracefully
      const currentUrl = page.url();
      const isGraceful =
        currentUrl.includes('inventory.html') || // Redirected to inventory
        currentUrl.includes('inventory-item.html'); // Stayed on page (empty state)

      expect(isGraceful).toBe(true);

      // Verify we can still navigate (app not broken)
      await inventoryPage.goto();
      expect(await inventoryPage.isInventoryPageLoaded()).toBe(true);

      await attachment('Invalid Product Handling', await page.screenshot(), 'image/png');
    });
  });

  test('should verify sort state does NOT persist when using browser back button', async ({
    page,
    inventoryPage,
  }) => {
    await step('Apply price sorting (low to high)', async () => {
      await inventoryPage.selectSortOption('lohi');
    });

    await step('Capture sorted prices before navigation', async () => {
      const pricesBefore = await inventoryPage.getAllProductPrices();
      const sortedPrices = [...pricesBefore].sort((a, b) => a - b);
      expect(pricesBefore).toEqual(sortedPrices);
    });

    await step('Navigate to product details and back', async () => {
      await inventoryPage.openProductDetails(products.backpack);
      await page.goBack();
    });

    await step('Validation: Verify sort resets to default (limitation)', async () => {
      // SauceDemo does NOT preserve sort state with browser back
      // This is a known limitation - sort dropdown resets to default "Name (A to Z)"
      const namesAfterBack = await inventoryPage.getAllProductNames();
      const expectedDefaultSort = [...namesAfterBack].sort((a, b) => a.localeCompare(b));

      // Verify sort reset to default A-Z
      expect(namesAfterBack).toEqual(expectedDefaultSort);

      await attachment('Sort State Lost After Back', await page.screenshot(), 'image/png');
    });
  });

  test('should verify all product prices are valid positive numbers', async ({ inventoryPage }) => {
    await step('Validation: Verify price data integrity', async () => {
      const prices = await inventoryPage.getAllProductPrices();

      // Verify all prices are positive numbers
      prices.forEach((price) => {
        expect(price).toBeGreaterThan(0);
        expect(Number.isNaN(price)).toBe(false);
        expect(Number.isFinite(price)).toBe(true);
      });

      // Verify we have prices for all products
      expect(prices).toHaveLength(6);
    });
  });

  test('should verify all product names are non-empty strings', async ({ inventoryPage }) => {
    await step('Validation: Verify product name data integrity', async () => {
      const names = await inventoryPage.getAllProductNames();

      // Verify all names are non-empty
      names.forEach((name) => {
        expect(name).toBeTruthy();
        expect(name.length).toBeGreaterThan(0);
        expect(typeof name).toBe('string');
      });

      // Verify we have names for all products
      expect(names).toHaveLength(6);
    });
  });

  test('should handle rapid add/remove actions without breaking cart state', async ({
    inventoryPage,
    page,
  }) => {
    await step('Perform rapid add to cart actions', async () => {
      // Rapidly add multiple products
      await inventoryPage.addProductToCart(products.backpack);
      await inventoryPage.addProductToCart(products.bikeLight);
      await inventoryPage.addProductToCart(products.boltTShirt);
    });

    await step('Validation: Verify cart badge reflects correct count', async () => {
      const badgeCount = await inventoryPage.getCartBadgeCount();
      expect(badgeCount).toBe(3);
    });

    await step('Navigate to product detail and perform add/remove', async () => {
      await inventoryPage.openProductDetails(products.backpack);
      await page.locator('button[id^="remove"]').click(); // Remove from details
    });

    await step('Navigate back and verify cart count updated', async () => {
      await page.goBack();
      const updatedCount = await inventoryPage.getCartBadgeCount();
      expect(updatedCount).toBe(2);

      await attachment('Rapid Actions Cart State', await page.screenshot(), 'image/png');
    });
  });

  test('should verify sort dropdown resets correctly', async ({ inventoryPage, page }) => {
    await step('Apply multiple sort options sequentially', async () => {
      await inventoryPage.selectSortOption('za'); // Z to A
      await inventoryPage.selectSortOption('lohi'); // Price low to high
      await inventoryPage.selectSortOption('hilo'); // Price high to low
    });

    await step('Validation: Verify final sort is applied correctly', async () => {
      const prices = await inventoryPage.getAllProductPrices();
      const sortedDescending = [...prices].sort((a, b) => b - a);
      expect(prices).toEqual(sortedDescending);
    });

    await step('Refresh page and verify sort resets to default', async () => {
      await page.reload();
      const namesAfterRefresh = await inventoryPage.getAllProductNames();

      // Default sort should be A-Z
      const expectedDefaultSort = [...namesAfterRefresh].sort((a, b) => a.localeCompare(b));
      expect(namesAfterRefresh).toEqual(expectedDefaultSort);

      await attachment('Sort Reset Evidence', await page.screenshot(), 'image/png');
    });
  });
});
