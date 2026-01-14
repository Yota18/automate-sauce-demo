import { test, expect } from '../../fixtures/fixtures';
import { step, attachment } from 'allure-js-commons';

test.describe('checkout - personal info - positive scenarios', () => {
  test.beforeEach(async ({ inventoryPage, page }) => {
    await inventoryPage.goto();
    await inventoryPage.navigateToCart();
    await page.getByTestId('checkout').click();
    await expect(page).toHaveURL(/.*checkout-step-one\.html/);
  });

  test('should proceed to overview stage when all fields are filled', async ({
    page,
    checkoutInfoPage,
  }) => {
    await step('Fill valid personal info', async () => {
      await checkoutInfoPage.fillCheckoutInfo('Senior', 'Tester', '12345');
      await checkoutInfoPage.clickContinue();
    });

    await step('Validation: Verify redirection to overview page', async () => {
      await expect(page).toHaveURL(/.*checkout-step-two\.html/);
    });
  });
});

test.describe('checkout - personal info - negative scenarios', () => {
  test.beforeEach(async ({ inventoryPage, page }) => {
    await inventoryPage.goto();
    await inventoryPage.navigateToCart();
    await page.getByTestId('checkout').click();
    await expect(page).toHaveURL(/.*checkout-step-one\.html/);
  });

  test('should show error when first name is missing', async ({ page, checkoutInfoPage }) => {
    await step('Leave first name empty and fill others', async () => {
      await checkoutInfoPage.fillCheckoutInfo('', 'Tester', '12345');
      await checkoutInfoPage.clickContinue();
    });

    await step('Validation: Verify error message for missing first name', async () => {
      const errorMessage = await checkoutInfoPage.getErrorMessage();
      expect(errorMessage).toContain('First Name is required');
      await attachment('Error - First Name Required', await page.screenshot(), 'image/png');
    });
  });

  test('should show error when last name is missing', async ({ page, checkoutInfoPage }) => {
    await step('Leave last name empty and fill others', async () => {
      await checkoutInfoPage.fillCheckoutInfo('Senior', '', '12345');
      await checkoutInfoPage.clickContinue();
    });

    await step('Validation: Verify error message for missing last name', async () => {
      const errorMessage = await checkoutInfoPage.getErrorMessage();
      expect(errorMessage).toContain('Last Name is required');
      await attachment('Error - Last Name Required', await page.screenshot(), 'image/png');
    });
  });

  test('should show error when zip code is missing', async ({ page, checkoutInfoPage }) => {
    await step('Leave zip code empty and fill others', async () => {
      await checkoutInfoPage.fillCheckoutInfo('Senior', 'Tester', '');
      await checkoutInfoPage.clickContinue();
    });

    await step('Validation: Verify error message for missing zip code', async () => {
      const errorMessage = await checkoutInfoPage.getErrorMessage();
      expect(errorMessage).toContain('Postal Code is required');
      await attachment('Error - Postal Code Required', await page.screenshot(), 'image/png');
    });
  });

  test('should proceed to checkout with an empty cart (business logic limitation)', async ({
    page,
    checkoutInfoPage,
  }) => {
    await step('Validation: Verify system allows empty cart checkout', async () => {
      await checkoutInfoPage.fillCheckoutInfo('Empty', 'Cart', '00000');
      await checkoutInfoPage.clickContinue();
      await expect(page).toHaveURL(/.*checkout-step-two\.html/);
      await attachment('Empty Cart Checkout Allowed', await page.screenshot(), 'image/png');
    });
  });

  test('should handle extremely long strings and special characters in inputs', async ({
    page,
    checkoutInfoPage,
  }) => {
    const longString = 'A'.repeat(500);
    const specialChars = '!@#$%^&*()_+{}[]|\\:;"<>,.?/';

    await step('Fill form with edge case data', async () => {
      await checkoutInfoPage.fillCheckoutInfo(longString, specialChars, '12345-6789');
      await checkoutInfoPage.clickContinue();
    });

    await step('Validation: Verify system accepts edge case data (no validation)', async () => {
      await expect(page).toHaveURL(/.*checkout-step-two\.html/);
      await attachment('Edge Case Data Input', await page.screenshot(), 'image/png');
    });
  });
});
