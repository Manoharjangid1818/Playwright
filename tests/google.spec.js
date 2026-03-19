import { test, expect } from '@playwright/test'

test("Verify Application Title",async function({page}){
    await page.goto("https://google.com/")

    const url = await page.url()

    console.log("Title is: " + url)

})