require('colors');

const moduleAlias = require('module-alias');
moduleAlias.addAliases({
  '@root': __dirname,
  '@utils': __dirname + '/utils',
  '@events': __dirname + '/events',
  '@commands': __dirname + '/commands'
});

const Config = require('@utils/config');
const EventHandler = require('./events/EventHandler');
const eventList = require('./configurations/events');

const { Client } = require('discord.js');
const client = new Client();

/**
 * CACHING: Cache all the events on the first
 * run of the program. This reduces response
 * time and save hassle of importing modules
 * everytime.
 */

const eventHandler = new EventHandler(client);
// load up all the existing events in cache
eventHandler.load();
// register all event handlers with client
for (const e of Object.keys(eventList)) {
  client.on(e, (...args) => eventHandler.onEvent(e, ...args));
}

client.login(Config.getBotToken());

module.exports = {
  client
};
