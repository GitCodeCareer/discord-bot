const config = require("../config.json");

exports.run = (client, msg) => {

   if (msg.author.bot) return;
   if(msg.content.indexOf(config.cmdPrefix) !== 0) return;
 
   const args = msg.content.slice(config.cmdPrefix.length).trim().split(/ +/g);
   const command = args.shift().toLowerCase().replace('/', '');
 
   try {
     let commandFile = require(`../commands/${command}.js`);
     commandFile.run(client, msg, args);
   } catch (err) {
     console.error(err);
   }
    
};