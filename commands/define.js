
/**
 * author: ap4gh(Github) aka. debjay(on CodeCareer Server)
 * command_name: define
 * description: Get the abstract text from duckduckgo search result for the passed word.
 * npm_dependencies: { request }
 */

const request = require('request')

const createQueryURL = query => {
  return `https://api.duckduckgo.com/?q=${query}&format=json`
}

exports.run = (client, message, args) => {
  switch (args[0]) {
    case 'help':
      message.channel.send('__`!define` Command Guide__\nFirst word passed after the command will be searched. If no definition is available for the word, then related topics and links will be provided. Example:\n```!define tajmahal```')
      break
    default:
      request(
        {
          url: createQueryURL(args[0]),
          headers: {
            'Content-Type': 'application/json'
          }
        },
        (error, response, body) => {
          if (!error && response.statusCode == 200) {
            const data = JSON.parse(body)
            console.log(data)
            const abstract = data['AbstractText']
            if (!abstract) {
              let msg = `Cannot get exact definition, what are you looking for?\n\n`
              const RelatedTopics = data['RelatedTopics']
              RelatedTopics.every((topic, index) => {
                if (!topic['Text']) {
                  return false
                } else {
                  msg += `${topic['FirstURL']}\n`
                  msg += `*${topic['Text']}*\n\n`
                  return true
                }
              })
              message.channel.send(msg)
            } else {
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