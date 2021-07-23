const aoijs = require("aoi.js");
const express = require("express");
require('dotenv').config();

const bot = new aoijs.Bot({
  token: process.env.TOKEN,
  prefix: ["+", "<@$clientID>"]//Change prefix ! if you like
});

const app = express();

app.use(express.static("public"));

app.get("/", (request, response) => {
  response.sendFile(__dirname + "/index.html");
});
// This will return a simple website

const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
// This will listen on port.

bot.onMessage({
  respondToBots: false
});
// This will ignore bots from executing the commands

bot.command({
  name:"ping",
  code:`:ping_pong: Pong! \`$ping ms\``
});
// This will be the first command for your bot
// It will return the websocket ping

bot.status({
  text:"in $serverCount/100 guilds", // This sets the message status
  type:"PLAYING",
  time:12
});

bot.status({
  text: "$allMembersCount members in $serverCount servers", 
  type: "WATCHING", 
  time: 12
});
// This will be the bot status 

bot.variables({
    warn: "0",
    mute: "0"
  })

bot.command({
  name: "ban",
  code: `$argsCheck[1;Invalid command usage, try using it like:
+ban [member] (optional reason)

Example:
+ban @user/ID optional reason]
  $author[$userTag[$findUser[$message[1];no]] has been banned;$userAvatar[$findUser[$message[1];no]]
  $description[**Moderator:** $userTag[$authorID]
  **Reason:** $replaceText[$replaceText[$checkCondition[$messageSlice[1]==];true;A reason wasn't provided.];false;$messageSlice[1]]]
  $color[FF0000]
  $addTimestamp
  $ban[$findUser[$message[1];no];$replaceText[$replaceText[$checkCondition[$messageSlice[1]==];true;A reason wasn't provided.];false;$messageSlice[1]]]
  $onlyBotPerms[ban;I need \`Ban\` permission to do this]
  $onlyPerms[ban;you need \`Ban\` permission to do this]
  $onlyIf[$findUser[$message[1];no]!=$authorID;you can't ban yourself]
  $onlyIf[$findUser[$message[1];no]!=$ownerID;you can't ban the owner of the server]
  $onlyIf[$isBanned[$findUser[$message[1];no]]==false;that user was already banned from the server]
  $onlyIf[$findUser[$message[1];no]!=$clientID;you can't ban me with myself]
  $onlyIf[$rolePosition[$highestRole[$clientID]]<$rolePosition[$highestRole[$findUser[$message[1];no]]];the highest role of the user you are trying to kick is higher than my highest role]
  $suppressErrors[user not found]`
})

bot.command({
  name: "kick",
  code: `$argsCheck[1;❌ **incorrect usage**
  
  ✅ correct usage: =kick @user/ID optional reason]
  $author[$userTag[$findUser[$message[1];no]] has been kicked;$userAvatar[$findUser[$message[1];no]]
  $description[**Moderator:** $userTag[$authorID]
  **Reason:** $replaceText[$replaceText[$checkCondition[$messageSlice[1]==];true;A reason wasn't provided.];false;$messageSlice[1]]]
  $color[ffd84d]
  $addTimestamp
  $kick[$findUser[$message[1];no];$replaceText[$replaceText[$checkCondition[$messageSlice[1]==];true;A reason wasn't provided.];false;$messageSlice[1]]]
   $onlyBotPerms[kick;I need \`Kick\` permission to do this]
  $onlyPerms[ban;you need \`Kick\` permission to do this]
  $onlyIf[$findUser[$message[1];no]!=$authorID;you can't kick yourself]
  $onlyIf[$findUser[$message[1];no]!=$ownerID;you can't kick the owner of the server]
  $onlyIf[$isBanned[$findUser[$message[1];no]]==false;that user is banned from the server]
  $onlyIf[$findUser[$message[1];no]!=$clientID;you can't kick me with myself]
  $onlyIf[$rolePosition[$highestRole[$clientID]]<$rolePosition[$highestRole[$findUser[$message[1];no]]];the highest role of the user you are trying to kick is higher than my highest role]
  $suppressErrors[user not found]`
})

