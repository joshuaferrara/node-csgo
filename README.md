node-csgo
========

Main Build Server: [![Build Status](http://jenkins.joshua-ferrara.com/job/node-csgo/badge/icon)](http://jenkins.joshua-ferrara.com/job/node-csgo/)

Backup Build Server: [![Build Status](https://travis-ci.org/joshuaferrara/node-csgo.svg?branch=master)](https://travis-ci.org/joshuaferrara/node-csgo)

[![NPM](https://nodei.co/npm/csgo.png?downloads=true&stars=true)](https://nodei.co/npm/csgo/)

Some information below is related to [node-dota2](https://github.com/RJacksonm1/node-dota2). I will update this file as I make changes.
---

A node-steam plugin for Counter-Strike: Global Offensive.

Based on [node-dota2](https://github.com/RJacksonm1/node-dota2) by [RJacksonm1](https://github.com/RJacksonm1/)

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

Reports to Steam that you're playing Counter-Strike: Global Offensive, and then initiates communication with the Game Coordinator.

#### exit()

Tells Steam that you are not playing CS:GO.

### Matches

#### matchmakingStatsRequest()

Sends a message to the Game Coordinator requesting some matchmaking stats. Listen for the `matchmakingStatsData` event for the game coordinator's response. Requires the GC to be ready (listen for the `ready` event before calling).

## Events
### `ready`
Emitted when the GC is ready to receive messages.  Be careful not to declare anonymous functions as event handlers here, as you'll need to be able to invalidate event handlers on an `unready` event.

### `unready`
Emitted when the connection status to the GC changes, and renders the library unavailable to interact.  You should clear any event handlers set in the `ready` event here, otherwise you'll have multiple handlers for each message every time a new `ready` event is sent.

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

Emitted when the game coordinator responds to the `matchmakingStatsRequest` method.

## Testing
There is no automated test suite for node-csgo, however the `example` directory does contain a steam bot with an example method to grab the GC status; you can use this bot to test the library.
