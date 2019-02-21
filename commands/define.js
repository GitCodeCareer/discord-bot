/**
 * author: ap4gh(Github), debjay(on CodeCareer Discord Server)
 * license: MIT https://opensource.org/licenses/MIT
 */
const maintainerID = '274434863711518722';
/**
 * command_name: define
 * version: 3.0
 * description: Provides definition for words from web.
 * npm_dependencies: { request, request-promise-native }
 */

const request = require('request-promise-native');

const maxRelatedTopics = 3;

/*
    ------------ HELPER FUNCTIONS ------------
*/

/**
 * @name notifyErrors
 * @description Notify maintainer and the end-user about the error.
 * @param {Object.Prototype} message discord message object
 * @param {Error} err error message
 */
const notifyErrors = (message, err = '') => {
  // maintainer can be changed by changing the maintainer ID
  // from the top of the file.
  const author = message.guild.member(maintainerID);
  author.send(`Message ID: ${message.id}`);
  author.send('```' + err + '```');
  message.channel.send(
    `Some internal error occured, maintainer ${author} has been notified.`
  );
};
/**
 * @name sendMessage
 * @description checks for errors and sends message to the channel.
 * @param {Object.Prototype} message discord message object
 * @param {String} messageContent text, embed, image path etc.
 */
const sendMessage = (message, messageContent) => {
  try {
    message.channel.send(messageContent);
  } catch (e) {
    console.error(e);
    return notifyErrors(message, e);
  }
};
/**
 * @name generateQueryURL
 * @description generate api query URL for service.
 * @param {String} serve The service to look for definition wiki, ddg etc.
 * @param {String} phrase search phrase entered by end-user.
 */
const generateQueryURL = (phrase, service = 'ddg') => {
  const queryURLs = {
    wiki: `https://en.wikipedia.org/w/api.php?action=opensearch&list=search&search=${phrase}&format=json&formatversion=2`,
    ddg: `https://api.duckduckgo.com/?q=${phrase}&format=json`
  };
  return encodeURI(queryURLs[service]);
};
/**
 * @name runCommand
 * @description screen command and return the function running that command.
 * @param {Object.Prototype} message discord message object
 * @param {Array.Prototype} args arguments passed with the command
 * @param {String} commandName name of command
 */
const runUserCommand = (message, args, commandName = '') => {
  const availableCommands = {
    '-h': showHelp,
    '--help': showHelp,
    wiki: wikipediaOpenSearch,
    default: ddgInstantAnswer
  };
  // if commandName does not match any, return default
  return (availableCommands[commandName] || availableCommands.default)(
    message,
    args
  );
};

/*
    ------------ COMMAND FUNCTIONS ------------
*/

/**
 *      •• DUCKDUCKGO INSTANT ANSWER ••
 */
const ddgInstantAnswer = async (message, args) => {
  // join args to create a search phrase
  const searchPhrase = args.slice(0, args.length).join(' ');
  let data;
  try {
    data = await request({
      url: generateQueryURL(searchPhrase),
      json: true,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (e) {
    console.error(e);
    // if request fails report errors
    return notifyErrors(message, e);
  }
  let result = `:mag: \`${searchPhrase}\`\n`;
  const relatedTopics = data['RelatedTopics'];
  const abstractText = data['AbstractText'];
  const abstractURL = data['AbstractURL'];
  // if no data is provided:
  if (relatedTopics.length === 0) {
    result += `Cannot find information on *${searchPhrase}* :no_good: Read the command guide with \`!define --help\` to get accurate results.`;
  } // if abstract data is missing:
  else if (!abstractText || !abstractURL) {
    result += `*"${searchPhrase}" may refer to following things*  :point_down:\n\n`;
    for (let topic of relatedTopics) {
      // keeping maximum of 3 related topics to be displayed.
      // maximum related topics can be changed at the top.
      // NOTE: discord do not allow a message length > 2000
      // characters.
      if (
        topic['Text'] === undefined ||
        topic['FirstURL'] === undefined ||
        relatedTopics.indexOf(topic) >= maxRelatedTopics
      )
        break;
      result += `${topic['Text']}\n${topic['FirstURL']}\n\n`;
    }
  } // if abstract data exist:
  else {
    result += '```' + abstractText + '```:link: ' + abstractURL;
  }
  return sendMessage(message, result);
};

/**
 *      •• WIKIPEDIA OPEN SEARCH ••
 */
const wikipediaOpenSearch = async (message, args) => {
  // join args after 'wiki' to create a search phrase
  const searchPhrase = args.slice(1, args.length).join(' ');
  let data;
  try {
    data = await request({
      url: generateQueryURL(searchPhrase, 'wiki'),
      json: true,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (e) {
    console.error(e);
    return notifyErrors(message, e);
  }
  // all definitions:
  const definitions = data[2];
  // all wikipedia page links:
  const links = data[3];
  // main definition page link:
  let wikipediaPageLink = ':link: ' + links[0];
  let result = definitions[0];
  // no information is received from wikipedia:
  if (!result) {
    result = `No information provided for *${searchPhrase}* :no_good: `;
  } // a word have more than one meaning:
  else if (result.match(/may refer to/g)) {
    result =
      `:mag: **Wikipedia**: \`${searchPhrase}\`\n\n` +
      '```\n' +
      result +
      '\n\n';
    // remove useless definition at index 0:
    definitions.shift();
    // collect related definition:
    for (let d of definitions) {
      result += `${definitions.indexOf(d) + 1}. ${d}\n\n`;
      if (definitions.indexOf(d) === maxRelatedTopics - 1) break;
    }
    result += '```';
  } // exact meaning is obtained:
  else {
    result =
      `:mag: ${searchPhrase}` + '```' + result + '```' + wikipediaPageLink;
  }
  return sendMessage(message, result);
};

/**
 *      •• HELP COMMAND ••
 */
const showHelp = (message, args) => {
  message.channel.send(`
    \`\`\`
NAME
  define -- provide definition for words from web.

DESCRIPTION
  !define command gets abstract information on a word from
  duckduckgo and wikipedia.

COMMANDS
  1) !define <search-text>         DuckDuckGo instant answer.
  2) !define wiki <search-text>    Wikipedia definition.
  3) !define -h[--help]            Provides help text.

EXAMPLES
  > !define yellow stone
  > !define wiki object oriented programming

GUIDE
  !define will only show definition on receiving exact info,
  in case a word have more than one meaning, related topics
  (not more than three) will be displayed. To get more acc-
  urate results pass more keywords in search phrase sepearted  
  with spaces. Eg: 'react' means many things but if you want 
  to get definition for 'reactjs' use command like this:

  > !define reactjs
          OR
  > !define wiki react javascript

  For now, !define only provide information about things, places,
  events, news etc. and does not provide meaning of the words from
  english dictionary. DDG bang redirects will also not work here.
    \`\`\` 
    `);
};

// run function for !define command:
exports.run = (client, message, args) => {
  if (args.length === 0)
    message.channel.send('Try `!define --help` to get command guide.');
  runUserCommand(message, args, args[0]);
};
