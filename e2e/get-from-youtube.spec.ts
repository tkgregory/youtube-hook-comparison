import { test, expect } from './pages/fixtures';

test.beforeEach(async ({ page, boardsPage }) => {
    test.slow()
    await page.goto('/')
    await boardsPage.useNewBoard()
});

test('Get from YouTube - thumbnail teaser', async ({ page, thumbshotPage }) => {
    await thumbshotPage.clickGetFromYouTubeForTeaser()
    await page.getByLabel('Video URL').fill('https://www.youtube.com/watch?v=9bZkp7q19f0')
    await page.locator('button:has-text("Go")').first().click()

    await expect(thumbshotPage.getPreviewTitle(0)).toContainText('PSY - GANGNAM STYLE(강남스타일) M/V')
    await expect(thumbshotPage.getChannelName(0)).toContainText('officialpsy')
    await expect(thumbshotPage.getThumbnailURL(0)).toHaveAttribute('src', 'https://i.ytimg.com/vi/9bZkp7q19f0/maxresdefault.jpg')
});

test('Get from YouTube - update preview', async ({ page, thumbshotPage }) => {
    await thumbshotPage.clickRandom()
    await thumbshotPage.clickGetFromYouTube(0)

    await page.locator('label:has-text("Video URL") input').first().fill('https://www.youtube.com/watch?v=9bZkp7q19f0')
    await page.locator('button:has-text("Go")').first().click()

    await expect(thumbshotPage.getPreviewTitle(0)).toContainText('PSY - GANGNAM STYLE(강남스타일) M/V')
    await expect(thumbshotPage.getChannelName(0)).toContainText('officialpsy')
    await expect(thumbshotPage.getThumbnailURL(0)).toHaveAttribute('src', 'https://i.ytimg.com/vi/9bZkp7q19f0/maxresdefault.jpg')
});