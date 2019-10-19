const { Auth, Config } = require('@crock/discord-bot-utils');

exports.run = (message, args) => {
   
   if (Auth.isOwner(message.member)) {

      Config.resetConfig()
      message.reply("Config reset")
      
   } else {
      message.reply('You must be the guild owner in order to run this command.');
   }
    
};