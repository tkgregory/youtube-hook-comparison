import { test, expect } from './pages/fixtures';

test.beforeEach(async ({ page }) => {
    test.slow()
    await page.goto('/')
});

test('Prompted to create new board on login', async ({ page }) => {
    await expect(page.getByText('Create or select a thumbnail board to get started.')).toHaveCount(1)
});

test('Create a new board', async ({ boardsPage }) => {
    await boardsPage.openBoardsDrawer()
    const name = boardsPage.randomName()
    await boardsPage.createBoard(name)

    await expect(boardsPage.listSelector(name)).toHaveCount(1, { timeout: 5000 })
});

test('Update board name', async ({ boardsPage }) => {
    await boardsPage.openBoardsDrawer()
    const originalName = boardsPage.randomName()
    await boardsPage.createBoard(originalName)
    const updatedName = boardsPage.randomName()
    await boardsPage.updateBoardName(originalName, updatedName)

    await expect(boardsPage.listSelector(originalName)).toHaveCount(0, { timeout: 5000 })
    await expect(boardsPage.listSelector(updatedName)).toHaveCount(1, { timeout: 5000 })
});

test('Delete board', async ({ boardsPage }) => {
    await boardsPage.openBoardsDrawer()
    const name = boardsPage.randomName()

    await boardsPage.createBoard(name)
    await boardsPage.deleteBoard(name)

    await expect(boardsPage.listSelector(name)).toHaveCount(0, { timeout: 5000 })
});

test('Cannot access board of another user', async ({ page, boardsPage, createAccountPage }) => {
    await boardsPage.useNewBoard()
    await expect(page.getByText('Board not found')).toHaveCount(0)
    const url = page.url()

    await createAccountPage.signInAsFreeUser()
    await page.goto(url)
    await expect(page.getByText('Board not found')).toHaveCount(1)
});