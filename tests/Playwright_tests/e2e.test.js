const { test, describe, beforeEach, afterEach, beforeAll, afterAll, expect } = require('@playwright/test');
const { chromium } = require('playwright');

const host = 'http://localhost:3000'; // Application host (NOT service host - that can be anything)

let browser;
let context;
let page;

let user = {
    username : "",
    email : "",
    password : "123456",
    confirmPass : "123456",
};

describe("e2e tests", () => {
    beforeAll(async () => {
        browser = await chromium.launch();
    });

    afterAll(async () => {
        await browser.close();
    });

    beforeEach(async () => {
        context = await browser.newContext();
        page = await context.newPage();
    });

    afterEach(async () => {
        await page.close();
        await context.close();
    });

    
    describe("authentication", () => {
        test('Registration with valid data', async ()=>{
            await page.goto(host);
            await page.locator('a[href="/register"]').first().click();

            await page.waitForSelector('form');

            let random = Math.floor(Math.random() * 10000);

            user.username = `Random user${random}`;
            user.email = `abv${random}@abv.bg`;

            await page.locator('#username').fill(user.username);
            await page.locator('#email').fill(user.email);
            await page.locator('#password').fill(user.password);
            await page.locator('#repeatPass').fill(user.confirmPass);

            let [response] = await Promise.all([
                page.waitForResponse(response => response.url().includes('/users/register') && response.status()===200),
                page.click('input[type="submit"]')
            ]);

            expect(response.ok()).toBeTruthy();
            let userData = await response.json();
            expect(userData.email).toBe(user.email);
            expect(userData.password).toBe(user.password);
            



        });



        test('Login with valid data', async ()=>{
            await page.goto(host);
            await page.locator('a[href="/login"]').first().click();
            await page.waitForSelector('form');

            await page.locator('#email').fill(user.email);
            await page.locator('#password').fill(user.password);

            let [response] = await Promise.all([
                page.waitForResponse(response => response.url().includes('/users/login') && response.status()===200),
                page.click('input[type="submit"]')
            ]);

            expect(response.ok()).toBeTruthy();
            let userData = await response.json();
            expect(userData.email).toBe(user.email);
            expect(userData.password).toBe(user.password);
        });


        test('Logout', async ()=>{
            await page.goto(host);
            await page.locator('a[href="/login"]').first().click();
            await page.waitForSelector('form');

            await page.locator('#email').fill(user.email);
            await page.locator('#password').fill(user.password);
            await page.click('input[type="submit"]');

            let [response] = await Promise.all([
                page.waitForResponse(response => response.url().includes('/users/logout') && response.status()===204),
                page.locator('a[href="/logout"]').click()
            ]);

            expect(response.ok()).toBeTruthy();

            await page.locator('a[href="/logout"]');

            await page.waitForURL(host + '/');
            expect(page.url()).toBe(host + '/');
        });
    });

    describe("navbar", () => {
        test('Logged in user navbar', async ()=>{
            await page.goto(host);
            await page.locator('a[href="/login"]').first().click();
            await page.waitForSelector('form');

            await page.locator('#email').fill(user.email);
            await page.locator('#password').fill(user.password);

            await page.click('input[type="submit"]');

            await expect(page.locator('a[href="/catalog"]')).toBeVisible();
            await expect(page.locator('a[href="/create"]')).toBeVisible();
            await expect(page.locator('a[href="/myprofile"]')).toBeVisible();
            await expect(page.locator('a[href="/logout"]')).toBeVisible();


            await expect(page.locator('a[href="/login"]')).toBeHidden();
            await expect(page.locator('a[href="/register"]')).toBeHidden();
            
        });
        test('Guest user navbar', async ()=>{
            await page.goto(host);

            await expect(page.locator('a[href="/login"]').first()).toBeVisible();
            await expect(page.locator('a[href="/register"]').first()).toBeVisible();
            await expect(page.locator('a[href="/"]')).toBeVisible();
            await expect(page.locator('a[href="/catalog"]')).toBeVisible();

            await expect(page.locator('a[href="/create"]')).toBeHidden();
            await expect(page.locator('a[href="/myprofile"]')).toBeHidden();
            await expect(page.locator('a[href="/logout"]')).toBeHidden(); 


        });
    });

    describe("CRUD", () => {

        beforeEach(async ()=> {
            await page.goto(host);
            await page.locator('a[href="/login"]').first().click();
            await page.waitForSelector('form');

            await page.locator('#email').fill(user.email);
            await page.locator('#password').fill(user.password);
            await page.click('input[type="submit"]');
        });

        test('Create Meme', async ()=>{
            await page.click('a[href="/create"]');
            await page.waitForSelector('form');

            await page.fill('[name="title"]', 'random title');
            await page.fill('[name="description"]', 'random description');
            await page.fill('[name="imageUrl"]', 'http://jpeg.org/images/jpeg-home.jpg');

            let [response] = await Promise.all([
                page.waitForResponse(response => response.url().includes('/data/memes') && response.status()===200),
                page.click('input[type="submit"]')
            ]);
            expect(response.ok()).toBeTruthy();
            let memeData = await response.json();
            expect(memeData.title).toBe('random title');
            expect(memeData.description).toBe('random description');
            expect(memeData.imageUrl).toBe('http://jpeg.org/images/jpeg-home.jpg');

        });


        test('Edit Meme', async ()=>{
            await page.click('a[href="/myprofile"]');
            await page.locator('//a[text()="Details"]').first().click();

            await page.locator('//a[text()="Edit"]').click();
            await page.waitForSelector('form');
            await page.fill('[name="description"]', 'Edited description');

            let [response] = await Promise.all([
                page.waitForResponse(response => response.url().includes('/data/memes') && response.status()===200),
                page.click('input[type="submit"]')
            ]);
            expect(response.ok()).toBeTruthy();
            let memeData = await response.json();
            expect(memeData.title).toBe('random title');
            expect(memeData.description).toBe('Edited description');
            expect(memeData.imageUrl).toBe('http://jpeg.org/images/jpeg-home.jpg');


        });
        test('Delete Meme', async ()=>{
            await page.click('a[href="/myprofile"]');
            await page.locator('//a[text()="Details"]').first().click();

            let [response] = await Promise.all([
                page.waitForResponse(response => response.url().includes('/data/memes') && response.status()===200),
                page.click('//button[text()="Delete"]')
            ]);
        });
    });
});