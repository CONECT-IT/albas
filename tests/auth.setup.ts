import { test as setup, expect } from '@playwright/test';
import { resolve } from 'path';
import { mkdirSync, existsSync } from 'fs';

const authDir = resolve('./tests/.auth');

// Crear directorio de autenticación si no existe
if (!existsSync(authDir)) {
  mkdirSync(authDir, { recursive: true });
}

setup('autenticar como admin', async ({ page }) => {
  const adminAuthFile = resolve(authDir, 'admin.json');

  await page.goto('/');
  await page.waitForLoadState('networkidle');

  // Esperar formulario de login
  await page.locator('input[type="password"]').waitFor({ state: 'visible', timeout: 10000 });
  await page.waitForTimeout(500);

  // Login como admin
  await page.fill('input[placeholder*="usuario" i], input[type="text"]', 'admin1');
  await page.fill('input[type="password"]', 'pass123');
  await page.click('button[type="submit"]');

  // Esperar redirección al dashboard admin
  await page.waitForURL('/admin');
  await page.locator('h1').waitFor({ state: 'visible', timeout: 10000 });

  // Guardar estado de autenticación
  await page.context().storageState({ path: adminAuthFile });
});

setup('autenticar como asesor', async ({ page }) => {
  const asesorAuthFile = resolve(authDir, 'asesor.json');

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Esperar formulario de login
    await page.locator('input[type="password"]').waitFor({ state: 'visible', timeout: 10000 });
    await page.waitForTimeout(500);

    // Login como asesor (usando nombre de usuario de datos sembrados)
    await page.fill('input[placeholder*="usuario" i], input[type="text"]', 'asesor1');
    await page.fill('input[type="password"]', 'pass123');
    await page.click('button[type="submit"]');
    
    // Esperar redirección al dashboard asesor
    await page.waitForURL('/asesor');
    await page.locator('text=Captación').waitFor({ state: 'visible', timeout: 10000 });
    
    // Guardar estado de autenticación
    await page.context().storageState({ path: asesorAuthFile });
});
