const Discord = require("discord.js");

const config = require("../config.json");

exports.run = async (client, message, args) => {

   if(!args || args.length < 1) return message.reply(`Must type your question after the command. Type "!helpme PRIVATE" if you would like your question to remain confidential`);

   const request = args.join(' ');

   try {

      const member_embed = new Discord.RichEmbed()
      .setTitle("CodeCareer Assistance")
      .setDescription(`You have requested personalized assistance. A CodeCareer staff member has been assigned to this request and will DM you within 24 hours. Please make sure to have your DM settings open to other server members.`)
      .addField("Request", request, false)
      .addField("Date of Request", message.createdAt, true);

      await message.author.send({embed: member_embed})

      const assignee = message.guild.roles.get(config.adminRoleId).members.random(1)

      const staff_embed = new Discord.RichEmbed()
      .setTitle("CodeCareer Assistance")
      .setDescription(`${message.author.toString()} has requested personalized assistance.`)
      .addField("Request", request, false)
      .addField("Assignee", `${assignee.toString()}`, true)
      .addField("Date of Request", message.createdAt, true);

      const channel = message.guild.channels.get(config.helpLogChannelId)
      await channel.send({embed: staff_embed})

      message.delete()

   } catch(e) {
      console.error(e)
   }
   
};