/**
 * command_name: sectional
 * version: 1.0.0
 * description: set/delete/update section content in information channel.
 * author: ap4gh(Github), debjay(on CodeCareer Discord Server)
 * license: MIT https://opensource.org/licenses/MIT
 */

const { db, config, auth } = require("../utils");

exports.run = async (message, args) => {
    // check if member is eligible to run this command.
    let member = message.guild.members.find(m => m.id === message.author.id);
    if (!auth.isAdmin(member))
        return message.channel.send("`[ℹ]: You must be an admin in order to run this command.`");

    // screen option and execute command. 
    // args[0]: option name
    runCommand(args[0], message, args);

}

/** runCommand: screen option and execute command. */
function runCommand(option, message, args) {
    // list of all available options
    const availableOptions = {
        '--init': init,
        "--list": listSections,
        "--update-content": updateContent,
        "--update-header": updateHeader,
        "--delete": deleteSection,
        "--reload": reloadSections,
        "-h": showHelp,
        "--help": showHelp,
        usual: usual
    }
    return (availableOptions[option] || availableOptions.usual)(message, args);

}

// usual/default response
function usual(message, args) {
    message.channel.send(`\`[❌]: Unknown option "${args[0]}"\``);
}

/** init: setup sectionals in database and server channel. */
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

    // check if sectionals already exist.
    if (await collectionExist("config/sectionals")) 
        return message.channel.send(`\`[ℹ️]: Sectionals were initialized once. If you wish to do so again, first delete existing data from database.\``);

    // add sectional fields in database.
    await addSectionFieldsDB(sections);

    // get newly saved data in JSON from database.
    const savedDataJSON = (await getAllData()).toJSON();

    // default channel to send messages.
    const channel = message.guild.channels.find(ch => ch.id == config.getChannel("information"))
    
    for (sectionName of Object.keys(savedDataJSON)) {
        if (!savedDataJSON[sectionName]["content_message_id"]) {
            const msg = await channel.send({ files: [savedDataJSON[sectionName]["img_header_url"]] });
            const msg2 = await msg.channel.send(`${sectionName} <content>`);
            // save sent messages ID for future edits
            await db.updateData(`/config/sectionals/${sectionName}`, {
                "content_message_id": msg2.id,
                "header_message_id": msg.id
            });
        }
    }

}

/** listSections: Sends a list of all saved sections in database. */
async function listSections(message, args) {
    const data = (await getAllData()).toJSON();
    return message.channel.send(`Server has following sections: \`${Object.keys(data).join(", ")}\``);
}

/** updateContent: set/update message content for a section. */
async function updateContent(message, args) {
    // new content to update
    const newContent = args.slice(2, args.length).join(" ");

    // sectionObject: as stored in firebase db
    // args[1]: name of the section passed as an argument
    const sectionObject = (await getAllData()).toJSON()[args[1]];
    if (!sectionObject)
        return message.channel.send(`\`[❌]: Cannot find section "${args[1]}" in database.\``);

    // default information channel -- may cause trouble if not updated in db
    const info_channel = message.guild.channels.find(ch => ch.id === config.getChannel("information"));

    // discord message previously sent on channel
    const discord_message = await info_channel.fetchMessage(sectionObject["content_message_id"]);

    // edit message with new content
    await discord_message.edit(newContent);

    // update message content in firebase db
    await updateSection(args[1], { "message_content": newContent });
}

/** updateHeader: set/update header url of a section. */
async function updateHeader(message, args) {
    // new header url passed through command. args[2]: headerURL argument
    const headerURL = args[2];

    // sectionObject: as stored in firebase db
    // args[1]: name of the section passed as an argument
    const sectionObject = (await getAllData()).toJSON()[args[1]];
    if (!sectionObject)
        return message.channel.send(`\`[❌]: Cannot understand section name "${args[1]}"\``);

    // message previously sent on channel
    const discord_message = await info_channel.fetchMessage(sectionObject["header_message_id"]);

    // default information channel -- may cause trouble if not updated in db
    const info_channel = message.guild.channels.find(ch => ch.id === config.getChannel("information"));

    // edit message with new Header URL
    await discord_message.edit({ files: [headerURL] });

    // update message content in firebase db, args[1]: section name
    await updateSection(args[1], { "img_header_url": headerURL });
}

