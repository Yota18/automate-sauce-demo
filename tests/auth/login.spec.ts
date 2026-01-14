import { test, expect } from '../../fixtures/fixtures';
import { users, errorMessages } from '../../data/testData';
import { step, attachment } from 'allure-js-commons';

test.describe('login - positive scenarios', () => {
  test('should successfully login with standard_user', async ({
    page,
    loginPage,
    inventoryPage,
  }) => {
    await step('Perform login with standard_user', async () => {
      await loginPage.login(users.standard.username, users.standard.password);
    });

    await step('Validation: Verify successful login and redirection', async () => {
      await expect(page).toHaveURL(/.*inventory\.html/);
      expect(await inventoryPage.isInventoryPageLoaded()).toBe(true);

      const screenshot = await page.screenshot();
      await attachment('Standard User Login Evidence', screenshot, 'image/png');
    });
  });

  test('should successfully login with performance_glitch_user', async ({
    page,
    loginPage,
    inventoryPage,
  }) => {
    await step('Perform login with performance_glitch_user', async () => {
      await loginPage.login(users.performanceGlitch.username, users.performanceGlitch.password);
    });

    await step('Validation: Verify successful login and redirection', async () => {
      await expect(page).toHaveURL(/.*inventory\.html/, { timeout: 10000 });
      expect(await inventoryPage.isInventoryPageLoaded()).toBe(true);
    });
  });

  test('should successfully login with visual_user', async ({ page, loginPage, inventoryPage }) => {
    await step('Perform login with visual_user', async () => {
      await loginPage.login(users.visual.username, users.visual.password);
    });

    await step('Validation: Verify successful login and redirection', async () => {
      await expect(page).toHaveURL(/.*inventory\.html/);
      expect(await inventoryPage.isInventoryPageLoaded()).toBe(true);
    });
  });
});

test.describe('login - negative scenarios', () => {
  test('should show error message for locked_out_user', async ({ page, loginPage }) => {
    await step('Attempt to login with locked_out_user', async () => {
      await loginPage.login(users.lockedOut.username, users.lockedOut.password);
    });

    await step('Validation: Verify error message and user remains on login page', async () => {
      expect(await loginPage.isErrorMessageVisible()).toBe(true);
      const errorText = await loginPage.getErrorMessage();
      expect(errorText).toContain(errorMessages.lockedOutUser);
      await expect(page).toHaveURL(/.*saucedemo\.com\/?$/);

      const screenshot = await page.screenshot();
      await attachment('Locked Out Error Evidence', screenshot, 'image/png');
    });
  });

  test('should show error message for invalid credentials', async ({ loginPage }) => {
    await step('Attempt to login with invalid credentials', async () => {
      await loginPage.login('invalid_user', 'invalid_password');
    });

    await step('Validation: Verify error message is correct', async () => {
      expect(await loginPage.isErrorMessageVisible()).toBe(true);
      const errorText = await loginPage.getErrorMessage();
      expect(errorText).toContain(errorMessages.invalidCredentials);
    });
  });

  test('should show error message when fields are empty', async ({ loginPage }) => {
    await step('Attempt to login with empty username', async () => {
      await loginPage.login('', users.standard.password);
      expect(await loginPage.getErrorMessage()).toContain(errorMessages.usernameRequired);
    });

    await step('Attempt to login with empty password', async () => {
      await loginPage.login(users.standard.username, '');
      expect(await loginPage.getErrorMessage()).toContain(errorMessages.passwordRequired);
    });

    await step('Attempt to login with both fields empty', async () => {
      await loginPage.login('', '');
      expect(await loginPage.getErrorMessage()).toContain(errorMessages.usernameRequired);
    });
  });

  test('should login with problem_user (Verified Defect: Broken Images/Inputs)', async ({
    page,
    loginPage,
    inventoryPage,
  }) => {
    await step('Perform login with problem_user', async () => {
      await loginPage.login(users.problem.username, users.problem.password);
    });

    await step('Validation: Verify successful login and redirection', async () => {
      await expect(page).toHaveURL(/.*inventory\.html/);
      expect(await inventoryPage.isInventoryPageLoaded()).toBe(true);

      const screenshot = await page.screenshot();
      await attachment('Problem User Login (Defect State)', screenshot, 'image/png');
    });
  });

  test('should login with error_user (Verified Defect: Throws errors on actions)', async ({
    page,
    loginPage,
    inventoryPage,
  }) => {
    await step('Perform login with error_user', async () => {
      await loginPage.login(users.error.username, users.error.password);
    });

    await step('Validation: Verify successful login and redirection', async () => {
      await expect(page).toHaveURL(/.*inventory\.html/);
      expect(await inventoryPage.isInventoryPageLoaded()).toBe(true);
    });
  });
});
