import { test, expect } from "@playwright/test";

test.describe("Admin Dashboard", () => {
  test.use({ storageState: "./tests/.auth/admin.json" });

  test("can access admin dashboard when authenticated", async ({ page }) => {
    await page.goto("/admin");
    await page.waitForLoadState("networkidle");

    // Verificar que el dashboard se carga
    await expect(page.locator("h1")).toContainText("Dashboard");
  });

  test("can navigate to asesores section", async ({ page }) => {
    await page.goto("/admin");
    await page.waitForLoadState("networkidle");

    // Hacer clic en el enlace de asesores
    await page.locator("text=asesores").click();
    await page.waitForURL("/admin/asesores");

    // Verificar que estamos en la página de asesores
    await expect(page).toHaveURL("/admin/asesores");
  });

  test("can navigate to leads section", async ({ page }) => {
    await page.goto("/admin");
    await page.waitForLoadState("networkidle");

    // Hacer clic en el enlace de leads
    await page.locator("text=leads").click();
    await page.waitForURL("/admin/leads");

    // Verificar que estamos en la página de leads
    await expect(page).toHaveURL("/admin/leads");
  });

  test("can navigate to ventas section", async ({ page }) => {
    await page.goto("/admin");
    await page.waitForLoadState("networkidle");

    // Hacer clic en el enlace de ventas
    await page.locator("text=ventas").click();
    await page.waitForURL("/admin/ventas");

    // Verificar que estamos en la página de ventas
    await expect(page).toHaveURL("/admin/ventas");
  });

  test("can navigate to landing section", async ({ page }) => {
    await page.goto("/admin");
    await page.waitForLoadState("networkidle");

    // Hacer clic en el enlace de landing
    await page.locator("text=landing").click();
    await page.waitForURL("/admin/landing");

    // Verificar que estamos en la página de landing
    await expect(page).toHaveURL("/admin/landing");
  });
});
