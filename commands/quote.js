const Discord = require('discord.js');
const fetch = require('node-fetch');

exports.run = async (message) => {
const { quote, author } = await fetch('http://quotes.stormconsultancy.co.uk/random.json').then(response => response.json())
const { file } = await fetch('https://aws.random.cat/meow').then(response => response.json())
const { url } = await fetch('https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY').then(response => response.json())

// inside a command, event listener, etc.
const quoteEmbed = new Discord.RichEmbed()
    .setColor('#5DBCD2')
    .setAuthor(author, 'https://robohash.org/CodeCareer.io.png')
    .setThumbnail(url)
    .setTitle('Motivational Quote 💡🎯🚀')
    .setURL('https://codecareer.io/')
    .setDescription(quote)
    .addField('🎧 Baroque Music for Studying & Brain Power', 'https://open.spotify.com/playlist/2xwP2mUA0QRT5TwMEkBvtH', true)
    .addField('🎥 Motivation2Study', 'https://www.youtube.com/channel/UC8PICQUP0a_HsrA9S4IIgWw', true)
    .setImage(file)
    .setFooter('CodeCareer is committed to helping new developers make their first PR!', 'https://avatars3.githubusercontent.com/u/42856887?s=200&v=4')
    .setTimestamp()

message.channel.send(quoteEmbed);
};