const client = require('../utils/client').getClient()

module.exports = [
    {
        path: '/member-count',
        method: () => {
            return {
                memberCount: client.guilds.first().memberCount
            }
        }
    }
]