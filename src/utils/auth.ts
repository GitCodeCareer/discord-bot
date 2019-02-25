import { Config } from '../index';

export default class Auth {

   constructor() {
      
   }

   public isAdmin(member: object) {
      return member['roles'].find(val => val.id === Config.getRole("admin"))
   }

   public isMod(member: object) {
      return member['roles'].find(val => val.id === Config.getRole("mod"))
   }

   public isRole(member: object, role_type: string) {
      return member['roles'].find(val => val.id === Config.getRole(role_type))
   }
}