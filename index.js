const Discord = require("discord.js");
const client = new Discord.Client();

const config = require("./config.json");

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

const fs = require('fs');

fs.readdir('./events/', (err, files) => {
  files.forEach(file => {
    let eventName = file.split('.')[0]
    let eventFile = require(`./events/${file}`);
    console.log("event initiated");
    client.on(eventName, (object) => eventFile.run(client, object));    
  });
});

client.login(config.token);