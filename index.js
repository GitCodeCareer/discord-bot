const Discord = require("discord.js");
const client = new Discord.Client();

const config = require("./config.json");

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
   if (msg.author.bot) return;
   if(msg.content.indexOf(config.cmdPrefix) !== 0) return;
 
   const args = msg.content.slice(config.cmdPrefix.length).trim().split(/ +/g);
   const command = args.shift().toLowerCase().replace('/', '');
 
   try {
     let commandFile = require(`./commands/${command}.js`);
     commandFile.run(client, msg, args);
   } catch (err) {
     console.error(err);
   }
});

client.on('guildMemberAdd', member => {
  // Send the message to a designated channel on a server:
  const channel = member.guild.channels.find(ch => ch.name === config.welcomeMessageChannel);
  // Do nothing if the channel wasn't found on this server
  if (!channel) return;
  // Send the message, mentioning the member
  channel.send(`Welcome to the server, ${member}`);
});

client.login(config.token);