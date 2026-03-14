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

  test('Création d’une tâche sur un projet', async ({ page }) => {
    const projectName = `Projet Tâches E2E ${Date.now()}`;
    const taskName = `Tâche E2E ${Date.now()}`;

    await page.goto('http://localhost:5173');

    await page.getByPlaceholder('Username').fill('test');
    await page.getByPlaceholder('Password').fill('test');
    await page.getByRole('button', { name: 'Login' }).click();

    await expect(page.getByRole('heading', { name: 'Projects' })).toBeVisible();

    await page.getByPlaceholder('Nom du projet').fill(projectName);
    await page.getByPlaceholder('Description').fill('Projet pour test de création de tâche');
    await page.getByRole('button', { name: 'Créer le projet' }).click();

    await expect(page.getByText(projectName)).toBeVisible();

    await page.getByText(projectName).first().click();

    await page.getByPlaceholder('New task').fill(taskName);
    await page.getByRole('button', { name: 'Ajouter' }).click();

    await expect(page.getByText(`${taskName} (OPEN)`)).toBeVisible();
  });

  test('Marquer la tâche comme terminée', async ({ page }) => {
    const projectName = `Projet Close Task E2E ${Date.now()}`;
    const taskName = `Tâche Close E2E ${Date.now()}`;

    await page.goto('http://localhost:5173');

    await page.getByPlaceholder('Username').fill('test');
    await page.getByPlaceholder('Password').fill('test');
    await page.getByRole('button', { name: 'Login' }).click();

    await expect(page.getByRole('heading', { name: 'Projects' })).toBeVisible();

    await page.getByPlaceholder('Nom du projet').fill(projectName);
    await page.getByPlaceholder('Description').fill('Projet pour test fermeture de tâche');
    await page.getByRole('button', { name: 'Créer le projet' }).click();

    await expect(page.getByText(projectName)).toBeVisible();
    await page.getByText(projectName).first().click();

    await page.getByPlaceholder('New task').fill(taskName);
    await page.getByRole('button', { name: 'Ajouter' }).click();

    await expect(page.getByText(`${taskName} (OPEN)`)).toBeVisible();

    const createdTaskRow = page.locator('.item').filter({ hasText: taskName }).first();
    await createdTaskRow.getByRole('button', { name: 'Close task' }).click();

    await expect(page.getByText(`${taskName} (CLOSED)`)).toBeVisible();
  });
});