bot.command({
  name: "setmuterole",
  aliases: "setmute",
  code: `$argsCheck[1;❌ **incorrect usage**
  
  ✅ correct usage:  =setmuterole @role/ID]
  $author[$userTag[$authorID];$userAvatar[$authorID]]
  $description[the <@&$findRole[$message[1]]> role has been established as a mute role]
  $color[$getRoleColor[$findRole[$message[1]]]]
  $addTimestamp
  $onlyIf[$roleExists[$findRole[$message[1]]]==true;that role doesn't exist]
  $onlyPerms[manageroles;you need \`Manage roles\` permission]
  $onlyBotPerms[manageroles;I need \`Manage roles\` permission]
    $onlyIf[$rolePosition[$highestRole[$clientID]]<$rolePosition[$findRole[$message[1]]];my highest role is lower than the role you choose]
    $suppressErrors[role not found]
  $setServerVar[mute;$findRole[$message[1]];$guildID]`
  })
  
bot.command({
  name: "mute",
  code: `$author[$userTag[$findUser[$message[1];no]] has been muted;$userAvatar[$findUser[$message[1];no]]]
    $description[**Moderator:** $userTag[$authorID]
    **Reason:** $replaceText[$replaceText[$checkCondition[$messageSlice[1]==];true;A reason wasn't provided.];false;$messageSlice[1]]]
    $color[$getRoleColor[$getServerVar[mute;$guildID]]]
    $addTimestamp
    $onlyIf[$hasRole[$findUser[$message[1];no];$getServerVar[mute]]==false;this user was already muted]
    $onlyPerms[manageroles;you need \`Manage roles\` permission]
  $onlyBotPerms[manageroles;I need \`Manage roles\` permission]
  $onlyIf[$roleExists[$getServerVar[mute;$guildID]]==true;you didn't set the mute role]
    $onlyIf[$rolePosition[$highestRole[$clientID]]<$rolePosition[$findRole[$getServerVar[mute;$guildID]]];my highest role is lower than the mute role]
    $giveRole[$findUser[$message[1];no];$getServerVar[mute]]
  $onlyIf[$hasRole[$findUser[$message[1];$getServerVar[mute]]]==false;this user was already muted]
  $argsCheck[>1;❌ **incorrect usage**
  
  ✅ correct usage: =unmute @user/ID optional reason]
    $suppressErrors[user not found]`
})

bot.command({
  name: "unmute",
  code: `$author[$userTag[$findUser[$message[1];no]] has been unmuted;$userAvatar[$findUser[$message[1];no]]]
    $description[**Moderator:** $userTag[$authorID]
    **Reason:** $replaceText[$replaceText[$checkCondition[$messageSlice[1]==];true;A reason wasn't provided.];false;$messageSlice[1]]]
    $color[$getRoleColor[$getServerVar[mute;$guildID]]]
    $addTimestamp
    $onlyIf[$hasRole[$findUser[$message[1];no];$getServerVar[mute]]==true;this user was already unmuted]
    $onlyPerms[manageroles;you need \`Manage roles\` permission]
  $onlyBotPerms[manageroles;I need \`Manage roles\` permission]
  $onlyIf[$roleExists[$getServerVar[mute;$guildID]]==true;you didn't set the mute role]
    $onlyIf[$rolePosition[$highestRole[$clientID]]<$rolePosition[$findRole[$getServerVar[mute;$guildID]]];my highest role is lower than the mute role]
    $takeRole[$findUser[$message[1];no];$getServerVar[mute]]
    $argsCheck[>1;❌ **incorrect usage**
  
  ✅ correct usage: =unmute @user/ID optional reason]
    $suppressErrors[user not found]`
})

bot.command({
  name: "warn",
  code: `$author[$userTag[$findUser[$message[1];no]] has been warned;$userAvatar[$findUser[$message[1];no]]]
  $title[**Moderator:** $userTag[$authorID]]
  $description[**Reason:** $replaceText[$replaceText[$checkCondition[$messageSlice[1]==];true;A reason wasn't provided.];false;$messageSlice[1]]]
  $color[RANDOM]
  $addTimestamp
  $setUserVar[warn;$sum[$getUserVar[warn;$findUser[$message[1];no]];1];$findUser[$message[1];no]]
  $onlyIf[$isBot[$findUser[$message[1];no]]==false;you can't warn bots]
  $onlyPerms[kick;you need \`Kick\` permission]
  $onlyIf[$findUser[$message[1];no]!=$ownerID;you can't warn the owner of the server]
  $onlyIf[$findUser[$message[1];no]!=$authorID;you can't warn yourself]
  $argsCheck[>1;❌ **incorrect usage**
  
  ✅ correct usage: =warn @user/ID optional reason]
  $suppressErrors[user not found]`
})

