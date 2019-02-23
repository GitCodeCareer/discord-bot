const config = require("../config.json");

exports.run = (message) => {

   // Send the message to a designated channel on a server:
   const channel = member.guild.channels.find(ch => ch.name === config.welcomeMessageChannel);

   // Do nothing if the channel wasn't found on this server
   if (!channel) return;
   
   // Send the message, mentioning the member
   channel.send(`Welcome to the server, ${member}`);
    
};