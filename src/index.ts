require('module-alias/register');
import * as config from '@utils/config';
import * as auth from '@utils/auth';

export const Config = new config.default()
export const Auth = new auth.default()

import * as Discord from 'discord.js';
const client = new Discord.Client();

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

import * as fs from 'fs';
import * as path from 'path';

fs.readdir('./dist/events', (err, files) => {
  files.forEach(file => {
    if (path.extname(file) == '.js') {
      let eventName = file.split('.')[0]
      let eventFile = require(`./events/${eventName}.js`);

      client.on(eventName, (object: any) => eventFile.run(client, object));
    }    
  });
});

client.login(Config.getBotToken());