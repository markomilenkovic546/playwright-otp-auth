# 🔐 OTP Authentication Testing with Playwright & Mailsac API

This project demonstrates automated testing of OTP (One-Time Password) authentication using [Playwright](https://playwright.dev/) with an efficient and programmable approach to accessing email inbox content via the Mailsac API.

Instead of interacting with the inbox through a web UI, this approach leverages Mailsac's API to fetch OTP codes quickly and reliably using the `mailsac-typescript-api` wrapper.

---

## ✨ Features

- ✅ Automated OTP login flow using Playwright
- ✅ Access OTP from email inbox using API (no UI interaction)
- ✅ Uses [`mailsac-typescript-api`](https://www.npmjs.com/package/mailsac-typescript-api) for structured API communication
- ✅ Random test email generation using `faker.js`
- ✅ Clean test architecture using the Page Object Model (POM) pattern
- ✅ Custom `EmailHelper` class to interact with Mailsac API and extract OTP
- ✅ Custom Playwright fixtures to inject page objects into the tests


---

## 📬 How Mailsac Works

Mailsac allows public email inbox access for any address under the `@mailsac.com` domain.  
This means you can send emails to **any email like `randomusername@mailsac.com`**, and it will be accessible via their API without any special configuration.


---

## 🔧 Technologies Used

- **playwright/test** – Testing framework
- **faker.js** – Generates random test emails
- **Mailsac** – Email sandbox for test inboxes
- **mailsac-typescript-api** – Typed wrapper for Mailsac API
- **dotenv** – For managing environment variables

---

## 🔑 Environment Setup

1. [Create a free Mailsac account](https://mailsac.com)
2. Generate your **Mailsac API Key**
3. Create a `.env` file in the root directory of the project with the following variables:

```env
MAILSAC_API_BASE_URL=https://mailsac.com/api
MAILSAC_API_KEY=<your mailsac api key>
```

## Running Locally

Clone project locally

Install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

Run tests:

```bash
npm run e2e
# or
yarn e2e
# or
pnpm e2e
```
