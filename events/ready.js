const botClient = require('../utils/client');

exports.run = function() {
    console.log(`Logged in as ${botClient.client.user.tag.bold.yellow}`);
}
