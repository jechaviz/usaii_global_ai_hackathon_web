const { test, expect } = require('@playwright/test');

test('coach workspace renders and recalculates', async ({ page }) => {
  await page.goto('http://127.0.0.1:4197/');
  await expect(page.getByRole('heading', { name: 'AI Study-to-Work Coach' })).toBeVisible();
  await expect(page.getByText('Career readiness copilot for scholarship and internship prep')).toBeVisible();

  const scoreBefore = await page.locator('.score-badge').innerText();
  await page.locator('input[type="range"]').nth(2).evaluate((slider) => {
    slider.value = '92';
    slider.dispatchEvent(new Event('input', { bubbles: true }));
  });
  await expect(page.locator('.score-badge')).not.toHaveText(scoreBefore);

  await page.getByRole('button', { name: /Plan/i }).click();
  await expect(page.getByText('Four-Week Plan')).toBeVisible();

  await page.getByRole('button', { name: 'Judge', exact: true }).click();
  await expect(page.getByText('Undergraduate rubric defense')).toBeVisible();
  await expect(page.locator('.judge-panel').getByText('Decision delta')).toBeVisible();
  await page.screenshot({ path: 'out/usaii-demo-desktop.png', fullPage: true });

  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole('button', { name: 'Packet', exact: true }).click();
  await expect(page.getByText('Submission Packet')).toBeVisible();
  await page.screenshot({ path: 'out/usaii-demo-mobile.png', fullPage: true });
});
