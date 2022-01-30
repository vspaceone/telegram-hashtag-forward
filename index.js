const TelegramBot = require('node-telegram-bot-api');
const config = require("./config/config.json")

const token = envIfUndefined(config.token, "THF_BOT_TOKEN")
const hashtag = envIfUndefined(config.hashtag, "THF_HASHTAG")
const sourceChatId = envIfUndefined(config.sourceChatId, "THF_SOURCE_CHAT_ID")
const targetChatId = envIfUndefined(config.targetChatId, "THF_TARGET_CHAT_ID")
const forwardMessage = envIfUndefined(config.forwardSourceMessage, "THF_SOURCE_CHAT_MESSAGE")
const forwardTargetMessage = envIfUndefined(config.forwardTargetMessage, "THF_TARGET_CHAT_MESSAGE")

preFlightCheck()

// Event handlers

const bot = new TelegramBot(token, {polling: true});

bot.on("polling_error", console.log);

bot.on('message', (msg) => {
    const chatId = msg.chat.id;

    if (!areSourceAndTargetSet() && isHelpCommand(msg)) {
        sendConfigHelp(chatId)
        return;
    } else if (chatId !== sourceChatId){
        console.error("Chat id does not match.")
        return;
    }

    if (isHelpCommand(msg)){
        sendHelp(chatId)
        return;
    } else if (isForwardRequested(msg)) {
        forwardMsg(msg, chatId)
    }
});

// Actions

function preFlightCheck(){
    if (token === undefined || hashtag === undefined){
        console.log("You need to configure a bot token and a hashtag!")
        process.exit(1)
    }
    
    if (!areSourceAndTargetSet()){
        console.log("No source and no target chat defined.")
    }
    
    if (areSourceAndTargetSet() && sourceChatId === targetChatId){
        console.log("Source and target can not be equal.")
        process.exit(1)
    }
}

async function sendConfigHelp(chatId){
    let help = `Hello, 
I'm a forwarding bot but am not configured fully yet.
Please configure the source and chat ids you want me to work with!
This chat hat the following id: ${chatId}     
    `

    bot.sendMessage(chatId, help);
    return;
}

async function sendHelp(chatId){
    const me = await bot.getMe();
    
    const sourceChat = await bot.getChat(sourceChatId);
    const targetChat = await bot.getChat(targetChatId);

    let help = `Hello, 
my name is ${me.first_name}.
I'm a forwarding bot and working actively in this chat.
All messages in "${sourceChat.title}" including the hashtag ${hashtag} will be forwarded to "${targetChat.title}".

I'm not capable of doing more than this currently, but I'm hopefully still useful to you :)

    `

    bot.sendMessage(chatId, help);
}

async function forwardMsg(msg, chatId){
    if (forwardMessage !== undefined){
        bot.sendMessage(chatId, forwardMessage);
    }
    if (forwardTargetMessage !== undefined){
        bot.sendMessage(targetChatId, forwardTargetMessage);
    }
    bot.forwardMessage(targetChatId, chatId, msg.message_id)
}

// Helpers

function envIfUndefined(val, env){
    if (val !== undefined){
        return val;
    }
    return process.env[env]
}

function areSourceAndTargetSet(){
    return sourceChatId !== undefined && targetChatId !== undefined
}

function isHelpCommand(msg){
    return (msg.text !== undefined && msg.text.startsWith("/help"))
}

function isForwardRequested(msg){
    return (msg.text !== undefined && msg.text.includes(hashtag)) || (msg.caption !== undefined && msg.caption.includes(hashtag))
}