bot.command({
  name: "infractions",
  code: `$author[$userTag[$findUser[$message[1];no]];$userAvatar[$findUser[$message[1];no]]]
  $title[Have: $getUserVar[warn;$findUser[$message[1]]] infractions]
  $description[]
  $addTimestamp
  $onlyIf[$isBot[$findUser[$message[1];no]]==false;Bots cannot have warnings]
  $onlyIf[$findUser[$message[1];no]!=$ownerID;the server owner cannot have warnings]
  $argsCheck[>1;❌ **incorrect usage**
  
  ✅ correct usage: =infractions @user/ID]
  $suppressErrors[user not found]`
})

bot.command({
  name: "clearwarnings",
  code: `$author[$userTag[$authorID];$userAvatar[$authorID]]
  $title[$message[last] warnings cleared from $userTag[$findUser[$message[1];no]]]
  $description[]
  $addTimestamp
  $onlyIf[$isBot[$findUser[$message[1];no]]==false;Bots cannot have warnings]
  $onlyIf[$findUser[$message[1];no]!=$ownerID;the server owner cannot have warnings]
  $onlyPerms[kick;you need \`Kick\` permission]
  $onlyIf[$isNumber[$message[last]]==true;please write a valid number of warnings to clean from the user]
  $onlyIf[$getUserVar[warn;$findUser[$message[1]]]<=$message[last];the user does not have that amount of warnings to clean]
  $onlyIf[$checkContains[$message[last];-]==false;please write a valid **positive number** of warnings to clean from the user]
    $setUserVar[warn;$sub[$getUserVar[warn;$findUser[$message[1];no]];$message[last]];$findUser[$message[1];no]]
  $argsCheck[>1;❌ **incorrect usage**
  
  ✅ correct usage: =clearwarnings @user/ID (number)]
  $argsCheck[>2;❌ **incorrect usage**
  
  ✅ correct usage: =clearwarnings @user/ID (number)]
  $suppressErrors[failed to clear the warnings]`
  });
  
 bot.command({
   name: "say", 
   code: `$noMentionMessage`
 });
 
bot.command({
  name: "eval", 
  code: `$eval[$message]
  $onlyForIDs[846570529838071808;Only bot developers can use this command]
  `});
  
bot.command({
  name: "lock", 
  code: `
$onlyPerms[manageserver;Only admins can use this command]
$if[$message==]
$modifyChannelPerms[$channelID;-sendmessages;$guildID]
**🔒Locked down $channelName[$channelID]**
$else
$modifyChannelPerms[$findChannel[$message];-sendmessages;$guildID]
**🔒Locked down $channelName[$findChannel[$message]]**
$endif`
});

bot.command({
  name: "unlock", 
  code: `
$onlyPerms[manageserver;""Only admins can use this command]
$if[$message==]
$modifyChannelPerms[$channelID;+sendmessages;$guildID]
**🔓Unlocked $channelName[$channelID]**
$else
$modifyChannelPerms[$findChannel[$message];+sendmessages;$guildID]
**🔓Unlocked $channelName[$findChannel[$message]]**
$endif`
});

 bot.command({
 name: "nuke",
 code: `
$loop[1;sendMessage]
$deleteChannels[$channelID]
$cloneChannel[$channelID]
$onlyPerms[admin;{title:Missing Permissions}{color:RANDOM}{description:You don't have \`Admin\` permissions to use this command}]
 `
});

bot.awaitedCommand({
 name: "sendMessage",
 code: `
$channelSendMessage[$channelID[$channelName];{description: **This Channel Has Been Nuke By** <@$authorID> $customEmoji[yes]}{image:https://media1.tenor.com/images/2e50750a1356ee2cf828090cbb864634/tenor.gif?itemid=4464831}{color:RANDOM}]

`
});

bot.command({
name: "purge",
aliases: ['clear,cp'], 
code: `
$if[$message[2]==]
$sendMessage[**$message[1] Messages deleted successfully**{delete:2s};no]
$clear[$message[1];everyone;$channelID;no]
$wait[2s]
$deletecommand
$onlyIf[$isNumber[$replaceText[$replaceText[$checkCondition[$message==];true;100];false;$message]]==true;:x: Please provide a valid amount! {delete:5s}]

$elseIf[$message[2]!=]
$sendMessage[**$message[2] Messages deleted successfully**{delete:2s};no]
$clear[$message[2];$findUser[$message[1]];$channelID;no]
$wait[2s]
$deletecommand
$endelseIf
$endif
$onlyPerms[managemessages;:x: You need manage messages permission {delete:2s}]
$onlyBotPerms[managemessages;:x: I don't have manage messages permission! {delete:2s}]
$onlyIf[$message!=;Usage: !purge <no.> or !purge <user> <no.>]
`
});

