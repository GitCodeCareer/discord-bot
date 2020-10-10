## Contributing

Getting started with your first pull request (PR) ! Just follow these steps...

1. Fork the repository to your own Github account.
2. Clone the forked repository to a directory on your computer.
3. Run `npm install` **OR** `npm i` from within the directory. If you prefer [Yarn](https://yarnpkg.com/en/), feel free to use that instead and run `yarn install`.
4. [Create a new development bot](https://discordapp.com/developers/applications/). Be sure to also create a **bot user** in order to interact with it.
5. [Create a new project](https://console.firebase.google.com/). Go to **Settings** then **Add an application** and under **Firebase SDK snippet**, choose **CDN**.
6. Duplicate the `.env.example` file and rename it to `.env` and fill in the appropriate values from the [Discord Developer portal(Settings/Bot)](https://discordapp.com/developers/applications/) **AND** [Firebase Console(Settings/Your App/Firebase SDK snippet/CDN)](https://console.firebase.google.com/).
7. Create a new javascript file in the commands folder that is named after the command you want to add. If you want to add a new event instead, make the event in `index.js`.
8. Create **logs** folder with the file **firebase.log** inside. `logs/firebase.log`
9. To test the bot, run `node index.js` **OR** `npm start` **OR** `yarn start`
10. Make sure to debug the new command and test it a lot. If you need help, ask in the [CodeCareer Discord](https://discord.gg/nVCtqvQ) anytime 😺 ! When you are ready to submit the PR, head back to this page and click `New pull request`.
11. Wait patiently for an admin to look it over and if everything checks out, it will be merged.

## Optionals API

- [Giphy](https://developers.giphy.com/dashboard/)
- [Nasa](https://api.nasa.gov/)
