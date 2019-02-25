import * as config from './utils/config';
import * as auth from './utils/auth';

export const Config = new config.default()
export const Auth = new auth.default()

import Discord from "discord.js";
const client = new Discord.Client();

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

import fs from 'fs';

fs.readdir('./events/', (err, files) => {
  files.forEach(file => {
    let eventName = file.split('.')[0]
    let eventFile = require(`./events/${file}`);
    
    client.on(eventName, (object) => eventFile.run(client, object));    
  });
});

client.login(Config.getBotToken());