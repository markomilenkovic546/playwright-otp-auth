import type { Locator, Page } from '@playwright/test';
import BasePage from './base.page';

export default class LoginPage extends BasePage {
    readonly path: string = '/otp-login';
    readonly emailField: Locator;
    readonly submitEmailBtn: Locator;
    readonly otpStatusMessage: Locator;
    readonly otpField: Locator;
    readonly verifyOtpBtn: Locator;

    /**
     * Creates an instance of the LoginPage class.
     * Initializes locators for the page elements.
     *
     * @param page - The Playwright Page object used for interaction with the page.
     */
    constructor(page: Page) {
        super(page); // pass the page to the base class constructor
        this.emailField = page.locator('#email');
        this.submitEmailBtn = page.locator('#btn-send-otp');
        this.otpStatusMessage = page.locator('#otp-message');
        this.otpField = page.locator('#otp');
        this.verifyOtpBtn = page.locator('#btn-send-verify');
    }

    /**
     * Opens the login page by navigating to the specified URL.
     * The URL is constructed using the base URL from the environment variable.
     */
    async open() {
        await super.open(this.path);
    }

    /**
     * Enters the provided email address into the email input field.
     *
     * @param email - The email address to enter in the field.
     */
    async enterEmail(email: string) {
        await this.emailField.waitFor({ state: 'visible', timeout: 5000 });
        await this.emailField.fill(email);
    }

    /**
     * Clicks the button to submit the entered email and request the OTP.
     */
    async submitEmail() {
        await this.submitEmailBtn.click();
    }

    /**
     * Enters the provided OTP into the OTP input field.
     * Waits for the OTP field to be visible before filling it.
     *
     * @param otp - The OTP to enter in the field.
     */
    async enterOtp(otp: string) {
        await this.otpField.waitFor({ state: 'visible', timeout: 5000 });
        await this.otpField.fill(otp);
    }

    /**
     * Clicks the button to submit the entered OTP and verify it.
     */
    async submitOtpToVerify() {
        await this.verifyOtpBtn.click();
    }
}
