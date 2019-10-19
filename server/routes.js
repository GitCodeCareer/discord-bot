const { Client } = require('@crock/discord-bot-utils')
const { View } = require('@crock/discord-bot-utils')

module.exports = [
    {
        path: `/`,
        middleware: ['web'],
        method: () => {
            return View('index', { test: "hello world" });
        }
    },
    {
        path: `/member-count`,
        middleware: ['api'],
        method: () => {
            return {
                memberCount: Client.getClient().guilds.first().memberCount
            }
        }
    }
]