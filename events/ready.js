const bot = require('../utils/client').getClient()

exports.run = async function () {
  console.log(`Logged in as ${bot.user.tag.black.bgYellow}`);
  // set activity
  const presense = await bot.user.setActivity("Type !ticket for support");
  console.log(`Activity set to ${presense.game ? presense.game.name.black.bgYellow : "none"}`)
}
