import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const pages = [
  '/', '/how-it-works', '/care-options', '/areas', '/areas/sample-city-1', '/areas/sample-city-2',
  '/resources', '/resources/cost-calculator', '/resources/va-aid-and-attendance', '/about', '/contact',
  '/care-match', '/privacy', '/accessibility', '/404',
];

async function axe(page: Page) {
  const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']).analyze();
  return results.violations
    .filter((v) => v.impact === 'serious' || v.impact === 'critical')
    .map((v) => `${v.id} (${v.impact}): ${v.nodes.slice(0, 3).map((n) => n.target.join(' ')).join(' | ')}`);
}

const horizontalOverflow = (page: Page) =>
  page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);

for (const path of pages) {
  test(`a11y + layout: ${path}`, async ({ page }) => {
    await page.goto(path);
    expect(await page.locator('h1').count(), 'exactly one h1').toBe(1);
    expect(await axe(page)).toEqual([]);
    expect(await horizontalOverflow(page), 'no horizontal scroll').toBeLessThanOrEqual(0);
  });

  test(`a11y at A++ text size: ${path}`, async ({ page }) => {
    await page.goto(path);
    await page.getByRole('button', { name: 'Largest text size' }).click();
    expect(await axe(page)).toEqual([]);
    expect(await horizontalOverflow(page), 'no horizontal scroll at A++').toBeLessThanOrEqual(0);
  });
}

test('every internal link resolves', async ({ page, request }) => {
  const seen = new Set<string>();
  for (const path of pages) {
    await page.goto(path);
    const hrefs = await page.$$eval('a[href]', (as) => as.map((a) => a.getAttribute('href')!));
    for (const href of hrefs) {
      expect(href, `empty or # link on ${path}`).not.toMatch(/^#?$/);
      if (!href.startsWith('/')) continue;
      const clean = href.split('#')[0].split('?')[0];
      if (seen.has(clean)) continue;
      seen.add(clean);
      const res = await request.get(clean);
      expect(res.status(), `${clean} linked from ${path}`).toBe(200);
    }
  }
});

test('text size persists across pages', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Larger text size' }).click();
  await expect(page.locator('html')).toHaveAttribute('data-text-size', '1');
  await page.goto('/about');
  await expect(page.locator('html')).toHaveAttribute('data-text-size', '1');
  await expect(page.getByRole('button', { name: 'Larger text size' })).toHaveAttribute('aria-pressed', 'true');
});

const branches: [string, string[], string][] = [
  ['diagnosed dementia', ['My mom', 'Some help: meds, bathing, meals', 'Diagnosed dementia or Alzheimer’s', 'In 1–3 months'], 'Memory Care'],
  ['wandering beats nursing', ['My dad', '24-hour nursing or medical care', 'Wandering or safety worries', 'As soon as possible'], 'Memory Care'],
  ['24-hour nursing', ['Myself', '24-hour nursing or medical care', 'Some forgetfulness', 'Just researching'], 'Long-Term Care'],
  ['little help, no concerns', ['My spouse or partner', 'Little or none', 'No concerns', 'In 3+ months'], 'Independent or Assisted Living'],
  ['default', ['Someone else', 'A lot of hands-on help', 'No concerns', 'In 1–3 months'], 'Assisted Living'],
];
for (const [name, picks, expected] of branches) {
  test(`care match -> ${expected} (${name})`, async ({ page }) => {
    await page.goto('/care-match');
    await page.getByRole('button', { name: 'Start my Care Match' }).click();
    for (const pick of picks) await page.getByRole('button', { name: pick, exact: true }).click();
    await expect(page.locator('[data-result-title]')).toHaveText(expected);
    await expect(page.locator('input[name="care_match_result"]')).toHaveValue(expected);
    await expect(page.locator('input[name="answer_when"]')).toHaveValue(picks[3]);
  });
}

test('care match back button and lead form', async ({ page }) => {
  await page.goto('/care-match');
  await page.getByRole('button', { name: 'Start my Care Match' }).click();
  await page.getByRole('button', { name: 'My mom' }).click();
  await expect(page.getByText('Question 2 of 4')).toBeVisible();
  await page.getByRole('button', { name: '← Back' }).click();
  await expect(page.getByText('Question 1 of 4')).toBeVisible();
  for (const pick of ['My mom', 'Little or none', 'No concerns', 'Just researching']) {
    await page.getByRole('button', { name: pick, exact: true }).click();
  }
  await page.getByRole('button', { name: 'Get my free shortlist' }).click();
  await expect(page.locator('#q-name-error')).not.toBeEmpty();
  await expect(page.locator('#q-name')).toBeFocused();
  await page.locator('#q-name').fill('Pat');
  await page.locator('#q-phone').fill('(555) 123-4567');
  await page.locator('#q-zip').fill('123');
  await page.getByRole('button', { name: 'Get my free shortlist' }).click();
  await expect(page.locator('#q-zip-error')).toContainText('5-digit');
  await page.locator('#q-zip').fill('12345');
  await page.getByRole('button', { name: 'Get my free shortlist' }).click();
  await expect(page.locator('#quiz-success')).toBeVisible();
});

