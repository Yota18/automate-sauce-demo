import { Page, Locator } from '@playwright/test';
import { BasePage } from './basePage';
import { step } from 'allure-js-commons';

/**
 * Login Page Object
 * Handles all selectors and actions for the login page
 */
export class LoginPage extends BasePage {
  // Selectors
  private readonly usernameInput: Locator;
  private readonly passwordInput: Locator;
  private readonly loginButton: Locator;
  private readonly errorMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.usernameInput = page.getByPlaceholder('Username');
    this.passwordInput = page.getByPlaceholder('Password');
    this.loginButton = page.getByRole('button', { name: 'Login' });
    this.errorMessage = page.getByTestId('error');
  }

  /**
   * Navigate to the login page
   */
  async goto(): Promise<void> {
    await step('Navigate to login page', async () => {
      await this.navigateTo('/');
    });
  }

  /**
   * Perform login with provided credentials
   * @param username - Username to login with
   * @param password - Password to login with
   */
  async login(username: string, password: string): Promise<void> {
    await step(`Login with username: ${username}`, async () => {
      await step('Fill username', async () => {
        await this.usernameInput.fill(username);
      });
      await step('Fill password', async () => {
        await this.passwordInput.fill(password);
      });
      await step('Click login button', async () => {
        await this.loginButton.click();
      });
    });
  }

  /**
   * Get the error message text displayed on the page
   * @returns Error message text
   */
  async getErrorMessage(): Promise<string> {
    await this.errorMessage.waitFor({ state: 'visible' });
    return (await this.errorMessage.textContent()) || '';
  }

  /**
   * Check if error message is visible
   * @returns True if error message is visible, false otherwise
   */
  async isErrorMessageVisible(): Promise<boolean> {
    return await this.errorMessage.isVisible();
  }

  /**
   * Check if login button is visible
   * @returns True if login button is visible, false otherwise
   */
  async isLoginButtonVisible(): Promise<boolean> {
    return await this.loginButton.isVisible();
  }

  /**
   * Check if user is on login page
   * @returns True if on login page (login form is visible), false otherwise
   */
  async isOnLoginPage(): Promise<boolean> {
    let result = false;
    await step('Verify user is on login page', async () => {
      result = (await this.loginButton.isVisible()) && (await this.usernameInput.isVisible());
    });
    return result;
  }
}
