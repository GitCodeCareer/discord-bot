import * as path from 'path';
import * as fs from 'fs';

export default class Config {

   private configPath: string
   private config: object

   constructor() {
      this.configPath = path.join(__dirname, '..', '..', 'config.json')
      this.config = JSON.parse(fs.readFileSync(this.configPath).toString()) 
   }

   private reload() {
      this.config = JSON.parse(fs.readFileSync(this.configPath).toString())
   }

   private saveConfig() {
      let json = JSON.stringify(this.config, null, 2)
      fs.writeFileSync(this.configPath, json)
      this.reload()
   }

   // Getters

   public getConfig() {
      return this.config
   }

   public getBotToken() {
      return this.config['botToken']
   }
   
   public getDatabaseInfo(part_name: string=null) {
      if (part_name != null) {
         return this.config['database'][part_name]
      } else {
         return this.config['database']
      }
   }

   public getCommandPrefix() {
      return this.config['commandPrefix']
   }

   public getChannel(name: string) {
      return this.config['channels'][name]
   }

   public getRole(role_type: string) {
      return this.config['roles'][role_type]
   }

   // Setters

   public setCommandPrefix(prefix: string) {
      this.config['commandPrefix'] = prefix
      this.saveConfig()
   }

   public setChannel(channel_type: string, id: string|number) {
      this.config['channels'][channel_type] = id.toString()
      this.saveConfig()
   }

   public setRole(role_type: string, id: string|number) {
      this.config['roles'][role_type] = id.toString()
      this.saveConfig()
   }
}