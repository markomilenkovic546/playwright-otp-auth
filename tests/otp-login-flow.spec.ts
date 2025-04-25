import { test, expect } from '../page-objects/page.fixture';
import EmailHelper from '../helpers/email.helper';
import { faker } from '@faker-js/faker';

test.describe('OTP Login Flow', () => {
    let email: string;
    let emailHelper: EmailHelper;

    test.beforeEach(async ({ page, loginPage }) => {
        email = faker.internet.username() + '@mailsac.com';
        emailHelper = new EmailHelper(page);

        await loginPage.open();
        await expect(page).toHaveURL(/otp-login/, { timeout: 10000 });
    });

    test('User should be able to log in with valid email and OTP', async ({ page, loginPage, securePage }) => {
        await test.step('Enter email in the email field', async () => {
            await loginPage.enterEmail(email);
            await expect(loginPage.emailField).toHaveValue(email);
        });

        await test.step('Submit email', async () => {
            await loginPage.submitEmail();
            await expect(loginPage.otpStatusMessage).toContainText("We've sent an OTP code to your email");
        });

        await test.step('Get OTP from email and enter it', async () => {
            const messageId = await emailHelper.getMessageId(email);
            const otp = await emailHelper.getOtp(email, messageId);
            await loginPage.enterOtp(otp);
        });

        await test.step('Submit OTP', async () => {
            await loginPage.submitOtpToVerify();
            await expect(page).toHaveURL(/secure/, { timeout: 10000 });
            await expect(securePage.successMessage).toContainText('You logged into a secure area!');
        });
    });

    test('User should not be able to log in with invalid OTP', async ({ page, loginPage, securePage }) => {
        await test.step('Enter email in the email field', async () => {
            await loginPage.enterEmail(email);
            await expect(loginPage.emailField).toHaveValue(email);
        });

        await test.step('Submit email', async () => {
            await loginPage.submitEmail();
            await expect(loginPage.otpStatusMessage).toContainText("We've sent an OTP code to your email");
        });

        await test.step('Enter invalid OTP', async () => {
            await loginPage.enterOtp('111111');
            await expect(loginPage.otpField).toHaveValue('111111');
        });

        await test.step('Submit OTP', async () => {
            await loginPage.submitOtpToVerify();
            await expect(page).toHaveURL(/otp-login/, { timeout: 10000 });
            await expect(loginPage.otpStatusMessage).toContainText(
                'The provided OTP code is incorrect. Please check your code and try again.'
            );
        });
    });

    test('User should not be able to log in with already used OTP', async ({ page, loginPage, securePage }) => {
        let otp: string;
        await test.step('Enter email in the email field', async () => {
            await loginPage.enterEmail(email);
            await expect(loginPage.emailField).toHaveValue(email);
        });

        await test.step('Submit email', async () => {
            await loginPage.submitEmail();
            await expect(loginPage.otpStatusMessage).toContainText("We've sent an OTP code to your email");
        });

        await test.step('Get OTP from email and enter it', async () => {
            const messageId = await emailHelper.getMessageId(email);
            otp = await emailHelper.getOtp(email, messageId);
            await loginPage.enterOtp(otp);
        });

        await test.step('Submit OTP', async () => {
            await loginPage.submitOtpToVerify();
            await expect(page).toHaveURL(/secure/, { timeout: 10000 });
            await expect(securePage.successMessage).toContainText('You logged into a secure area!');
        });

        await test.step('Logout', async () => {
            await securePage.logout();
            await expect(page).toHaveURL(/login/, { timeout: 10000 });
        });

        await test.step('Open otp-login page', async () => {
            await loginPage.open();
            await expect(page).toHaveURL(/otp-login/, { timeout: 10000 });
        });

        await test.step('Enter email in the email field', async () => {
            await loginPage.enterEmail(email);
            await expect(loginPage.emailField).toHaveValue(email);
        });

        await test.step('Submit email', async () => {
            await loginPage.submitEmail();
            await expect(loginPage.otpStatusMessage).toContainText("We've sent an OTP code to your email");
        });

        await test.step('Enter already used OTP', async () => {
            await loginPage.enterOtp(otp);
        });

        await test.step('Submit already used OTP', async () => {
            await loginPage.submitOtpToVerify();
            await expect(page).toHaveURL(/otp-login/, { timeout: 10000 });
            await expect(loginPage.otpStatusMessage).toContainText(
                'The provided OTP code is incorrect. Please check your code and try again.'
            );
        });
    });
});
