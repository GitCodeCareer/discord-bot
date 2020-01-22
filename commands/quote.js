const Discord = require("discord.js");
const fetch = require("node-fetch");

exports.run = async message => {
  try {
    const { quote, author } = await fetch(
      "http://quotes.stormconsultancy.co.uk/random.json"
    ).then(response => response.json());
    const { contents } = await fetch(
      "https://quotes.rest/qod.json"
    ).then(response => response.json());
    const { data } = await fetch(
      `https://api.giphy.com/v1/gifs/random?tag=motivational&rating=g&api_key=${process.env.GIPHY_API_KEY}`
    ).then(response => response.json());
    const { hdurl } = await fetch(
      `https://api.nasa.gov/planetary/apod?api_key=${process.env.NASA_API_KEY}&hd=true`
    ).then(response => response.json());

    // inside a command, event listener, etc.
    const quoteEmbed = new Discord.RichEmbed()
      .setColor("#5DBCD2")
      .setAuthor(author, "https://robohash.org/CodeCareer.io.png")
      .setThumbnail(hdurl)
      .setTitle("💡 Motivational Quote 🔥🎯🚀")
      .setURL("https://codecareer.io/")
      .setDescription(quote)
      .addField("🎧 Podcast :", "https://anchor.fm/codecareer", true)
      .addField("🌠 Quote Of The Day :", contents.quotes[0].quote, true)
      .addField(contents.quotes[0].author, contents.quotes[0].tags, true)
      .addField("📹 YouTube :", "https://www.youtube.com/user/bnspak/", true)
      .addField("🔮 Random GIF :", data.title, true)
      .setImage(data.image_url)
      .setFooter(
        "CodeCareer is committed to helping new developers make their first PR!",
        "https://avatars3.githubusercontent.com/u/42856887?s=200&v=4"
      )
      .setTimestamp();

    message.channel.send(quoteEmbed);
    // handle promise rejections.
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/catch
  } catch (err) {
    console.error(err);
    return notifyErrors(message, e);
  }
};

/** notifyErrors: Notify maintainer and the end-user about the error. */
async function notifyErrors(message, err = "") {
  const maintainerID = "211509232137273344";
  // NOTE: maintainer ID can be changed above
  const author = message.guild.member(maintainerID);
  author.send(`Message ID: ${message.id}\n` + "```" + err + "```");
  await message.channel.send(
    `Some internal error occured, maintainer ${author} has been notified.`
  );
}
