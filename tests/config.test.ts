import Config from '@utils/config'

const c = new Config()

test('bot token returns string value', () => {
   expect(c.getBotToken()).toMatch(/[\w\d.]+/)
})

test('command prefix returns string value of length 1', () => {
   expect(c.getCommandPrefix()).toHaveLength(1)
})