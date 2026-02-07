import { test, expect } from '@playwright/test';

test.describe('TodoList App', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000');
  });

  test('ajouter un item', async ({ page }) => {
    // Nom unique pour éviter de valider une "Nouvelle tâche" d'un ancien test
    const taskName = `Task-${Math.random().toString(36).substring(7)}`;
    await page.fill('input[placeholder="New Item"]', taskName);
    await page.click('button:has-text("Add Item")');

    const lastItem = page.locator('.item').last();
    await expect(lastItem).toContainText(taskName);
  });

  test('supprimer un item', async ({ page }) => {
    const taskName = `Delete-${Math.random().toString(36).substring(7)}`;

    await page.fill('input[placeholder="New Item"]', taskName);
    await page.click('button:has-text("Add Item")');

    // On cible précisément l'item qu'on vient de créer
    const item = page.locator('.item', { hasText: taskName });
    await item.locator('button[aria-label="Remove Item"]').click();

    // On vérifie qu'il n'existe plus du tout
    await expect(item).toHaveCount(0);
  });

  test('toggle completion', async ({ page }) => {
    const taskName = `Toggle-${Math.random().toString(36).substring(7)}`;

    await page.fill('input[placeholder="New Item"]', taskName);
    await page.click('button:has-text("Add Item")');

    const item = page.locator('.item', { hasText: taskName });
    await item.locator('button[aria-label^="Mark item"]').click();

    // on vérifie que la liste des classes CONTIENT "completed"
    await expect(item).toHaveClass(/.*completed.*/);
  });
});