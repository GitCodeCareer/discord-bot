/**
 * Register all the events and associated files here.
 *
 * Only add event name and an array of file names
 * without `.js` extension.
 *
 * The program will then execute all the files
 * associated with cerain event.
 *
 * Filenames with prefix of `.Bot` are bot specific
 * and are not meant to be altered. If you want a
 * thing to execute whenever an event happens, just
 * create a file for it and register it here under
 * particular event name.
 */

module.exports = {
  guildMemberAdd: ['Bot.guildMemberAdd'],
  message: ['Bot.CommandHandler'],
  ready: ['Bot.Ready']
};