/** deleteSection: completely delete section(data and messages). */
async function deleteSection(message, args) {
    // args[1]: sectionName
    const sectionName = args[1];
    // check if sectioName does not exist
    if (!collectionExist(`config/sectionals/${sectionName}`))
        return message.channel.send(`\`[ℹ️]: Cannot delete "${sectionName}" -- It does not exist.\``);
    // retrive existing section data
    const sectionData = (await getAllData()).toJSON()[sectionName];
    // delete messages from discord channel
    const info_channel = message.guild.channels.find(ch => ch.id === config.getChannel("information"));
    const discord_message_content = await info_channel.fetchMessage(sectionData["content_message_id"]);
    const discord_message_header = await info_channel.fetchMessage(sectionData["header_message_id"]);
    await discord_message_content.delete();
    await discord_message_header.delete();
    // delete data from database
    await db.deleteData(`config/sectionals/${sectionName}`);

}

/** reloadSections: delete and re-send sectionals on discord. */
async function reloadSections(message, args) {
    /**
     * In case if the changes does not display
     * on discord, user can pass this option
     * to re-upload sections with new data from
     * database.
     */
    const sectionObject = (await getAllData()).toJSON();
    const info_channel = message.guild.channels.find(ch => ch.id === config.getChannel("information"));

    for(section of Object.keys(sectionObject)) {
        // delete existing messages
        let discord_message_content = await info_channel.fetchMessage(sectionObject[section]["content_message_id"]);
        let discord_message_header = await info_channel.fetchMessage(sectionObject[section]["header_message_id"]);
        await discord_message_content.delete();
        await discord_message_header.delete();
        // send messages with new data
        const msg = await info_channel.send({ files: [sectionObject[section]["img_header_url"]] })
        const msg2 = await msg.channel.send(sectionObject[section]["message_content"] || "<content>");
        // update database with new message IDs.
        await db.updateData(`/config/sectionals/${section}`, {
            "content_message_id": msg2.id,
            "header_message_id": msg.id
        })
    }
}

/** showHelp: Display manual for this command. */
function showHelp(message, args) {
    /** NOTE: move to manuals directory. */
    message.channel.send(`
\`\`\`
NAME
    !sectional -- set/delete/update section content in information channel.

RUN LEVEL
    0: Admin
    Only Admins can run this command.

OPTIONS
    --init                   initialize sections in database and channel
    --list                   list all existing sections
    --update-content         set section content of a section
    --update-header          set section header image url
    --delete                 completely remove section
    --reload                 re-upload sections with new data
    --help or -h             display manual for this command

EXAMPLES
    If you want to update section's text content:
        >>!sectional --update-content donate https://codecareer.io/donate

    Use codeblock, bold, italic etc. to beautify content
        >>!sectional --update-content community-rules <three-backticks>
        1. Rule ...
        2. Rule ...
        <three-backticks>

    Delete a section
        >>!sectional --delete server-info

NOTE
    If you want to update header image, first update image url with:
        >>!sectional --update-header server-info http://img.com/myImg
    Then reload the sections to see updates
        >>!sectional --reload

\`\`\`
    `);

}

/** ---------------
 * HELPER FUNCTIONS
 * ----------------*/


/* addSectionalFields: update db with empty section fields. */
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

/* getAllData: return sectional collection object. */
async function getAllData() {
    const ref = await db.getDatabase().ref('/config/sectionals');
    const data = await ref.once("value");
    if (data.val() === null)
        return null;
    return data;
}

/** updateSection: update a section with new data(obj). */
async function updateSection(sectionName, obj) {
    const ref = await db.getDatabase().ref(`/config/sectionals/${sectionName}`);
    const responseData = await ref.once("value");
    if (responseData.val() === null)
        return console.log("`ERROR: No such section exists ... `");
    await db.updateData(`/config/sectionals/${sectionName}`, obj);
}

/** collectionExist: check if requested collection exist in database. */
async function collectionExist(path) {
    const ref = await db.getDatabase().ref(path);
    const snapshot = await ref.once("value");
    return snapshot.exists();
}