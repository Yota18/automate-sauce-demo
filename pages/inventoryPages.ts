import { Page, Locator } from '@playwright/test';
import { AuthenticatedPage } from './authenticatedPage';
import { step } from 'allure-js-commons';

/**
 * Consolidated Inventory Pages
 * Contains all Page Objects related to inventory/products:
 * - InventoryPage: Product listing and sorting
 * - InventoryDetailsPage: Individual product details
 */

// ============================================================================
// INVENTORY PAGE (Product Listing)
// ============================================================================

/**
 * Inventory Page Object
 * Handles all selectors and actions for the inventory/products page
 */
export class InventoryPage extends AuthenticatedPage {
  // Selectors
  public readonly inventoryContainer: Locator;
  public readonly inventoryItems: Locator;
  public readonly sortContainer: Locator;
  public readonly inventoryItemName: Locator;
  public readonly inventoryItemPrice: Locator;

  constructor(page: Page) {
    super(page);
    this.inventoryContainer = page.locator('.inventory_container').first();
    this.inventoryItems = page.getByTestId('inventory-item');
    this.sortContainer = page.getByTestId('product-sort-container');
    this.inventoryItemName = page.getByTestId('inventory-item-name');
    this.inventoryItemPrice = page.getByTestId('inventory-item-price');
  }

  /**
   * Navigate to the inventory page
   */
  async goto(): Promise<void> {
    await step('Navigate to inventory page', async () => {
      await this.navigateTo('/inventory.html');
      await this.isInventoryPageLoaded();
    });
  }

  /**
   * Add a product to the cart by product name
   * @param productName - Name of the product to add to cart
   */
  async addProductToCart(productName: string): Promise<void> {
    await step(`Add product to cart: ${productName}`, async () => {
      const productItem = this.page.getByTestId('inventory-item').filter({
        has: this.page.getByTestId('inventory-item-name').filter({ hasText: productName }),
      });

      const addToCartButton = productItem.getByRole('button', { name: /add to cart/i });
      await addToCartButton.click();
    });
  }

  /**
   * Check if inventory container is visible
   * @returns True if inventory container is visible, false otherwise
   */
  async isInventoryPageLoaded(): Promise<boolean> {
    let result = false;
    await step('Check if inventory page is loaded', async () => {
      result = await this.inventoryContainer.isVisible();
    });
    return result;
  }

  /**
   * Get the count of all inventory items on the page
   * @returns Number of inventory items
   */
  async getInventoryItemCount(): Promise<number> {
    return await step('Get inventory item count', async () => {
      return await this.inventoryItems.count();
    });
  }

  /**
   * Get all product names on the current page
   */
  async getAllProductNames(): Promise<string[]> {
    return await step('Get all product names', async () => {
      return await this.inventoryItemName.allTextContents();
    });
  }

  /**
   * Get all product prices on the current page as numbers
   */
  async getAllProductPrices(): Promise<number[]> {
    return await step('Get all product prices', async () => {
      const priceStrings = await this.inventoryItemPrice.allTextContents();
      return priceStrings.map((p) => parseFloat(p.replace('$', '')));
    });
  }

  /**
   * Select a sorting option from the dropdown
   * @param option - Sorting option value (e.g., 'az', 'za', 'lohi', 'hilo')
   */
  async selectSortOption(option: 'az' | 'za' | 'lohi' | 'hilo'): Promise<void> {
    await step(`Select sort option: ${option}`, async () => {
      await this.sortContainer.selectOption(option);
    });
  }

  /**
   * Open the details page for a specific product
   * @param productName - Name of the product to open
   */
  async openProductDetails(productName: string): Promise<void> {
    await step(`Open product details for: ${productName}`, async () => {
      const productLink = this.page.locator('.inventory_item_name', {
        hasText: productName,
      });
      await productLink.click();
    });
  }
}

// ============================================================================
// INVENTORY DETAILS PAGE (Product Details)
// ============================================================================

/**
 * Inventory Details Page Object
 * Handles selectors and actions for specific product detail pages
 */
export class InventoryDetailsPage extends AuthenticatedPage {
  // Selectors
  public readonly inventoryDetailsContainer: Locator;
  public readonly backToProductsButton: Locator;
  public readonly addToCartButton: Locator;
  public readonly removeFromCartButton: Locator;
  public readonly productNameLabel: Locator;

  constructor(page: Page) {
    super(page);
    this.inventoryDetailsContainer = page.locator('.inventory_details_container');
    this.backToProductsButton = page.getByTestId('back-to-products');
    this.addToCartButton = page.locator('button[id^="add-to-cart"]');
    this.removeFromCartButton = page.locator('button[id^="remove"]');
    this.productNameLabel = page.getByTestId('inventory-item-name');
  }

  /**
   * Check if the details page is loaded
   */
  async isLoaded(): Promise<boolean> {
    return await step('Check if inventory details page is loaded', async () => {
      await this.inventoryDetailsContainer.waitFor({ state: 'visible' });
      return await this.inventoryDetailsContainer.isVisible();
    });
  }

  /**
   * Get the product name from the details
   */
  async getProductName(): Promise<string> {
    return await step('Get product name from details', async () => {
      return (await this.productNameLabel.textContent()) || '';
    });
  }

  /**
   * Click the "Add to cart" button
   */
  async clickAddToCart(): Promise<void> {
    await step('Add product to cart from details page', async () => {
      await this.addToCartButton.click();
    });
  }

  /**
   * Click the "Remove" button
   */
  async clickRemove(): Promise<void> {
    await step('Remove product from cart from details page', async () => {
      await this.removeFromCartButton.click();
    });
  }

  /**
   * Navigate back to the product list
   */
  async goBack(): Promise<void> {
    await step('Navigate back to product list', async () => {
      await this.backToProductsButton.click();
    });
  }
}
