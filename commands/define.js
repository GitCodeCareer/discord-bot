
/**
 * author: ap4gh(Github) aka. debjay(on CodeCareer Server)
 * command_name: define
 * description: Get the abstract text from duckduckgo search result for the passed word.
 * npm_dependencies: { request }
 */

const request = require('request')
// This func will return a formatted URL to get instant answer data from ddg in JSON format
const createQueryURL = query => {
  return `https://api.duckduckgo.com/?q=${query}&format=json`
}

exports.run = (client, message, args) => {
  /**
  * First argument can be a sub-command or word.
  * Switch statement screen the first argument.
  */
  switch (args[0]) {
    // !define help
    case 'help':
      message.channel.send('__`!define` Command Guide__\nFirst word passed after the command will be searched. If no definition is available for the word, then related topics and links will be provided. Example:\n```!define tajmahal```')
      break
    // !define <word>
    default:
      /**
      * request takes two arguments, first is the option object,
      * second is a callback function.
      */
      request(
        // Options
        {
          url: createQueryURL(args[0]),
          headers: {
            'Content-Type': 'application/json'
          }
        },
        // Callback function
        (error, response, body) => {
          // Only run when data is recieved with statusCode of 200
          if (!error && response.statusCode == 200) {
            // Parse JSON data
            const data = JSON.parse(body)
            // Abstract text
            const abstract = data['AbstractText']
            // If no abstract text is found then:
            if (!abstract) {
              let msg = `Cannot get exact definition, what are you looking for?\n\n`
              const RelatedTopics = data['RelatedTopics']
              RelatedTopics.every((topic, index) => {
                /**
                * For some related topics, no links are provided,
                * hence those are not collected and the loop is
                * exited.
                */
                if (!topic['Text']) {
                  return false
                } else {
                  msg += `${topic['FirstURL']}\n`
                  msg += `*${topic['Text']}*\n\n`
                  return true
                }
              })
              message.channel.send(msg)
            } else { // If abstract text is found: 
                let msg = `Definition for __${args[0]}__`
                msg += '```'
                msg += abstract
                msg += '```'
                message.channel.send(msg)
            }
          }
        }
      )
  }


}
