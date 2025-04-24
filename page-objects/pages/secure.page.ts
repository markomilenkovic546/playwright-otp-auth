import type { Locator, Page } from '@playwright/test';

/**
 * Represents the secure page a user is redirected to after successful login
 * using a verified OTP code.
 */
export default class SecurePage {
    /**
     * Locator for the success message displayed on the secure page.
     * Used to confirm a successful login.
     */
    readonly successMessage: Locator;

    /**
     * Initializes the SecurePage with a reference to the Playwright Page object.
     *
     * @param page - The Playwright Page object used for interacting with the page.
     */
    constructor(readonly page: Page) {
        this.successMessage = page.locator('#flash');
    }
}
