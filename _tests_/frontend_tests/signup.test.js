const { Builder, By, Key, until } = require('selenium-webdriver');
const assert = require('assert');

describe('Signup Flow', function() {
  let driver;

  before(async function() {
    driver = await new Builder().forBrowser('MicrosoftEdge').build();
  });

  after(async function() {
    await driver.quit();
  });

  it('should load signup form', async function() {
    await driver.get('http://localhost:3000/signup');
    const title = await driver.getTitle();
    assert.strictEqual(title, 'Sign Up');
  });

  it('should validate signup form', async function() {
    await driver.findElement(By.id('userName')).sendKeys('testuser');
    await driver.findElement(By.id('email')).sendKeys('invalidemail');
    await driver.findElement(By.id('password')).sendKeys('password');
    await driver.findElement(By.id('confirmPassword')).sendKeys('password');
    await driver.findElement(By.id('signupButton')).click();
    const errorMessages = await driver.findElements(By.className('alert-danger'));
    assert.strictEqual(errorMessages.length, 1);
  });

  it('should allow successful signup', async function() {
    await driver.findElement(By.id('userName')).sendKeys('testuser');
    await driver.findElement(By.id('email')).sendKeys('testuser@example.com');
    await driver.findElement(By.id('password')).sendKeys('password');
    await driver.findElement(By.id('confirmPassword')).sendKeys('password');
    await driver.findElement(By.id('signupButton')).click();
    const successMessage = await driver.findElement(By.className('alert-success'));
    assert.ok(await successMessage.isDisplayed());
  });
});
