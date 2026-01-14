import { Page, Locator } from '@playwright/test';
import { BasePage } from './basePage';
import { step } from 'allure-js-commons';

/**
 * AuthenticatedPage class for pages that require login
 * Contains shared elements like the header, cart, and sidebar menu
 */
export class AuthenticatedPage extends BasePage {
  public readonly cartBadge: Locator;
  public readonly cartLink: Locator;
  public readonly hamburgerMenuButton: Locator;
  public readonly sidebarMenu: Locator;
  public readonly logoutButton: Locator;

  constructor(page: Page) {
    super(page);
    this.cartBadge = page.locator('.shopping_cart_badge');
    this.cartLink = page.getByTestId('shopping-cart-link');
    this.hamburgerMenuButton = page.locator('#react-burger-menu-btn');
    this.sidebarMenu = page.locator('.bm-menu');
    this.logoutButton = page.locator('#logout_sidebar_link');
  }

  /**
   * Get the cart badge count
   * @returns Cart badge count as a number, or 0 if badge is not visible
   */
  async getCartBadgeCount(): Promise<number> {
    return await step('Get cart badge count', async () => {
      if (!(await this.cartBadge.isVisible())) {
        return 0;
      }
      const badgeText = await this.cartBadge.textContent();
      return badgeText ? parseInt(badgeText, 10) : 0;
    });
  }

  /**
   * Check if cart badge is visible
   * @returns True if cart badge is visible, false otherwise
   */
  async isCartBadgeVisible(): Promise<boolean> {
    return await step('Check if cart badge is visible', async () => {
      return await this.cartBadge.isVisible();
    });
  }

  /**
   * Navigate to the cart page
   */
  async navigateToCart(): Promise<void> {
    await step('Navigate to cart page', async () => {
      await this.cartLink.click();
    });
  }

  /**
   * Open the sidebar navigation menu (hamburger menu)
   */
  async openSidebarMenu(): Promise<void> {
    await step('Open sidebar menu', async () => {
      await this.hamburgerMenuButton.click();
      await this.sidebarMenu.waitFor({ state: 'visible' });
    });
  }

  /**
   * Click the logout button in the sidebar
   */
  async clickLogout(): Promise<void> {
    await step('Click logout button', async () => {
      await this.logoutButton.click();
    });
  }

  /**
   * Check if sidebar menu is visible
   * @returns True if sidebar is visible, false otherwise
   */
  async isSidebarVisible(): Promise<boolean> {
    return await step('Check if sidebar is visible', async () => {
      return await this.sidebarMenu.isVisible();
    });
  }

  /**
   * Perform complete logout flow: open menu and click logout
   */
  async logout(): Promise<void> {
    await step('Perform logout', async () => {
      await this.openSidebarMenu();
      await this.clickLogout();
    });
  }
}
