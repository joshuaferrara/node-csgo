node-csgo
========

Some information below is related to [node-dota2](https://github.com/RJacksonm1/node-dota2). I will update this file as I make changes.
---

A node-steam plugin for Counter-Strike: Global Offensive.

Based on [node-dota2](https://github.com/RJacksonm1/node-dota2)

## Initializing
Parameters:
* `steamClient` - Pass a SteamClient instance to use to send & receive GC messages.
* `debug` - A boolean noting whether to print information about operations to console.

```js
var Steam = require('steam'),
    steamClient = new Steam.SteamClient(),
    csgo = require('csgo'),
    CSGO = new csgo.CSGOClient(steamClient, true);
```

## Methods
All methods require the SteamClient instance to be logged on.

### Steam
#### launch()

Reports to Steam that you're playing Dota 2, and then initiates communication with the Game Coordinator.

#### exit()

Tells Steam you were feeding.


### Inventory
#### setItemPositions(itemPositions)
* `itemPositions` - An array of tuples (itemid, position).

Attempts to move items within your inventory to the positions you set. Requires the GC to be ready (listen for the `ready` event before calling).

#### deleteItem(itemid)

Attempts to delete an item. Requires the GC to be ready (listen for the `ready` event before calling).


### Chat
#### joinChat(channel, [type])
* `channel` - A string for the channel name.
* `[type]` - The type of the channel being joined.  Defaults to `dota2.DOTAChatChannelType_t.DOTAChannelType_Custom`.

Joins a chat channel.  Listen for the `chatMessage` event for other people's chat messages.

#### leaveChat(channel)
* `channel` - A string for the channel name.

Leaves a chat channel.

#### sendMessage(channel, message)
* `channel` - A string for the channel name.
* `message` - The message you want to send.

Sends a message to the specified chat channel, won't send if you're not in the channel you try to send to.

### Community
#### profileRequest(accountId, requestName, [callback])
* `accountId` - Account ID (lower 32-bits of a 64-bit Steam ID) of the user whose passport data you wish to view.
* `requestName` - Boolean, whether you want the GC to return the accounts current display name.
* `[callback]` - optional callback, returns args: `err, response`.

Sends a message to the Game Coordinator requesting `accountId`'s profile data. Provide a callback or listen for `profileData` event for Game Coordinator's response. Requires the GC to be ready (listen for the `ready` event before calling).

#### passportDataRequest(accountId, [callback])
* `accountId` - Account ID (lower 32-bits of a 64-bit Steam ID) of the user whose passport data you wish to view.
* `[callback]` - optional callback, returns args: `err, response`.

Sends a message to the Game Coordinator requesting `accountId`'s passport data. Provide a callback or listen for `passportData` event for Game Coordinator's response. Requires the GC to be ready (listen for the `ready` event before calling).

#### hallOfFameRequest([week], [callback])
* `[week]` - The week of which you wish to know the Hall of Fame members; will return latest week if omitted.  Weeks also randomly start at 2233 for some reason, valf please.
* `[callback]` - optional callback, returns args: `err, response`.

Sends a message to the Game Coordinator requesting the Hall of Fame data for `week`. Provide a callback or listen for the `hallOfFameData` event for the Game Coordinator's response. Requires the GC to be ready (listen for the `ready` event before calling).


### Matches
#### matchDetailsRequest(matchId, [callback])
* `matchId` - The matches ID
* `[callback]` - optional callback, returns args: `err, response`.

Sends a message to the Game Coordinator requesting `matchId`'s match details. Provide a callback or listen for `matchData` event for Game Coordinator's response. Requires the GC to be ready (listen for the `ready` event before calling).

Note:  There is a server-side rate-limit of 100 requests per 24 hours on this method.

#### matchmakingStatsRequest()

Sends a message to the Game Coordinator requesting some matchmaking stats. Listen for the `matchmakingStatsData` event for the Game Coordinator's response (cannot take a callback because of Steam's backend, or RJackson's incompetence; not sure which). Rqeuired the GC to be ready (listen for the `ready` event before calling).

## Events
### `ready`
Emitted when the GC is ready to receive messages.  Be careful not to declare anonymous functions as event handlers here, as you'll need to be able to invalidate event handlers on an `unready` event.

### `unready`
Emitted when the connection status to the GC changes, and renders the library unavailable to interact.  You should clear any event handlers set in the `ready` event here, otherwise you'll have multiple handlers for each message every time a new `ready` event is sent.


### `chatMessage` (`channel`, `senderName`, `message`, `chatObject`)
* `channel` - Channel name.
* `senderName` - Persona name of user who sent message.
* `message` - Wot u think?
* `chatObject` - The raw chat object to do with as you wish.

Emitted for chat messages received from Dota 2 chat channels

### `guildOpenPartyData` (`guildId`, `openParties`)
* `guildId` - ID of the guild.
* `openParties` - Array containing information about open guild parties.  Each object has the following properties:
* * `partyId` - Unique ID of the party.
* * `member_account_ids` - Array of account ids.
* * `time_created` - Something about Back to the Future.
* * `description` - A user-inputted string.  Do not trust.

Emitted for each guild the bot's account is a member of, containing information on open parties for each guild.  Also exposes guildId's, which is handy.

### `guildInvite` (`guildId`, `guildName`, `inviter`, `guildInviteDataObject`)
* `guildId` - ID of the guild.
* `guildName` - Name of the guild.
* `inviter` - Account ID of user whom invited you.
* `guildInviteDataObject` - The raw guildInviteData object to do with as you wish.

You can respond with `cancelInviteToGuild` or `setGuildAccountRole`.

### `profileData` (`accountId`, `profileData`)
* `accountId` - Account ID whom the data is associated with.
* `profileData` - The raw profile data object.

Emitted when GC responds to the `profileRequest` method.

See the [protobuf schema](https://github.com/SteamRE/SteamKit/blob/master/Resources/Protobufs/dota/dota_gcmessages.proto#2261) for `profileData`'s object structure.

### `passportData` (`accountId`, `passportData`)
* `accountId` - Account ID whom the passport belongs to.
* `passportData` - The raw passport data object.

Emitted when GC responds to the `passportDataRequest` method.

See the [protobuf schema](https://github.com/SteamRE/SteamKit/blob/master/Resources/Protobufs/dota/dota_gcmessages.proto#L2993) for `passportData`'s object structure.

### `matchData` (`matchId`, `matchData`)
* `matchId` - Match ID whom the data is associatd with.
* `matchData` - The raw match details data object.

Emitted when GC responds to the `matchDetailsRequest` method.

See the [protobuf schema](https://github.com/SteamRE/SteamKit/blob/master/Resources/Protobufs/dota/dota_gcmessages.proto#L2250) for `matchData`'s object structure.

Emitted when the GC responds to the `hallOfFameRequest` method.

### `matchmakingStatsData` (`matchmakingStatsResponse`)
* `matchmakingStatsResponse` - Raw response object. Example response below.

```
{
  "accountId": 137013074,
  "globalStats": {
    "playersOnline": 68971,
    "serversOnline": 43433,
    "playersSearching": 1179,
    "serversAvailable": 24609,
    "ongoingMatches": 3163,
    "searchTimeAvg": 76109,
    "searchStatistics": [
      {
        "gameType": 1032,
        "searchTimeAvg": 181954,
        "playersSearching": 304
      },
      {
        "gameType": 264,
        "searchTimeAvg": 250253,
        "playersSearching": 137
      },
      {
        "gameType": 520,
        "searchTimeAvg": 71081,
        "playersSearching": 678
      },
      {
        "gameType": 2056,
        "searchTimeAvg": 265412,
        "playersSearching": 139
      },
      {
        "gameType": 4104,
        "searchTimeAvg": 104999,
        "playersSearching": 444
      },
      {
        "gameType": 8200,
        "searchTimeAvg": 114322,
        "playersSearching": 471
      },
      {
        "gameType": 16392,
        "searchTimeAvg": 247397,
        "playersSearching": 137
      },
      {
        "gameType": 131080,
        "searchTimeAvg": 266804,
        "playersSearching": 121
      },
      {
        "gameType": 65544,
        "searchTimeAvg": 192607,
        "playersSearching": 141
      },
      {
        "gameType": 262152,
        "searchTimeAvg": 320319,
        "playersSearching": 86
      },
      {
        "gameType": 524296,
        "searchTimeAvg": 370119,
        "playersSearching": 94
      },
      {
        "gameType": 32776,
        "searchTimeAvg": 116619,
        "playersSearching": 404
      },
      {
        "gameType": 1048584,
        "searchTimeAvg": 152285,
        "playersSearching": 220
      },
      {
        "gameType": 4194312,
        "searchTimeAvg": 364245,
        "playersSearching": 114
      },
      {
        "gameType": 33554440,
        "searchTimeAvg": 238510,
        "playersSearching": 120
      },
      {
        "gameType": 134217736,
        "searchTimeAvg": 254603,
        "playersSearching": 101
      },
      {
        "gameType": 268435464,
        "searchTimeAvg": 287695,
        "playersSearching": 129
      },
      {
        "gameType": 536870920,
        "searchTimeAvg": 321225,
        "playersSearching": 140
      },
      {
        "gameType": 2097160,
        "searchTimeAvg": 333849,
        "playersSearching": 89
      },
      {
        "gameType": 67108872,
        "searchTimeAvg": 347291,
        "playersSearching": 81
      },
      {
        "gameType": 8388616,
        "searchTimeAvg": 428836,
        "playersSearching": 54
      },
      {
        "gameType": 16777224,
        "searchTimeAvg": 339377,
        "playersSearching": 77
      }
    ],
    "mainPostUrl": "http://media.steampowered.com/apps/csgo/blog/mainmenu/20130630115312u24715681.sha-f048e4d341e7c8a823c28d612312eccd644c2a2b",
    "requiredAppidVersion": 13260,
    "pricesheetVersion": 1397848880,
    "twitchStreamsVersion": 2,
    "activeTournamentEventid": 3,
    "activeSurveyId": 0
  },
  "vacBanned": 0,
  "ranking": {
    "accountId": 137013074,
    "rankId": 0,
    "wins": 0
  },
  "commendation": {
    "cmdFriendly": 0,
    "cmdTeaching": 0,
    "cmdLeader": 0
  },
  "medals": {
    "medalTeam": 0,
    "medalCombat": 0,
    "medalWeapon": 0,
    "medalGlobal": 0,
    "medalArms": 0
  }
}
```

Emitted when te GC response to the `matchmakingStatsRequest` method.

## Testing
There is no automated test suite for node-dota2 (I've no idea how I'd make one for the stuff this does :o), however there the `test` directory does contain a Steam bot with commented-out dota2 methods; you can use this bot to test the library.

### Setting up
* `npm install` in the repository root.
* `npm install` in the `test` directory.
* Copy `config_SAMPLE.js` to `config.js` and edit appropriately.
* Create a blank file named 'sentry' in the tests directory.
* Attempt to log-in, you'll receive Error 63 - which means you need to provide a Steam Guard code.
* Set the Steam Guard code in `config.js` and launch again.
