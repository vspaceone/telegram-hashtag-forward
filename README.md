# Telegram Hashtag Forward

Telegram bot that forwards messages with a given hashtag to another group chat.

## Run the bot server
Different ways of running the bot server.

  * Docker: [vspaceone/telegram-hashtag-forward](https://hub.docker.com/r/vspaceone/telegram-hashtag-forward)
  * Docker Compose (example file in repository)
  * Vanilla (usual nodejs magic)

## Bot

### Configuration

To configure the bot fully you need to provide either the config.json or an empty one when using environment variables instead (recommended usage for the docker images).

```
{
    "token": "12345",
    "hashtag": "#Forward",
    "sourceChatId": 00000,
    "targetChatId": 00001,
    "forwardTargetMessage": "This message has been forwarded:",
    "forwardSourceMessage": "The message was forwarded!"
}
```

`token`: (Required) The bot token generated by the Botfather

`hashtag`: (Required) The hashtag which indicates messages that should be forwarded

`sourceChatId`: (Optional) Id of the source channel, which will be polled for messages that need to be forwarded.  
If this is omitted, the bot will land in configuration mode and output the current chat id when `\help` command is sent.

`targetChatId`: (Optional) Id of the target channel, where messages will be forwarded to.  
If this is omitted, the bot will land in configuration mode and output the current chat id when `\help` command is sent.

`forwardTargetMessage`: (Optional) A message that will be put before the forwarded one in the target chat if this is set.

`forwardSourceMessage`: (Optional) A message that will be put after the forwarded one in the source chat if this is set.

### Botfather

The Bothfather needs to be asked to configure the bot as following:

* Allow Groups
* Group Privacy Off 

### Setup procedure

1. Ask the Botfather to create you a bot with an API token. Configure the bot as described in the [Botfather](#Botfather) chapter.
1. Select your favorite method of running this application and configure token and the hashtag you want to use as described in the [Configuration](#Configuration) chapter and run it.
1. Add the bot to both your source and target groups where you will be able to get the chat ids by typing `/help`.
1. Add those ids also to your config and restart the application.
1. (Optional) You can also add messages that will be sent as confirmation/information in source/target chats respectively before restarting.
1. Enjoy!