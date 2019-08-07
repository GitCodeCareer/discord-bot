const db = require("../utils/db");
const config = require("../utils/config");
const auth = require("../utils/auth");

function runCommand(option, message, args) {

    const availableOptions = {
        '-init': init,
        "-list": listSectionals,
        "-new": def,
        "-update-content": updateSectionContent,
        "-update-header": updateSectionHeader,
        "-delete": deleteSection,
        "-reload": reloadSections,
        "-h": def,
        "-help": def,
        default: def
    }

    return (availableOptions[option] || availableOptions.default)(message, args);
}

exports.run = async (message, args) => {

    let member = message.guild.members.find(
        m => m.id === message.author.id
    );

    if (!auth.isAdmin(member))
        return message.channel.send("`[ℹ]: You must be an admin in order to run this command.`");

    runCommand(args[0], message, args);

}

async function init(message, args) {
    // list of all the sectionals needs to be added
    const sections = [
        ["community-rules", "https://i.imgur.com/VgmjM84.png"],
        ["role-hierarchy", "https://i.imgur.com/8xRbLSb.png"],
        ["server-information", "https://i.imgur.com/ULdJ9EH.png"],
        ["open-source", "https://i.imgur.com/MrkZ96M.png"],
        ["donate", "https://i.imgur.com/qyFYSY2.png"],
        ["server-invite", "https://i.imgur.com/lUXjLAu.png"]
    ];

    // check if collection already exist
    const ref = await db.getDatabase().ref("config/sectionals");
    const snapshot = await ref.once("value");
    if (!snapshot.exists()) {
        await addSectionFieldsDB(sections);
    }

    const data = (await getAllData()).toJSON();

    const channel = message.guild.channels.find(
        ch => ch.id == config.getChannel("information")
    )

    for (section of Object.keys(data)) {
        if (!data[section]["content_message_id"]) {
            const msg = await channel.send({ files: [data[section]["img_header_url"]] })
            const msg2 = await msg.channel.send("<content>")
            await db.updateData(`/config/sectionals/${section}`, {
                "content_message_id": msg2.id,
                "header_message_id": msg.id
            })
        }
    }

}

async function updateSectionContent(message, args) {
    // new content to update
    const newContent = args.slice(2, args.length).join(" ");
    // sectionObject: as stored in firebase db
    // args[1]: name of the section passed as an argument
    const sectionObject = (await getAllData()).toJSON()[args[1]];
    if (!sectionObject)
        return message.channel.send(`\`[❌]: Cannot understand section name "${args[1]}"\``);
    const discord_message_id = sectionObject["content_message_id"];
    // default information channel -- may cause trouble if not updated in db
    const info_channel = message.guild.channels.find(
        ch => ch.id === config.getChannel("information")
    );
    // message previously sent on channel
    const discord_message = await info_channel.fetchMessage(discord_message_id);
    await discord_message.edit(newContent);
    // update message content in firebase db
    await updateSection(args[1], { "message_content": newContent });
}

async function updateSectionHeader(message, args) {

    const headerURL = args[2];
    // sectionObject: as stored in firebase db
    // args[1]: name of the section passed as an argument
    const sectionObject = (await getAllData()).toJSON()[args[1]];
    if (!sectionObject)
        return message.channel.send(`\`[❌]: Cannot understand section name "${args[1]}"\``);
    const discord_message_id = sectionObject["header_message_id"];
    // default information channel -- may cause trouble if not updated in db
    const info_channel = message.guild.channels.find(
        ch => ch.id === config.getChannel("information")
    );
    // message previously sent on channel
    const discord_message = await info_channel.fetchMessage(discord_message_id);
    await discord_message.edit({ files: [headerURL] });
    // update message content in firebase db
    await updateSection(args[1], { "img_header_url": headerURL });
}

/* addSectionalFields: update db with empty section fields */
async function addSectionFieldsDB(sections) {

    const updateObj = {};
    for (section of sections) {
        updateObj[section[0]] = {
            "img_header_url": section[1],
            "header_message_id": "",
            "content_message_id": "",
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

/* getAllData: fetch all the section data.
if sectional data does not exist, it will initialise
database with empty section fields by calling 
addSectionalFields(). */
async function getAllData() {
    const ref = await db.getDatabase().ref('/config/sectionals');
    const data = await ref.once("value");
    if (data.val() === null)
        return null;
    return data;
}

async function listSectionals(message, args) {
    const data = (await getAllData()).toJSON();
    return message.channel.send(`Server has following sections: \`${Object.keys(data).join(", ")}\``);
}

async function collectionExist(path) {
    const ref = await db.getDatabase().ref(path);
    const snapshot = await ref.once("value");
    return snapshot.exists();
}

async function deleteSection(message, args) {
    const sectionName = args[1];
    if (!collectionExist(`config/sectionals/${sectionName}`))
        return message.channel.send(`\`[ℹ️]: Cannot delete "${sectionName}" -- It does not exist.\``);
    const sectionData = (await getAllData()).toJSON()[sectionName];
    const info_channel = message.guild.channels.find(
        ch => ch.id === config.getChannel("information")
    );
    const discord_message_content = await info_channel.fetchMessage(sectionData["content_message_id"]);
    const discord_message_header = await info_channel.fetchMessage(sectionData["header_message_id"]);
    await discord_message_content.delete();
    await discord_message_header.delete();
    await db.deleteData(`config/sectionals/${sectionName}`);

}

async function reloadSections(message, args) {
    const data = (await getAllData()).toJSON();
    const info_channel = message.guild.channels.find(
        ch => ch.id === config.getChannel("information")
    );
    for(section of Object.keys(data)) {
        let discord_message_content = await info_channel.fetchMessage(data[section]["content_message_id"]);
        let discord_message_header = await info_channel.fetchMessage(data[section]["header_message_id"]);
        await discord_message_content.delete();
        await discord_message_header.delete();
    
        const msg = await info_channel.send({ files: [data[section]["img_header_url"]] })
        const msg2 = await msg.channel.send(data[section]["message_content"] || "<content>");
        await db.updateData(`/config/sectionals/${section}`, {
            "content_message_id": msg2.id,
            "header_message_id": msg.id
        })
    }
}

function def(message, args) {
    message.channel.send(`\`[❌]: Unknown option "${args[0]}"\``);
}