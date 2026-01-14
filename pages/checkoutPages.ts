import { Page, Locator } from '@playwright/test';
import { AuthenticatedPage } from './authenticatedPage';
import { step } from 'allure-js-commons';

/**
 * Consolidated Checkout Pages
 * Contains all Page Objects related to the checkout flow:
 * - CartPage: Shopping cart management
 * - CheckoutInfoPage: Personal information entry
 * - CheckoutOverviewPage: Order review and confirmation
 * - CheckoutCompletePage: Order completion confirmation
 */

// ============================================================================
// CART PAGE
// ============================================================================

/**
 * Cart Page Object
 * Handles all selectors and actions for the shopping cart page
 */
export class CartPage extends AuthenticatedPage {
  // Selectors
  private readonly cartList: Locator;
  private readonly cartItems: Locator;
  private readonly checkoutButton: Locator;
  private readonly continueShoppingButton: Locator;

  constructor(page: Page) {
    super(page);
    this.cartList = page.locator('.cart_list');
    this.cartItems = page.locator('.cart_item');
    this.checkoutButton = page.getByTestId('checkout');
    this.continueShoppingButton = page.getByTestId('continue-shopping');
  }

  /**
   * Navigate to the cart page
   */
  async goto(): Promise<void> {
    await step('Navigate to cart page', async () => {
      await this.navigateTo('/cart.html');
    });
  }

  /**
   * Get the count of items in the cart
   * @returns Number of items in the cart
   */
  async getCartItemCount(): Promise<number> {
    return await step('Get cart item count', async () => {
      return await this.cartItems.count();
    });
  }

  /**
   * Check if a specific product is in the cart
   * @param productName - Name of the product to check
   * @returns True if product is found, false otherwise
   */
  async isProductInCart(productName: string): Promise<boolean> {
    return await step(`Check if product is in cart: ${productName}`, async () => {
      const product = this.page.getByTestId('inventory-item-name').filter({ hasText: productName });
      return await product.isVisible();
    });
  }

  /**
   * Proceed to checkout
   */
  async clickCheckout(): Promise<void> {
    await step('Click checkout button', async () => {
      await this.checkoutButton.click();
    });
  }

  /**
   * Click continue shopping
   */
  async clickContinueShopping(): Promise<void> {
    await step('Click continue shopping button', async () => {
      await this.continueShoppingButton.click();
    });
  }
}

// ============================================================================
// CHECKOUT INFO PAGE
// ============================================================================

/**
 * Checkout Information Page Object
 * Handles user metadata input for checkout
 */
export class CheckoutInfoPage extends AuthenticatedPage {
  // Selectors
  private readonly firstNameInput: Locator;
  private readonly lastNameInput: Locator;
  private readonly zipCodeInput: Locator;
  private readonly continueButton: Locator;
  private readonly cancelButton: Locator;
  private readonly errorMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.firstNameInput = page.getByPlaceholder('First Name');
    this.lastNameInput = page.getByPlaceholder('Last Name');
    this.zipCodeInput = page.getByPlaceholder('Zip/Postal Code');
    this.continueButton = page.getByRole('button', { name: 'Continue' });
    this.cancelButton = page.getByRole('button', { name: 'Cancel' });
    this.errorMessage = page.getByTestId('error');
  }

  /**
   * Fill checkout information form
   * @param firstName - User's first name
   * @param lastName - User's last name
   * @param zipCode - User's zip/postal code
   */
  async fillCheckoutInfo(firstName: string, lastName: string, zipCode: string): Promise<void> {
    await step('Fill checkout information form', async () => {
      await step(`Enter first name: ${firstName}`, async () => {
        await this.firstNameInput.fill(firstName);
      });
      await step(`Enter last name: ${lastName}`, async () => {
        await this.lastNameInput.fill(lastName);
      });
      await step(`Enter zip code: ${zipCode}`, async () => {
        await this.zipCodeInput.fill(zipCode);
      });
    });
  }

  /**
   * Click continue button to proceed to overview
   */
  async clickContinue(): Promise<void> {
    await step('Click continue button', async () => {
      await this.continueButton.click();
    });
  }

  /**
   * Get error message text
   * @returns The error message text or null if not visible
   */
  async getErrorMessage(): Promise<string | null> {
    return await step('Get checkout error message', async () => {
      if (await this.errorMessage.isVisible()) {
        return await this.errorMessage.textContent();
      }
      return null;
    });
  }

  /**
   * Check if error message is visible
   */
  async isErrorMessageVisible(): Promise<boolean> {
    return await step('Check if checkout error message is visible', async () => {
      return await this.errorMessage.isVisible();
    });
  }
}

// ============================================================================
// CHECKOUT OVERVIEW PAGE
// ============================================================================

/**
 * Checkout Overview Page Object
 * Handles final order review before completion
 */
export class CheckoutOverviewPage extends AuthenticatedPage {
  // Selectors
  public readonly cartItems: Locator;
  public readonly summaryInfo: Locator;
  public readonly finishButton: Locator;
  public readonly cancelButton: Locator;
  public readonly totalPriceLabel: Locator;

  constructor(page: Page) {
    super(page);
    this.cartItems = page.locator('.cart_item');
    this.summaryInfo = page.locator('.summary_info');
    this.finishButton = page.getByTestId('finish');
    this.cancelButton = page.getByTestId('cancel');
    this.totalPriceLabel = page.locator('.summary_total_label');
  }

  /**
   * Get the count of items in the overview
   */
  async getOrderItemCount(): Promise<number> {
    return await step('Get order item count', async () => {
      return await this.cartItems.count();
    });
  }

  /**
   * Get the total price text
   */
  async getTotalPriceText(): Promise<string | null> {
    return await step('Get total price text', async () => {
      return await this.totalPriceLabel.textContent();
    });
  }

  /**
   * Finish the purchase
   */
  async clickFinish(): Promise<void> {
    await step('Click finish button', async () => {
      await this.finishButton.click();
    });
  }

  /**
   * Cancel the purchase
   */
  async clickCancel(): Promise<void> {
    await step('Click cancel button', async () => {
      await this.cancelButton.click();
    });
  }
}

// ============================================================================
// CHECKOUT COMPLETE PAGE
// ============================================================================

/**
 * Checkout Complete Page Object
 * Handles verification of successful order completion
 */
export class CheckoutCompletePage extends AuthenticatedPage {
  // Selectors
  public readonly completeHeader: Locator;
  public readonly completeText: Locator;
  public readonly backHomeButton: Locator;

  constructor(page: Page) {
    super(page);
    this.completeHeader = page.locator('.complete-header');
    this.completeText = page.locator('.complete-text');
    this.backHomeButton = page.getByTestId('back-to-products');
  }

  /**
   * Get completion header text
   */
  async getCompletionHeader(): Promise<string | null> {
    return await step('Get completion header text', async () => {
      return await this.completeHeader.textContent();
    });
  }

  /**
   * Check if "THANK YOU FOR YOUR ORDER" header is visible
   */
  async isThankYouHeaderVisible(): Promise<boolean> {
    return await step('Check if "THANK YOU" header is visible', async () => {
      const text = await this.completeHeader.textContent();
      return (
        text?.toUpperCase() === 'THANK YOU FOR YOUR ORDER' ||
        text?.toUpperCase() === 'THANK YOU FOR YOUR ORDER!'
      );
    });
  }

  /**
   * Click back home button
   */
  async clickBackHome(): Promise<void> {
    await step('Click back home button', async () => {
      await this.backHomeButton.click();
    });
  }
}
