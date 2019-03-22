const moduleAlias = require('module-alias');

moduleAlias.addAliases({
  '@root'  : __dirname,
  '@utils': __dirname + '/utils',
  '@events': __dirname + '/events',
  '@commands': __dirname + '/commands'
});

const Config = require('./utils/config');

const Discord = require('discord.js');
const client = new Discord.Client();

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

const fs = require('fs');

fs.readdir('./events/', (err, files) => {
  files.forEach((file) => {
    let eventName = file.split('.')[0];
    let eventFile = require(`./events/${file}`);

    client.on(eventName, (object) => eventFile.run(object));
  });
});

client.login(Config.getBotToken());

module.exports = {
  client
}
