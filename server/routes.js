const client = require('../utils/client').getClient()

const routePrefix = '/codecareer'

module.exports = [
    {
        path: `${routePrefix}/member-count`,
        method: () => {
            return {
                memberCount: client.guilds.first().memberCount
            }
        }
    }
]