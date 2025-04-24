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

    test('Successful OTP login', async ({ page, loginPage, securePage }) => {
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
});
