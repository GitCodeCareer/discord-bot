exports.run = (client, message, args) => {
   
   if (Auth.isAdmin(message.member)) {
      if(!args || args.length < 1) return message.reply("Must provide the text for the announcement after the command.");

      const announcement = args.join(' ');

      message.channel.send(announcement);
      message.delete();
   } else {
      message.reply('You must be an admin in order to run this command.');
   }
    
};