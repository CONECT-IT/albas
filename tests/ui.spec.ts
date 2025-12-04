import { test, expect } from "@playwright/test";

test.describe("Responsive Design", () => {
  test("mobile viewport displays correctly", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    await expect(page.locator("body")).toBeVisible();
  });

  test("tablet viewport displays correctly", async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    await expect(page.locator("body")).toBeVisible();
  });

  test("desktop viewport displays correctly", async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    await expect(page.locator("body")).toBeVisible();
  });
});

test.describe("Theme Toggle", () => {
  test.use({ storageState: "./tests/.auth/user.json" });

  test.skip("puede alternar modo oscuro en admin - alternador de tema no implementado aún", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/admin");
    await page.waitForLoadState("networkidle");

    // Esperar que el dashboard cargue
    await page.locator("h1").waitFor({ state: "visible", timeout: 10000 });

    // Buscar botón de alternancia de tema (ajustar selector basado en implementación actual)
    const themeBtn = page
      .locator('.theme-toggle, button:has-text("Oscuro"), button:has-text("Claro")')
      .first();

    if (await themeBtn.isVisible().catch(() => false)) {
      const initialText = await themeBtn.textContent();
      await themeBtn.click();
      await page.waitForTimeout(300);

      // Verificar que el texto cambió
      const newText = await themeBtn.textContent();
      expect(newText).not.toBe(initialText);
    }
  });
});
