exports.run = (client, message, args) => {
   if(!args || args.size < 1) return message.reply("Must provide a base64 encoded string that contains the announcement.");
   
   let buff = Buffer.from(args[0], 'base64');  
   let text = buff.toString('ascii');

   message.channel.send(text);
   message.delete();
};