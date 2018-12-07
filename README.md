# CodeCareer Discord Bot

## Our Vision
We created this Discord bot to not only provide some useful functionality for the CodeCareer community Discord server, but to also help new developers on their journey to landing a full-time position in tech by providing the opportunity and guidance a new developer needs to make their first real world contribution to open-source projects such as this one.

## Commands
Visit the wiki to see a list of all current commands.
https://github.com/GitCodeCareer/discord-bot/wiki/Commands

## Get Started
Getting started with your first pull request (PR) is easy! Just follow these steps...

1. Fork the repository to your own Github account.
2. Clone the forked repository to a directory on your computer.
3. Run `npm install` from within the directory. If you prefer [Yarn](https://yarnpkg.com/en/), feel free to use that instead.
4. Create a new development bot at https://discordapp.com/developers/applications/. Be sure to also create a bot user in order to interact with it.
5. Duplicate the `config.example.json` file and rename it to `config.json` and fill in the appropriate values from the Discord Developer portal. 
6. Create a new javascript file in the commands folder that is named after the command you want to add. If you want to add a new event instead, make the event in `index.js`.
7. To test the bot, run `node index.js`
8. Make sure to debug the new command and test it a lot. If you need help, ask in the CodeCareer Discord anytime! Use the [#open-source-😺](https://discord.gg/nVCtqvQ). When you are ready to submit the PR, head back to this page and click `New pull request".
9. Wait patiently for an admin to look it over and if everything checks out, it will be merged.
