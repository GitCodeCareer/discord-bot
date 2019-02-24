exports.run = (client, msg) => {

   if (msg.author.bot) return;
   if(msg.content.indexOf(Config.getCommandPrefix()) !== 0) return;
 
   const args = msg.content.slice(Config.getCommandPrefix().length).trim().split(/ +/g);
   const command = args.shift().toLowerCase().replace('/', '');
 
   try {
     let commandFile = require(`../commands/${command}.js`);
     commandFile.run(client, msg, args);
   } catch (err) {
     console.error(err);
   }
    
};