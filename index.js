// Load environment variables with dotenv
require('dotenv').config();
require('colors');

const moduleAlias = require('module-alias');
moduleAlias.addAliases({
  '@root'  : __dirname,
  '@events': __dirname + '/events',
  '@commands': __dirname + '/commands'
});

// Require the bot client utility class and login
const { Client } = require('@crock/discord-bot-utils')
Client.login()

// Require the api web server client utility class and start listening
const { Server } = require('@crock/discord-bot-utils')
Server.startListening()
