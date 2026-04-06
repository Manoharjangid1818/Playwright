import { test, expect } from '@playwright/test';

test('Login + Add to Cart Flow', async ({ page }) => {

  await page.goto('https://automationexercise.com/');

  await expect(page).toHaveTitle(/Automation Exercise/);

  await page.getByRole('link', { name: 'Signup / Login' }).click();

  // ✅ Direct values (fix for your error)
  await page.locator('input[data-qa="login-email"]').fill('manoharrajotiya@gmail.com');
  await page.locator('input[data-qa="login-password"]').fill('6353843900');

  await page.locator('button[data-qa="login-button"]').click();

  await expect(page.getByText('Logged in as')).toBeVisible();

  await page.getByRole('link', { name: 'Products' }).click();

  await expect(page).toHaveURL(/products/);

  // ✅ Fix strict mode
  await page.locator('.features_items a.add-to-cart').first().click();

  // ✅ Popup handling
  await page.getByRole('link', { name: 'View Cart' }).click();

  await expect(page.getByText('Shopping Cart')).toBeVisible();

});