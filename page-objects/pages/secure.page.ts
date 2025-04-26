import type { Locator, Page } from '@playwright/test';

/**
 * Represents the secure page a user is redirected to after a successful login
 * using a verified OTP code.
 *
 * This class follows the Page Object Model (POM) pattern, encapsulating
 * the UI elements and actions of the secure page.
 */
export default class SecurePage {
    /** Flash message element displayed after successful login */
    readonly successMessage: Locator;

    /** Logout button element that logs the user out of the application */
    readonly logoutButton: Locator;

    /**
     * Initializes the SecurePage with a reference to the Playwright Page object.
     *
     * @param page - The Playwright Page object used for interacting with the page.
     */
    constructor(readonly page: Page) {
        this.successMessage = page.locator('#flash');
        this.logoutButton = page.getByRole('link', { name: 'Logout' });
    }

    /**
     * Clicks the logout link to log the user out of the application.
     * After this action, the user is redirected to the login page.
     */
    async logout(): Promise<void> {
        await this.logoutButton.click();
    }
}
