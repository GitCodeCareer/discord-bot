const fs = require('fs');
const path = require('path');
const Discord = require("discord.js");
const Config = require('./config');

class BotClient {

    constructor() {

        this.client = new Discord.Client()
        this.client.on('ready', () => {
            console.log(`Logged in as ${this.client.user.tag}!`);
        });
        
        fs.readdir(path.join(__dirname, '..', 'events'), (err, files) => {
          files.forEach((file) => {
            let eventName = file.split('.')[0];
            let eventFile = require(`../events/${file}`);
            this.client.on(eventName, (object) => eventFile.run(object));
        });
});
        
    }

    getClient() {
        return this.client
    }

    login() {

        try {
            this.client.login(Config.getBotToken());
        } catch(e) {
            console.error(e)
            return false
        }
        
        return true
    }
}

module.exports = new BotClient