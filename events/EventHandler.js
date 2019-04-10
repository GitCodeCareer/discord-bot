const fs = require('fs');
const path = require('path');
const events = require('../configurations/events');

/**
 * Event handler class to handle all the events.
 * It will cache all the event files on the first
 * run of the program, and trigger a handler
 * whenever an event is called.
 *
 * Reload functionality: will be added in future
 */

class EventHandler {
  constructor(client) {
    this.client = client;
    this._cache = {};
  }

  // loads up all the event files in a cache.
  load() {
    for (const eventName of Object.keys(events)) {
      this._cache[eventName] = [];
      fs.readdir(`./events/${eventName}`, (err, files) => {
        if (err) throw err;
        files.forEach((f) => {
          this._cache[eventName].push(
            require(path.join(__dirname, `./${eventName}/${f}`))
          );
        });
      });
    }
  }

  // trigger event handler
  onEvent(eventName, ...args) {
    if (!this._cache[eventName])
      return process.stdout.write(`No event created for ${eventName}\n`);
    this._cache[eventName].forEach((event) => {
      event.run(this.client, ...args);
    });
  }
}

module.exports = EventHandler;