bot.command({
 name: "unban",
 code: `
 
$unban[$message[1];By $userTag[$authorID] Reason: $sliceMessage[1]]
$username[$message[1]] Has Been Unbanned!
$onlyBotPerms[ban;I need ban permission to unban this user]
$onlyIf[$isBanned[$message[1]]==true;User Is Not Banned]
$argsCheck[>1;Please Provide User ID To Unban!]


$onlyPerms[ban;You need ban permission]`
});

bot.command({
name: "slowmode", 
code: `$if[$message==]
$author[error! Use: +slowmode <channel> <time> <s/m/h>;$authorAvatar]
$description[
Example:
\`\`\`kt
+slowmode #general 1 s
\`\`\`
]
$color[A10A10]
$elseIf[$mentionedChannels[1]==false]
Mention a channel! 

$endelseIf
$elseIf[$isNumber[message[2]]==false]
write the time! (only one number)
$endelseIf
$elseIf[$checkCondition[$message[3];h;m;s]==false]
Write unity! \`(s/m/h)\`
$endelseIf 
$elseIf[$message[3]==s]
$slowmode[$mentionedChannels[1];$message[2]s]
The slow mode the "<#$mentionedChannels[1]>" channel has been changed to: $message[2]s

$onlyIf[$isNumber[$message[2]]==true;this not a number!]
$endelseIf
$elseIf[$message[3]==m]
$slowmode[$mentionedChannels[1];$message[2]m]
The slow mode the "<#$mentionedChannels[1]>" channel has been changed to: $message[2]m

$onlyIf[$isNumber[$message[2]]==true;this not a number!]
$endelseIf
$elseIf[$message[3]==h]
$slowmode[$mentionedChannels[1];$message[2]h]
The slow mode the "<#$mentionedChannels[1]>" channel has been changed to: $message[2]h

$onlyIf[$isNumber[$message[2]]==true;this not a number!]
$onlyIf[$message[2]<=6;You cannot put more than 6 hours!]
$endelseIf
$endif

$onlyPerms[managechannels;You need to have permissions \`MANAGE_CHANNELS\` to continue]

$onlyBotPerms[managechannels;I must have permissions \`MANAGE_CHANNELS\` to continue!]`
});

//~~ ECONOMY COMMANDS~~\\

bot.command({
 name: "deposit",
 aliases: ["dep"], 
 code: `
$color[RANDOM]
$title[Successful Transaction]
$addTimestamp
$description[$username deposited $noMentionMessage in the bank]
$setGlobalUserVar[Bank;$sum[$getGlobalUserVar[Bank;$authorID];$noMentionMessage];$authorID]
$setGlobalUserVar[Money;$sub[$getGlobalUserVar[Money;$authorID];$noMentionMessage];$authorID]
$onlyIf[$noMentionMessage<=$sub[$getGlobalUserVar[banklimit;$authorID];$getGlobalUserVar[Bank;$authorID]];You don’t have enough space in your bank,sorry!!]
$onlyIf[$noMentionMessage<=$getGlobalUserVar[Money;$authorID];Duh! You don’t have enough money.]
$onlyIf[$message[1]>=1;Try position number]
$suppressErrors[{title:Error} {description:Invalid usage please try: \`+deposit (amount)\`} {color:7f00ff}]`
});

