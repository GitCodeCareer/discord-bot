const path = require('path');
const fs = require('fs');

class Config {

   constructor() {
      this.configPath = path.join(__dirname, '..', 'config.json')
      this.config = JSON.parse(fs.readFileSync(this.configPath)) 
   }

   reload() {
      this.config = JSON.parse(fs.readFileSync(this.configPath))
   }

   saveConfig() {
      let json = JSON.stringify(this.config, null, 2)
      fs.writeFileSync(this.configPath)
      this.reload()
   }

   // Getters

   getConfig() {
      return this.config
   }

   getBotToken() {
      return this.config.botToken
   }
   
   getDatabaseInfo(part_name=null) {
      if (part_name != null) {
         return this.config.database[part_name]
      } else {
         return this.config.database
      }
   }

   getCommandPrefix() {
      return this.config.commandPrefix
   }

   getChannel(name) {
      return this.config.channels[name]
   }

   getRole(role_type) {
      return this.config.roles[role_type]
   }

   // Setters

   setCommandPrefix(prefix) {
      this.config.commandPrefix = prefix
      this.saveConfig()
   }

   setChannel(channel_type, id) {
      this.config.channels[channel_type] = id
      this.saveConfig()
   }

   setRole(role_type, id) {
      this.config.roles[role_type] = id
      this.saveConfig()
   }
}

module.exports = {
   config: new Config()
}