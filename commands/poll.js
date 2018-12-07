const Discord = require("discord.js");

const config = require("../config.json");

exports.run = (client, message, args) => {
   
   if (message.member.roles.find(val => val.id === config.adminRoleId)) {
      if(!args || args.size < 1) return message.reply("Must provide a base64 encoded string that contains the poll question.");

      let buff = Buffer.from(args[0], 'base64');  
      let text = "**POLL:** " + buff.toString('ascii');

      message.channel.send(text)
         .then(function (msg) {
            msg.react("✅")
            msg.react("❌")
         }).catch(function() {
            //Something
         });
      message.delete();
   } else {
      message.reply('You must be an admin in order to run this command.');
   }
    
};