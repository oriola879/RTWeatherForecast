const { Builder, By, Key, until } = require('selenium-webdriver');
const MicrosoftEdge = require('selenium-webdriver/chrome');
const expect = require('chai').expect;

// Set up MicrosoftEdge options (optional)
const options = new MicrosoftEdge.Options();
options.addArguments('--headless'); // Run MicrosoftEdge headlessly (without opening GUI)

describe('Integration Test for index.ejs', () => {
  let driver;

  beforeAll(async () => {
    driver = await new Builder()
      .forBrowser('MicrosoftEdge')
      .setChromeOptions(options)
      .build();
  });

  afterAll(async () => {
    await driver.quit();
  });

  it('should load index.ejs and display weather update form', async () => {
    try {
      await driver.get('http://localhost:3000/');

      // Example: Check if title contains "Home"
      const title = await driver.findElement(By.css('title')).getText();
      expect(title).to.contain('Home');

      // Example: Check if form elements are present
      const locationInput = await driver.findElement(By.id('location'));
      const submitButton = await driver.findElement(By.css('button[type="submit"]'));

      // Example: Simulate user input and form submission
      await locationInput.sendKeys('New York');
      await submitButton.click();

      // Example: Wait for weather result element to be visible
      await driver.wait(until.elementLocated(By.id('weatherResult')), 5000);
      const weatherResult = await driver.findElement(By.id('weatherResult')).getText();
      expect(weatherResult).to.contain('Weather in: New York');

    } catch (error) {
      console.error('Error during test:', error);
      throw error;
    }
  });
});
