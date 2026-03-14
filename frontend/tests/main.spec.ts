import { test, expect } from '@playwright/test';

test.describe('TodoList App', () => {
  test('Création d’un projet', async ({ page }) => {
    const projectName = `Projet E2E ${Date.now()}`;

    await page.goto('http://localhost:5173');

    await page.getByPlaceholder('Username').fill('test');
    await page.getByPlaceholder('Password').fill('test');
    await page.getByRole('button', { name: 'Login' }).click();

    await expect(page.getByRole('heading', { name: 'Projects' })).toBeVisible();

    await page.getByPlaceholder('Nom du projet').fill(projectName);
    await page.getByPlaceholder('Description').fill('Projet créé par Playwright');
    await page.getByRole('button', { name: 'Créer le projet' }).click();

    await expect(page.getByText(projectName)).toBeVisible();
  });
});