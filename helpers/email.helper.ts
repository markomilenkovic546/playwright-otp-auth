import { Page } from '@playwright/test';
import { Mailsac } from '@mailsac/api';
const mailsac = new Mailsac({
    headers: { 'Mailsac-Key': process.env.MAILSAC_API_KEY }
});

export default class EmailHelper {
    constructor(private page: Page) {}
    /**
     * Retrieves the message ID of an OTP email sent to a given inbox.
     *
     * @param email - The email address to check for incoming OTP messages.
     * @param attempts - The number of retry attempts if the email hasn't arrived yet. Defaults to 3.
     * @returns The message ID of the OTP email.
     * @throws If the email is not received within the given attempts,
     *         if the message ID is missing, or if the fetch request fails.
     *
     */
    async getMessageId(email: string, attempts: number = 3): Promise<string> {
        if (attempts === 0) {
            throw new Error('Email is not received');
        }

        // Wait a bit to allow the email to arrive
        await this.page.waitForTimeout(2000);

        try {
            // Fetch list of messages from the Mailsac inbox
            const response = await mailsac.messages.listMessages(email);

            if (response.status === 200) {
                const body = response.data;

                // Expect the OTP message to be the first (and only) message in a fresh inbox
                if (body.length > 0 && body[0].subject === 'Your OTP Code') {
                    const messageId = body[0]?._id;

                    if (messageId) {
                        return messageId;
                    } else {
                        throw new Error('Message ID not found');
                    }
                } else {
                    // Retry if the message hasn't arrived yet
                    return await this.getMessageId(email, attempts - 1);
                }
            } else {
                // Handle non-success HTTP status codes
                throw new Error(`Failed to fetch: ${response.status}`);
            }
        } catch (error) {
            // Log the error and rethrow to let the caller handle it
            console.error(error);
            throw error;
        }
    }

    /**
     * Retrieves the OTP (One-Time Password) from the plain text body of an email message.
     *
     * This method uses the `@mailsac/api` package to call the Mailsac API and get
     * the plain text body of an email, based on the provided email address and message ID.
     *
     * It assumes that the body contains a specific string format like: "Your OTP code is 123456".
     * The method uses a regular expression to extract and return the 6-digit OTP.
     *
     * @param email - The target email address (inbox) used to receive the OTP message.
     * @param messageId - The ID of the email message to fetch the plain text from.
     * @returns The extracted 6-digit OTP from the email body.
     * @throws If the API request fails, the email body is invalid, or the OTP cannot be extracted.
     */
    async getOtp(email: string, messageId: string): Promise<string> {
        try {
            // Fetch the plain text body of the email using the Mailsac API wrapper method
            const response = await mailsac.messages.getBodyPlainText(email, messageId);

            // Check if the API call was successful
            if (response.status === 200) {
                const body = response.data;

                // Validate that the body is a proper string
                if (!body || typeof body !== 'string') {
                    throw new Error('Received invalid body data');
                }

                // Use regex to extract the OTP code from the email body
                const otpRegex = /Your OTP code is (\d{6})/;
                const match = body.match(otpRegex);

                // If a match is found, return the OTP
                if (match) {
                    return match[1];
                } else {
                    // Throw an error if the OTP string is not found in the body
                    throw new Error('Otp extraction failed');
                }
            } else {
                // Handle unsuccessful API responses
                throw new Error(`Failed to fetch: ${response.status}`);
            }
        } catch (error) {
            // Log the error and rethrow to let the caller handle it
            console.error(error);
            throw error;
        }
    }
}