test('homepage callback form: validation, pills, success', async ({ page }) => {
  await page.goto('/');
  const form = page.locator('form[data-lead-form="callback"]');
  const submit = form.getByRole('button', { name: 'Request my free call' });
  await submit.click();
  await expect(page.locator('#cb-name-error')).toContainText('first name');
  await expect(page.locator('#cb-name')).toHaveAttribute('aria-invalid', 'true');
  await page.locator('#cb-name').fill('Sam');
  await page.locator('#cb-phone').fill('12');
  await submit.click();
  await expect(page.locator('#cb-phone-error')).toContainText('area code');
  await page.locator('#cb-phone').fill('555.123.4567');
  await form.getByRole('button', { name: 'Evening' }).click();
  await expect(form.getByRole('button', { name: 'Evening' })).toHaveAttribute('aria-pressed', 'true');
  await submit.click();
  await expect(page.locator('#callback-success')).toBeVisible();
  await expect(page.locator('#callback-success')).toContainText('call you in the evening');
  await page.getByRole('button', { name: '← Back to the form' }).click();
  await expect(form).toBeVisible();
  await expect(form.getByRole('button', { name: 'Morning' })).toHaveAttribute('aria-pressed', 'true');
});

test('resources topic filters', async ({ page }) => {
  await page.goto('/resources');
  const visible = page.locator('[data-article-list] > li:visible');
  await expect(visible).toHaveCount(6);
  await page.getByRole('button', { name: 'Paying for care' }).click();
  await expect(visible).toHaveCount(2);
  await expect(page.locator('[data-filter-status]')).toContainText('2 articles');
  await page.getByRole('button', { name: 'Touring & choosing' }).click();
  await expect(visible).toHaveCount(0);
  await expect(page.locator('[data-filter-empty]')).toBeVisible();
  await page.goto('/resources?topic=memory-care');
  await expect(visible).toHaveCount(1);
});

test('cost calculator adds up', async ({ page }) => {
  await page.goto('/resources/cost-calculator');
  await page.getByLabel('Mortgage or rent').fill('2000');
  await page.getByLabel('Hours per week').fill('10');
  await page.getByLabel('Hourly rate').fill('30');
  await page.getByLabel('Monthly fee (rent, meals, activities)').fill('3000');
  await expect(page.locator('[data-out="home"]')).toHaveText('$3,300');
  await expect(page.locator('[data-out="diff"]')).toContainText('$300 less');
});

test('device detection labels the page', async ({ page }, info) => {
  await page.goto('/');
  const html = page.locator('html');
  if (info.project.name === 'mobile') {
    await expect(html).toHaveAttribute('data-device', 'phone');
    await expect(html).toHaveAttribute('data-input', 'touch');
  } else {
    await expect(html).toHaveAttribute('data-device', 'desktop');
    await expect(html).toHaveAttribute('data-input', 'pointer');
  }
  await page.setViewportSize({ width: 900, height: 1200 });
  await expect(html).toHaveAttribute('data-device', 'tablet');
});

test('menu items open their own pages, and the header fits on one row', async ({ page }, info) => {
  await page.goto('/');
  const hrefs = await page.locator('#main-nav a').evaluateAll((as) => as.map((a) => a.getAttribute('href')));
  expect(hrefs.length).toBeGreaterThan(4);
  for (const h of hrefs) {
    expect(h, 'menu links go to pages, not #sections').toMatch(/^\/[a-z-]+$/);
  }
  if (info.project.name === 'desktop') {
    const header = page.locator('.site-header');
    await expect(header).toHaveAttribute('data-nav', 'bar');
    const [brand, nav] = await Promise.all([page.locator('.brand').boundingBox(), page.locator('#main-nav').boundingBox()]);
    expect(Math.abs(brand!.y + brand!.height / 2 - (nav!.y + nav!.height / 2))).toBeLessThan(6);
  }
});

for (const path of pages.filter((p) => p !== '/404')) {
  test(`sections line up with the header logo: ${path}`, async ({ page }) => {
    await page.goto(path);
    const off = await page.evaluate(() => {
      const logo = Math.round(document.querySelector('.site-header .brand')!.getBoundingClientRect().left);
      const bad: string[] = [];
      document.querySelectorAll('main .container-site, footer .container-site').forEach((c) => {
        if (c.closest('.text-center, [data-centered]')) return; // deliberately centred layouts
        const first = [...c.children].find((e) => e.getBoundingClientRect().width > 0);
        if (first && Math.abs(Math.round(first.getBoundingClientRect().left) - logo) > 2) bad.push(c.outerHTML.slice(0, 80));
      });
      return bad;
    });
    expect(off).toEqual([]);
  });
}

test('skip link moves focus to main', async ({ page }) => {
  await page.goto('/how-it-works');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Skip to main content' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/#main$/);
});
