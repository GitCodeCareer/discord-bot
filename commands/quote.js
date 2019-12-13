const Discord = require("discord.js");
const fetch = require("node-fetch");

exports.run = async message => {
  const { quote, author } = await fetch(
    "http://quotes.stormconsultancy.co.uk/random.json"
  ).then(response => response.json());
  const { contents } = await fetch(
    "https://quotes.rest/qod.json"
  ).then(response => response.json());
  const { data } = await fetch(
    `https://api.giphy.com/v1/gifs/random?tag=motivational&rating=g&api_key=${process.env.GIPHY_API_KEY}`
  ).then(response => response.json());
  const { url } = await fetch(
    `https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY`
  ).then(response => response.json());

  // inside a command, event listener, etc.
  const quoteEmbed = new Discord.RichEmbed()
    .setColor("#5DBCD2")
    .setAuthor(author, "https://robohash.org/CodeCareer.io.png")
    .setThumbnail(url)
    .setTitle("💡 Motivational Quote 🎅🎄🎯🚀")
    .setURL("https://codecareer.io/")
    .setDescription(quote)
    .addField("🎧 Podcast :", "https://anchor.fm/codecareer", true)
    .addField("🌠 Quote Of The Day :", contents.quotes[0].author, true)
    .addField(contents.quotes[0].quote, contents.quotes[0].tags, true)
    .addField("📹 YouTube :", "https://www.youtube.com/user/bnspak/", true)
    .addField("🔮 Random GIF :", data.title, true)
    .setImage(data.image_url)
    .setFooter(
      "CodeCareer is committed to helping new developers make their first PR!",
      "https://avatars3.githubusercontent.com/u/42856887?s=200&v=4"
    )
    .setTimestamp();

  message.channel.send(quoteEmbed);
};
