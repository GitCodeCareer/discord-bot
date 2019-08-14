const client = require('../utils/client').getClient()
const { view } = require('../utils')

module.exports = [
    {
        path: `/`,
        method: () => {
            return view('index', { test: "hello world" });
        }
    },
    {
        path: `/member-count`,
        method: () => {
            return {
                memberCount: client.guilds.first().memberCount
            }
        }
    }
]