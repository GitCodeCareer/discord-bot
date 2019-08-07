const db = require("../utils/db");
const config = require("../utils/config");
const { Message } = require("discord.js");

const sections = [
    "community_rules",
    "donate",
    "open_source",
    "role_hierrarchy",
    "server_information",
    "server_invite"
];

function runCommand(option) {
    const availableOptions = {
        '--init': def,
        "--update-content": updateSectionContent,
        "--update-header": def,
        "--delete": def,
        default: def
    }

    return (availableOptions[option] || availableOptions.default)(message, args);
}

exports.run = async (message, args) => {
    
    const rawData = await getAllSectionalData();
    const data = rawData.toJSON()
    const channel = message.guild.channels.find(
        ch => ch.id == config.getChannel("information")
    )
    for(section of Object.keys(data)) {
        if (!data[section]["message_id"]) {
            const msg = await channel.send({files: [data[section]["img_header_url"]]})
            const msg2 = await msg.channel.send("<content>")
            await db.updateData(`/config/sectionals/${section}`, { "message_id": msg2.id })
        }
    }
    console.log(args);
    runCommand(args[0]);

}

async function updateSectionContent(message, args) {
    const sectionName = args[1];
    const content = args.slice(2, args.length).join(" ");
    const msg = new Message(
        channel = config.getChannel("information"), 
        id = getSectionData()["message_id"]
    );
    msg.edit(content);
    await updateSection(sectionName, content);
    message.channel.send("Finished!");
}

/* addSectionalFields: update db with empty section fields */
async function addSectionalFields() {
    const updateObj = {};
    for(section of sections) {
        updateObj[section] = {
            "img_header_url": "https://i.imgur.com/Bhs3CcI.png",
            "message_id": "",
            "message_content": ""
        }
    }
    await db.updateData(`/config/sectionals`, updateObj);
}

async function updateSection(sectionName, obj) {
    const ref = await db.getDatabase().ref(`/config/sectionals/${sectionName}`);
    const responseData = await ref.once("value");
    if (responseData.val() === null)
        return console.log("No such section exists ... exiting");
    await db.updateData(`/config/sectionals/${sectionName}`, obj);
    return console.log("Section updated successfully.")
}

/* getAllSectionalData: fetch all the section data.
if sectional data does not exist, it will initialise
database with empty section fields by calling 
addSectionalFields(). */
async function getAllSectionalData() {
    const ref = await db.getDatabase().ref('/config/sectionals');
    const data = await ref.once("value");
    if (data.val() === null) {
        await addSectionalFields();
        return getAllSectionalData();
    }
    return data;
}

function getSectionData(sectionName) {
    const rawData = getAllSectionalData();
    const data = rawData.toJSON();
    return data[sectionName];
}

function def() {
    console.log("meh...");
}