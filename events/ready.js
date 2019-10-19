const { Client } = require('@crock/discord-bot-utils')

exports.run = async function () {
  console.log(`Logged in as ${Client.getClient().user.tag.black.bgYellow}`);
  // set activity
  const presense = await Client.getClient().user.setActivity("Type !ticket for support");
  console.log(`Activity set to ${presense.game ? presense.game.name.black.bgYellow : "none"}`)
}