bot.awaitedCommand ({
    name: "balance",
    code: `
$if[$isNumber[$message[1]]==true]
$author[$userTag[$splitText[$message[1]]];$serverIcon[$guildID]]
$addTimestamp
$description[**Wallet:** $numberSeparator[$getGlobalUserVar[Money;$splitText[$message[1]]]]
  **Bank:** $numberSeparator[$getGlobalUserVar[Bank;$splitText[$message[1]]]]/$numberSeparator[$getGlobalUserVar[banklimit;$splitText[$message[1]]]] ]
  $footer[Request by $userName[$authorID];$userAvatar[$authorID]]
  $color[PURPLE]
$textSplit[$getUserVar[userav];\n]

$elseIf[$toLowercase[$message[1]]==cancel]
$getVar[no] Cancelled
$endElseIf
$else
$author[$userTag[$authorID];$authorAvatar]
$author[$userName[$findUser[$authorID]]'s balance ;$serverIcon[$guildID]]
  $description[**Wallet:** $numberSeparator[$getGlobalUserVar[Money;$findUser[$authorID]]]
  **Bank:** $numberSeparator[$getGlobalUserVar[Bank;$findUser[$authorID]]]/$numberSeparator[$getGlobalUserVar[banklimit;$findUser[$authorID]]] ]
  $footer[Request by $userName[$authorID];$userAvatar[$authorID]]
  $color[PURPLE]
$addTimestamp
$addTimestamp
$endIf
$suppressErrors[$getVar[no] Cancelled]
`
});

bot.command ({
    name: "bal",
    aliases: ['balance'],
    code: `
$if[$findMembers[$message;10;{position}]!=1]
$author[$userTag[$authorID];$authorAvatar]
$description[Please choose the following...
 
$findMembers[$message;10;**{position}.)** [{tag}](https://youtu.be/Qskm9MTz2V4=16)]]
$color[PURPLE]
$awaitMessages[$authorID;1m;everything;balance;$getVar[no] Cancelled]
$setUserVar[userav;$findMembers[$message;10;{id}]]
$elseIf[$findMembers[$message;10;{position}]==1]
$author[$userName[$get[id]]'s balance ;$serverIcon[$guildID]]
  $description[
  **Wallet:** $numberSeparator[$getGlobalUserVar[Money;$get[id]]]
  **Bank:** $numberSeparator[$getGlobalUserVar[Bank;$get[id]]]/$numberSeparator[$getGlobalUserVar[banklimit;$get[id]]]]
  $footer[Request by $userName[$authorID];$userAvatar[$authorID]]
  $color[PURPLE]
$addTimestamp
$let[id;$findMembers[$message;10;{id}]]
$endElseIf
$endIf
$onlyIf[$message!=;{author:$userTag[$authorID]:$serverIcon[$guildID]}{description:**Wallet:** $numberSeparator[$getGlobalUserVar[Money;$authorID]]
**Bank:** $numberSeparator[$getGlobalUserVar[Bank;$authorID]]/$numberSeparator[$getGlobalUserVar[banklimit;$authorID]] }{color:PURPLE}{timestamp}]
$onlyIf[$findMembers[$message;10;{id}]!=;{author:$serverIcon[$guildID]}{description:**Wallet:** $numberSeparator[$getGlobalUserVar[Money;$message]]
  **Bank:** $numberSeparator[$getGlobalUserVar[Bank;$message]]$numberSeparator[$getGlobalUserVar[banklimit;$message]] }{color:PURPLE}{timestamp}]
`
});


bot.command({
 name: "work",
 code: `$title[You just worked!]
 $description[You worked as a $randomText[Fisherman;Construction Worker;Doctor;Programmer;Nurse;**Developer**;Plumber;Electrician;Actor] and gained $$numberSeparator[$random[1;1000]]!]
 $setGlobalUserVar[Money;$sum[$getGlobalUserVar[Money];$random[1;1000]];$authorID]
 $globalCooldown[10m;Hey! Take a break man, you're working too much! Why don't you work again in \`%time%\`]`
});

bot.command({
	name: 'solve',
	code: `
$setGlobalUserVar[answer;$math[$random[0001;999]$randomText[+;-;/;*]$random[1;999]]]
<@$authorid>, Whats \`$random[0001;999]$replaceText[$replaceText[$randomText[+;-;/;*];*;x];/;÷]$random[1;999]\` 🤔
$setGlobalUserVar[rest;1]
$awaitMessages[$authorid;10s;everything;answersolve;You did'nt answer in time, Goodbye!]
$globalCooldown[10s;You already run this command before, please try again in %time%!]`
})

bot.awaitedCommand({
	name: 'answersolve',
	code: `$if[$message==$getGlobalUserVar[answer]]
$randomText[Wow you got it right!;Goodjob $username!;Great stuff!;You're right], Enjoy your **$random[1;20]**
$setGlobalUserVar[Money;$sum[$getGlobalUserVar[Money];$random[1;20]]$authorid]
$onlyIf[$getGlobalUserVar[rest]==1;]
$else 

$setGlobalUserVar[rest;0]
$randomText[Wrong!;You've got it wrong :(;Wrong answer!], No reward for you $randomText[dumbie;airhead;smallhead].
$onlyIf[$getGlobalUserVar[rest]==1;]
$endif
`}) 

