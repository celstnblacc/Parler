import { test, expect } from "@playwright/test";

test.describe("Phraser App — Smoke", () => {
  test("dev server responds with 200", async ({ page }) => {
    const response = await page.goto("/");
    expect(response?.status()).toBe(200);
  });

  test("page has valid html structure", async ({ page }) => {
    await page.goto("/");
    const html = await page.content();
    expect(html).toContain("<html");
    expect(html).toContain("<body");
    expect(html).toContain('<div id="root"');
  });

  test("page title is Phraser", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle("Phraser");
  });
});

test.describe("Phraser App — Branding", () => {
  test("no stale Parler references in page source", async ({ page }) => {
    await page.goto("/");
    const html = await page.content();
    expect(html).not.toContain(">Parler<");
    expect(html).not.toContain('"Parler"');
  });
});

test.describe("Phraser App — Frontend Rendering", () => {
  test("root element exists", async ({ page }) => {
    await page.goto("/");
    const root = page.locator("#root");
    await expect(root).toBeAttached();
  });

  test("no console errors on load (excluding Tauri runtime)", async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") {
        errors.push(msg.text());
      }
    });

    await page.goto("/");
    await page.waitForTimeout(1000);

    // Without the Tauri runtime, all backend invoke() calls fail with specific patterns.
    const realErrors = errors.filter(
      (e) =>
        !e.includes("__TAURI__") &&
        !e.includes("tauri") &&
        !e.includes("transformCallback") &&
        !e.includes("reading 'invoke'") &&
        !e.includes("reading 'platform'") &&
        !e.includes("error boundary"),
    );
    expect(realErrors).toEqual([]);
  });

  test("page loads without JavaScript errors (excluding Tauri runtime)", async ({
    page,
  }) => {
    const jsErrors: Error[] = [];
    page.on("pageerror", (error) => {
      if (
        !error.message.includes("__TAURI__") &&
        !error.message.includes("tauri") &&
        !error.message.includes("transformCallback") &&
        !error.message.includes("reading 'platform'")
      ) {
        jsErrors.push(error);
      }
    });

    await page.goto("/");
    await page.waitForTimeout(1000);
    expect(jsErrors).toEqual([]);
  });
});
