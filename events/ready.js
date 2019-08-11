const { client } = require("../utils");
const bot = client.client;

exports.run = async function () {
  console.log(`Logged in as ${bot.user.tag.black.bgYellow}`);
  // set activity
  const presense = await bot.user.setActivity("!helpme");
  console.log(`Activity set to ${presense.game ? presense.game.name.black.bgYellow : "none"}`)
}