//~~ FUN ~~\\

bot.command({
name:"akinator",
aliases:"aki",
code:`
$djsEval[
const akinator = require('discord.js-akinator')

akinator(message, client, "en");
]
`
});

bot.command({
 name:"hack",
 code: ` 
$description[Loading process..]
$color[RANDOM]
$editIn[2s;{description:You're targeting $username[$findUser[$message;no]]}{color:RANDOM};{description:Successfully grabbed $username[$findUser[$message;no]]'s IP Address}{color:RANDOM};{description:$random[123;193].$random[12;83].$random[182;282]}{color:RANDOM};{description:Sent hitman to their house}{color:RANDOM};{description:The hitman broke into their house}{color:RANDOM};{description:$randomText[The hitman saw their email and password on the toilet seat;The hitman saw their email and password written on the wall;The hitman robbed their computer and got the email and password]}{color:RANDOM};{description:Email: $username[$findUser[$message;no]]$random[827;9102]@$randomText[gmail;yahoo;discord;business;iscool;weird;discordadmin].com
Password: $advancedtextsplit[$username[$findUser[$message;no]];a;1]$randomString[12]}{color:RANDOM};{title:Discord Token}{description:$randomString[69]}{color:RANDOM};{description:The last person that $username[$finduser[$message;no]] flirted with in DM was $username[$randomUserID]}{color:RANDOM};{description:Last message in DM "$jsonRequest[https://api.popcatdev.repl.co/8ball;answer]"}{color:RANDOM};{description:Sent all the informations to your DM}{color:RANDOM};{description:The most dangerous hack has been done by $username}{color:RANDOM};{description:Ending process.}{color:RANDOM};{description:Ending process..}{color:RANDOM};{description:Ending process...}{color:RANDOM};{description:Ending process....}{color:RANDOM};{description:Ending process...}{color:RANDOM};{description:Ending process..}{color:RANDOM};{description:Ending process.}{color:RANDOM};{description:Ended process}{color:RANDOM}]
$onlyIf[$findUser[$message;no]!=$authorId;{description:Why are you attempting to hack into yourself}{color:RED}]
$onlyIf[$findUser[$message;no]!=undefined;{description:That's not a valid user}{color:RED}]
$onlyIf[$message!=;{description:Whom do you want to hack?}{color:RED}]
    $cooldown[5s;]`});
 
//~~ UTILITY ~~~\\

bot.command({
name: "firstmessage",
aliases: ["fm"],
code: `
$author[$userTag[$getMessage[$get[ch];$get[msgID];userID]];$userAvatar[$getMessage[$get[ch];$get[msgID];userID]]]
$description[
$getMessage[$get[ch];$get[msgID];content]

[Jump To The First Message]($get[link])]
$addtimestamp[$get[timestamp]]
$let[timestamp;$djsEval[d.client.channels.cache.get('$get[ch]').messages.cache.get('$get[msgID]').createdTimestamp;yes]
$color[RANDOM]
$footer[In $channelName[$get[ch]]]
$let[link;https://discord.com/channels/$guildID/$get[ch]/$get[msgID]]
$let[msgID;$firstMessageID[$get[ch]]]
$let[ch;$findChannel[$message[1]];yes]]`
});

//~~ UTILITY ~~\\

bot.command({
 name: "addemoji",
 aliases: "upload",
 code: `$if[$stringstartswith[$message[1];https://]==true]
$addfield[Success!;Added emoji $addemoji[$message[1];$get[name];yes] under the name \`$get[name]\`]
$thumbnail[$message[1]]
$color[GREEN]
$onlyif[$message[2]!=;{title:Oops!}{description:Please submit an emoji name after sending the image URL!}{color:RED}]
$let[name;$replacetext[$messageslice[1;$argscount]; ;_;-1]]

$else
$onlyperms[manageemojis;{title:Oops!}{description:It seems you don't have the manage emojis permissions required to run this command}{color:RED}]
$onlybotperms[manageemojis;{title:Oops!}{description:It seems I don't have the manage emojis permissions required to execute this command}{color:RED}]
$addfield[Success!;Added emoji $addemoji[$messageattachment;$get[name];yes] under the name \`$get[name]\`.]
$thumbnail[$messageattachment]
$let[name;$replacetext[$messageslice[0;$argscount]; ;_;-1]]
$color[GREEN]
$onlyif[$message[1]!=;{title:Oops!}{description:Please submit an emoji name after sending the image URL!}{color:RED}]
$endif
$onlyperms[manageemojis;{title:Oops!}{description:It seems you don't have the manage emojis permissions required to run this command}{color:RED}]
$onlybotperms[manageemojis;{title:Oops!}{description:It seems I don't have the manage emojis permissions required to execute this command}{color:RED}]
$suppresserrors[{title:Oops!}{description:Uh Oh, it seems an error occurred, it is likely that the emoji is too large to upload or isn't a valid image or gif, if you're sure everything should work please report this bug!}{color:RED}]
`
 });

