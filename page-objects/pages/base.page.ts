import type { Locator, Page } from "@playwright/test";

export default abstract class BasePage {
  constructor(readonly page: Page) {}

  async open(path: string) {
    await this.page.goto(path);
  }
}
