const Discord = require("discord.js");
const axios = require("axios");

exports.run = async (message) => {
  try {
    axios
      .all([
        axios
          .get("http://quotes.stormconsultancy.co.uk/random.json")
          .catch(function (error) {
            if (error.response) {
              console.log(error.response.data);
              console.log(error.response.status);
              console.log(error.response.headers);
              message.channel.send(
                "🤖 The request was made and the server responded with a status code that falls out of the range of 2xx 🐛"
              );
            } else if (error.request) {
              console.log(error.request);
              message.channel.send(
                "🤖 The request was made but no response was received `error.request` is an instance of XMLHttpRequest in the browser and an instance of http.ClientRequest in node.js 🐛"
              );
            } else {
              console.log("Error", error.message);
              message.channel.send(
                "🤖 Something happened in setting up the request that triggered an Error 🐛"
              );
            }
            console.log(error.config);
          }),
        axios.get("https://quotes.rest/qod.json").catch(function (error) {
          if (error.response) {
            console.log(error.response.data);
            console.log(error.response.status);
            console.log(error.response.headers);
            message.channel.send(
              "🤖 The request was made and the server responded with a status code that falls out of the range of 2xx 🐛"
            );
          } else if (error.request) {
            console.log(error.request);
            message.channel.send(
              "🤖 The request was made but no response was received `error.request` is an instance of XMLHttpRequest in the browser and an instance of http.ClientRequest in node.js 🐛"
            );
          } else {
            console.log("Error", error.message);
            message.channel.send(
              "🤖 Something happened in setting up the request that triggered an Error 🐛"
            );
          }
          console.log(error.config);
        }),
        axios
          .get(
            `https://api.giphy.com/v1/gifs/random?tag=cat&rating=g&api_key=${process.env.GIPHY_API_KEY}`
          )
          .catch(function (error) {
            if (error.response) {
              console.log(error.response.data);
              console.log(error.response.status);
              console.log(error.response.headers);
              message.channel.send(
                "🤖 The request was made and the server responded with a status code that falls out of the range of 2xx 🐛"
              );
            } else if (error.request) {
              console.log(error.request);
              message.channel.send(
                "🤖 The request was made but no response was received `error.request` is an instance of XMLHttpRequest in the browser and an instance of http.ClientRequest in node.js 🐛"
              );
            } else {
              console.log("Error", error.message);
              message.channel.send(
                "🤖 Something happened in setting up the request that triggered an Error 🐛"
              );
            }
            console.log(error.config);
          }),
        axios
          .get(
            `https://api.nasa.gov/planetary/apod?api_key=${process.env.NASA_API_KEY}&hd=true`
          )
          .catch(function (error) {
            if (error.response) {
              console.log(error.response.data);
              console.log(error.response.status);
              console.log(error.response.headers);
              message.channel.send(
                "🤖 The request was made and the server responded with a status code that falls out of the range of 2xx 🐛"
              );
            } else if (error.request) {
              console.log(error.request);
              message.channel.send(
                "🤖 The request was made but no response was received `error.request` is an instance of XMLHttpRequest in the browser and an instance of http.ClientRequest in node.js 🐛"
              );
            } else {
              console.log("Error", error.message);
              message.channel.send(
                "🤖 Something happened in setting up the request that triggered an Error 🐛"
              );
            }
            console.log(error.config);
          }),
      ])
      .then(
        axios.spread((randomquote, quoteoftheday, giphy, nasa) => {
          const quoteEmbed = new Discord.MessageEmbed()
            .setColor("#5DBCD2")
            .setAuthor(
              randomquote.data.author,
              "https://robohash.org/CodeCareer.io.png"
            )
            .setThumbnail(nasa.data.hdurl)
            .setTitle("⚡ Motivational Quote 🎯 🌕 🚀 ✨")
            .setURL("https://CodeCareer.io/")
            .setDescription(randomquote.data.quote)
            .addField(
              "🌠 Quote Of The Day :",
              quoteoftheday.data.contents.quotes[0].quote,
              true
            )
            .addField(
              quoteoftheday.data.contents.quotes[0].author,
              quoteoftheday.data.contents.quotes[0].tags,
              true
            )
            .addField("😺", giphy.data.data.title, true)
            .setImage(giphy.data.data.image_url)
            .setFooter(
              "CodeCareer is committed to helping new developers make their first PR!",
              "https://avatars3.githubusercontent.com/u/42856887?s=200&v=4"
            )
            .setTimestamp();
          message.channel.send(quoteEmbed);
        })
      );
  } catch (error) {
    if (error.response) {
      console.log(error.response.data);
      console.log(error.response.status);
      console.log(error.response.headers);
      message.channel.send(
        "🤖 The request was made and the server responded with a status code that falls out of the range of 2xx 🐛"
      );
    } else if (error.request) {
      console.log(error.request);
      message.channel.send(
        "🤖 The request was made but no response was received `error.request` is an instance of XMLHttpRequest in the browser and an instance of http.ClientRequest in node.js 🐛"
      );
    } else {
      console.log("Error", error.message);
      message.channel.send(
        "🤖 Something happened in setting up the request that triggered an Error 🐛"
      );
    }
    console.log(error.config);
  }
};