//~~ chatbot ~~//

 bot.command({
 name: "$alwaysExecute", 
 code: `$onlyIf[$channelID==$getServerVar[chatbotchannel];]
 $jsonRequest[https://api.affiliateplus.xyz/api/chatbot?message=$message&botname=Modbot&ownername=Darven;message]`
 });
 bot.command({
 name: "setchatbot",
 code: `$title[Successfully set chatbot channel!]$description[chabot is set to $mentionedChannels[1].]
 $setServerVar[chatbotchannel;$mentionedChannels[1]]
 $onlyPerms[admin;You need the admin permission to set the chat-bot channel.]`
 });
 
 //{{variables}}\\
 
 bot.variables({
 chatbotchannel: "Not Set",
 Money: "0", 
 Bank: "0", 
 banklimit: "500", 
 userav: "", 
 yes: ":white_check_mark:", 
 no: ":x:", 
 mute: "0", 
 warn: "0", 
 answer: "", 
 rest: ""
 });

//~~ test cmds ~~\\


bot.command({
 name: "help",
 code: `
 $if[$message[1]==information]
 $sendMessage[{color:GREEN}{author:Help}{title:Information}{description:Information Commands}{field:!command:Command info here:yes}{footer:🔄 - Return to Home Page};no]
 $elseIf[$message[1]==economy]
 $sendMessage[{color:GREEN}{author:Help}{title:Economy}{description:Economy Commands}{field:!command:Command info here:yes}{footer:🔄 - Return to Home Page};no]
 $endelseIf
 $elseIf[$message[1]==fun]
 $sendMessage[{color:GREEN}{author:Help}{title:Fun}{description:Fun Commands}{field:!command:Command info here:yes}{footer:🔄 - Return to Home Page};no]
 $endelseIf
 $else
 $reactionCollector[$splitText[1];$authorID;1m;🔄,❓,💵,😂;helpHome,helpInfo,helpEco,helpFun;yes]
 $textSplit[$sendMessage[{color:GREEN}{author:Help:$authorAvatar}{title:Home}{description:**Help Command Pages:**\n🔄 - Return to Home Page (You're here!)\n❓ - Information\n💵 - Economy\n😂 - Fun}{footer:Requested by $userTag[$authorID]:$authorAvatar}{timestamp:ms};yes]; ]
 $endif
 $cooldown[5s;You're on cooldown! Please wait %time%.]
 `
})

bot.command({
 type: 'awaited',
 name: "helpHome",
 code: `$editMessage[$message[1];{color:GREEN}{author:Help}{title:Home}{description:**Help Command Pages:**\n🔄 - Return to Home Page (You're here!)\n❓ - Information\n💵 - Economy\n😂 - Fun}{footer:Please wait for all reactions to show up before reacting!}{timestamp:ms}]`
})

bot.command({
 type: 'awaited',
 name: "helpInfo",
 code: `$editMessage[$message[1];{color:GREEN}{author:Help}{title:Information}{description:Information Commands}{field:!command:Command info here:yes}{footer:🔄 - Return to Home Page}{timestamp:ms}]`
})

bot.command({
 type: 'awaited',
 name: "helpEco",
 code: `$editMessage[$message[1];{color:GREEN}{author:Help}{title:Economy}{description:Economy Commands}{field:!command:Command info here:yes}{footer:🔄 - Return to Home Page}{timestamp:ms}]`
});

bot.command({
 type: 'awaited',
 name: "helpFun",
 code: `$editMessage[$message[1];{color:GREEN}{author:Help}{title:Fun}{description:Fun Commands}{field:!command:Command info here:yes}{footer:🔄 - Return to Home Page}{timestamp:ms}]`
});