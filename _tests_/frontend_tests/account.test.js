const { Builder, By, Key, until } = require('selenium-webdriver');
const assert = require('assert');

describe('Account Management on Edge', function() {
  let driver;

  before(async function() {
    driver = await new Builder().forBrowser('MicrosoftEdge').build();
  });

  after(async function() {
    await driver.quit();
  });

  it('should view account details', async function() {
    await driver.get('http://localhost:3000/account');
    const pageTitle = await driver.getTitle();
    assert.strictEqual(pageTitle, 'Account');
    
    const usernameElement = await driver.findElement(By.id('username'));
    const usernameText = await usernameElement.getText();
    assert.strictEqual(usernameText, 'testuser');
    
    const emailElement = await driver.findElement(By.id('email'));
    const emailText = await emailElement.getText();
    assert.strictEqual(emailText, 'testuser@example.com');
  });

  it('should update account information', async function() {
    await driver.get('http://localhost:3000/account');
    
    const usernameField = await driver.findElement(By.id('usernameInput'));
    await usernameField.clear();
    await usernameField.sendKeys('updateduser');
    
    const updateButton = await driver.findElement(By.id('updateButton'));
    await updateButton.click();
    
    const successMessage = await driver.findElement(By.className('alert-success'));
    assert.ok(await successMessage.isDisplayed());
  });

  it('should change account password', async function() {
    await driver.get('http://localhost:3000/account');
    
    const currentPasswordField = await driver.findElement(By.id('currentPassword'));
    await currentPasswordField.sendKeys('password');
    
    const newPasswordField = await driver.findElement(By.id('newPassword'));
    await newPasswordField.sendKeys('newpassword');
    
    const confirmPasswordField = await driver.findElement(By.id('confirmPassword'));
    await confirmPasswordField.sendKeys('newpassword');
    
    const changePasswordButton = await driver.findElement(By.id('changePasswordButton'));
    await changePasswordButton.click();
    
    const successMessage = await driver.findElement(By.className('alert-success'));
    assert.ok(await successMessage.isDisplayed());
  });

  it('should delete account', async function() {
    await driver.get('http://localhost:3000/account');
    
    const deleteButton = await driver.findElement(By.id('deleteButton'));
    await deleteButton.click();
    
    const passwordField = await driver.findElement(By.id('password'));
    await passwordField.sendKeys('password');
    
    const confirmDeleteButton = await driver.findElement(By.id('confirmDeleteButton'));
    await confirmDeleteButton.click();
    
    const confirmationMessage = await driver.findElement(By.className('alert-info'));
    assert.ok(await confirmationMessage.isDisplayed());
  });
});
