exports.run = (client) => {
  process.stdout.write(
    `Bot is logged in as ${client.user.tag.bgYellow}\n`.magenta
  );
};
