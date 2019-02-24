const Discord = require("discord.js");

const config = require("../config.json");

exports.run = (client, message, args) => {
   
   if (message.member.roles.find(val => val.id === Config.getRole(role_type="admin"))) {
      if(!args || args.length < 1) return message.reply("Must provide the text of the poll question after the command.");

      const question = args.join(' ')
  
      let text = "**POLL:** " + question

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