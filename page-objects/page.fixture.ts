import { test as base } from '@playwright/test';
import LoginPage from './pages/login.page';
import SecurePage from './pages/secure.page';

export type PageObjects = {
    loginPage: LoginPage;
    securePage: SecurePage;
};

export const test = base.extend<PageObjects>({
    loginPage: async ({ page }, use) => {
        const loginPage = new LoginPage(page);
        await use(loginPage);
    },
    securePage: async ({ page }, use) => {
        const securePage = new SecurePage(page);
        await use(securePage);
    }
});

export { expect, Page, Locator, Response } from '@playwright/test';
