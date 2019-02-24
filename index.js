global.Config = require('./utils/config').config;

const Discord = require("discord.js");
const client = new Discord.Client();

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

const fs = require('fs');

fs.readdir('./events/', (err, files) => {
  files.forEach(file => {
    let eventName = file.split('.')[0]
    let eventFile = require(`./events/${file}`);
    
    client.on(eventName, (object) => eventFile.run(client, object));    
  });
});

client.login(Config.getBotToken());