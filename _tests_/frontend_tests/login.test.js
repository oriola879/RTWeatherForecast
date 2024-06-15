// frontend/login.test.js

const { Builder, By, Key, until } = require('selenium-webdriver');
const { expect } = require('chai');

describe('Login Page', function() {
  let driver;

  before(async function() {
    driver = await new Builder().forBrowser('MicrosoftEdge').build();
  });

  after(async function() {
    await driver.quit();
  });

  it('should load the login page', async function() {
    await driver.get('http://localhost:3000/login');

    const title = await driver.getTitle();
    expect(title).to.equal('Log In');
  });

  it('should log in with valid credentials', async function() {
    await driver.get('http://localhost:3000/login');

    await driver.findElement(By.id('email')).sendKeys('test@example.com');
    await driver.findElement(By.id('password')).sendKeys('password123', Key.RETURN);

    await driver.wait(until.urlIs('http://localhost:3000/account'), 10000);
    const currentUrl = await driver.getCurrentUrl();
    expect(currentUrl).to.equal('http://localhost:3000/account');
  });

  it('should display error for invalid login', async function() {
    await driver.get('http://localhost:3000/login');

    await driver.findElement(By.id('email')).sendKeys('invalid@example.com');
    await driver.findElement(By.id('password')).sendKeys('invalidPassword', Key.RETURN);

    const errorMessage = await driver.findElement(By.className('alert-danger')).getText();
    expect(errorMessage).to.contain('Invalid email or password');
  });
});
