node-csgo
========

Build Status: [![Build Status](https://travis-ci.org/joshuaferrara/node-csgo.svg?branch=master)](https://travis-ci.org/joshuaferrara/node-csgo)

[![NPM](https://nodei.co/npm/csgo.png?downloads=true&stars=true)](https://nodei.co/npm/csgo/)

---

A node-steam plugin for Counter-Strike: Global Offensive.

Based on [node-dota2](https://github.com/RJacksonm1/node-dota2) by [RJacksonm1](https://github.com/RJacksonm1/)

# Used by
* [PopFlash](https://popflash.site/) - Alternative CS:GO matchmaking & PUG service.
* [steamgaug.es](https://steamgaug.es/) - Matchmaking status info for CS:GO, TF2 & Dota 2. Also includes general steam status.

# Requirements
* node-steam
* CS:GO must be purchased on the account you sign in with.

# Initializing
Parameters:
* `steamClient` - Pass a SteamClient instance to use to send & receive GC messages.
* `debug` - A boolean noting whether to print information about operations to console.

```js
var Steam = require('steam'),
    steamClient = new Steam.SteamClient(),
    csgo = require('csgo'),
    CSGO = new csgo.CSGOClient(steamClient, true);
```

# Methods
All methods require the SteamClient instance to be logged on.

## CSGO
### `launch()`

Reports to Steam that you're playing Counter-Strike: Global Offensive, and then initiates communication with the Game Coordinator.

### `exit()`

Tells Steam that you are not playing CS:GO.

### `ToAccountID(steamId)`

Converts a 64 bit steam ID to an account ID.

### `ToSteamID(accountId)`

Converts an account ID to a 64 bit steam ID.

## Matches

### `matchmakingStatsRequest()`

Sends a message to the Game Coordinator requesting some matchmaking stats. Listen for the `matchmakingStatsData` event for the game coordinator's response. Requires the GC to be ready (listen for the `ready` event before calling).

### `requestRecentGames(accountId)`

Requests a list of recent games for the given accountId. Listen for the `matchList` event for the game coordinator's response.

## Player Info

### `playerProfileRequest(accountId)`

`accountId` is the player's account ID (A player's SteamID64 can be converted to an account ID with `CSGO.ToAccountID(steamid)`).

Requests a player's profile from the game coordinator. The player must be online and playing CS:GO. Listen for the `playerProfile` event for the game coordinator's response.

# Events
### `ready`
Emitted when the GC is ready to receive messages.  Be careful not to declare anonymous functions as event handlers here, as you'll need to be able to invalidate event handlers on an `unready` event.

### `unready`
Emitted when the connection status to the GC changes, and renders the library unavailable to interact.  You should clear any event handlers set in the `ready` event here, otherwise you'll have multiple handlers for each message every time a new `ready` event is sent.

### `matchmakingStatsData` (`matchmakingStatsResponse`)
* `matchmakingStatsResponse` - Raw response object. Example response below.

```json
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

### `playerProfile` (Response to `playerProfileRequest`)


```json
{
  "accountProfiles": [
    {
      "accountId": 9716014,
      "ranking": {
        "accountId": 9716014,
        "rankId": 15,
        "wins": 51
      },
      "commendation": {
        "cmdFriendly": 22,
        "cmdTeaching": 18,
        "cmdLeader": 23
      },
      "medals": {
        "medalTeam": 2,
        "medalCombat": 3,
        "medalWeapon": 3,
        "medalGlobal": 3,
        "medalArms": 2,
        "displayItemsDefidx": [
          874,
          1316,
          1028,
          1024,
          1014
        ],
        "featuredDisplayItemDefidx": 874
      },
      "playerLevel": 1,
      "playerCurXp": 327681600
    }
  ]
}
```

Emitted when the game coordinator responds to the `playerProfileRequest` method.

## `matchList` (Response to `requestRecentGames`)


```json
{
  "msgrequestid": 9141,
  "accountid": 137013074,
  "servertime": 1421436395,
  "matches": [
    {
      "matchid": "3052384629647474702",
      "matchtime": 1421377356,
      "watchablematchinfo": {
        "serverIp": 123,
        "tvPort": 1163334677,
        "tvSpectators": 1,
        "clDecryptdataKeyPub": "9068150129701000225"
      },
      "roundstats": {
        "reservationid": "3052389598924636197",
        "reservation": {
          "accountIds": [
            76764980,
            40140216,
            18708851,
            9146358,
            84968273,
            106960435,
            37671978,
            61347894,
            137013074,
            66568413
          ],
          "gameType": 1048584
        },
        "map": "http://replay123.valve.net/730/003052389598924636197_1163334677.dem.bz2",
        "kills": [
          25,
          21,
          22,
          13,
          17,
          20,
          20,
          16,
          18,
          10
        ],
        "assists": [
          5,
          10,
          6,
          6,
          5,
          3,
          7,
          6,
          6,
          4
        ],
        "deaths": [
          16,
          18,
          16,
          16,
          19,
          19,
          20,
          18,
          22,
          20
        ],
        "scores": [
          61,
          60,
          54,
          45,
          43,
          58,
          53,
          48,
          44,
          34
        ],
        "matchResult": 1,
        "teamScores": [
          16,
          8
        ],
        "matchDuration": 2164,
        "mvps": [
          5,
          3,
          4,
          2,
          2,
          1,
          3,
          4,
          0,
          0
        ]
      }
    },
    [...]
  ]
}
```

Emitted when `requestRecentGames` is replied to.

## Testing
There is no automated test suite for node-csgo, however the `example` directory does contain a steam bot with an example method to grab the GC status; you can use this bot to test the library.
