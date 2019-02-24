const Config = require('../utils/config').config;

test('bot token returns string value', () => {
   expect(Config.getBotToken()).toMatch(/[\w\d.]+/)
})

test('command prefix returns string value of length 1', () => {
   expect(Config.getCommandPrefix()).toHaveLength(1)
})