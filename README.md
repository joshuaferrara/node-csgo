node-csgo
========

Need help? Don't open an issue - ask in the Gitter room.

[![Join the chat at https://gitter.im/joshuaferrara/node-csgo](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/joshuaferrara/node-csgo?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

[![Build Status](https://travis-ci.org/joshuaferrara/node-csgo.svg?branch=master)](https://travis-ci.org/joshuaferrara/node-csgo)
[![Code Climate](https://codeclimate.com/github/joshuaferrara/node-csgo/badges/gpa.svg)](https://codeclimate.com/github/joshuaferrara/node-csgo)

[![NPM](https://nodei.co/npm/csgo.png?downloads=true&stars=true)](https://nodei.co/npm/csgo/)

---

A node-steam plugin for Counter-Strike: Global Offensive.

Based on [node-dota2](https://github.com/RJacksonm1/node-dota2) by [RJacksonm1](https://github.com/RJacksonm1/)

# Used by
* [PopFlash](https://popflash.site/) - Alternative CS:GO matchmaking & PUG service.
* [steamgaug.es](https://steamgaug.es/) - Matchmaking status info for CS:GO, TF2 & Dota 2. Also includes general steam status.
* [CSGOSquad](http://csgosquad.com) - Live MM game search and statistics
* [CS:GO Stats](https://csgostats.gg/) - Detailed insights and statistics for competitive CS:GO
* [CSGO-Mates](http://www.csgo-mates.com/) - Live matchmaking search and player insights
* [CSGO-Stalker](https://csgo-stalker.com) - Track any Wingman or competitive game in real-time

> This list is getting too long. Wanna be on it? Message me on Gitter and we'll talk. - joshuaferrara

# Requirements
* node-steam
* CS:GO must be purchased on the account you sign in with.

# Initializing
Parameters:
* `steamUser` - Pass a SteamUser instance to change your current status(In-game/not).
* `steamGC` - Pass a SteamGameCoordinator instance to use to send & receive GC messages.
* `debug` - A boolean noting whether to print information about operations to console.

```js
var Steam = require('steam'),
    steamClient = new Steam.SteamClient(),
    steamUser = new Steam.SteamUser(steamClient),
    steamGC = new Steam.SteamGameCoordinator(steamClient, 730),
    csgo = require('csgo'),
    CSGO = new csgo.CSGOClient(steamUser, steamGC, false);
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

### `Rank.getString(int rank_id)`

Converts an integer rank_id to a string. Ex: `CSGO.Rank.getString(1) = "Silver I"`

### `Level.getString(int player_level)`

Converts an integer player_level to a string. Ex: `CSGO.Level.getString(1) = "Recruit"`

## Matches

### `matchmakingStatsRequest()`

Sends a message to the Game Coordinator requesting some matchmaking stats. Listen for the `matchmakingStatsData` event for the game coordinator's response. Requires the GC to be ready (listen for the `ready` event before calling).

### `requestRecentGames()`

Requests a list of recent games for the currently logged in account. Listen for the `matchList` event for the game coordinator's response.

### `requestLiveGameForUser(accountId)`

Requests current live game info for given user. Listen for the `matchList` event for the game coordinator's response.

### `requestGame(string matchid, string outcomeid, int token)`

Requests info about game given a matchId, outcomeId, and token for a game (Tip: These can be found with the Sharecode decoder). Listen for the `matchList` event for the game coordinator's response.

### `requestWatchInfoFriends(arguments)`

Requests watchable info for game.
Arguments:
```javascript
int request_id; //Not enough tests yet
account_ids[array_of_csgo_accounts];//Not enough tests yet
long serverid;//ServerID of match.
long matchid;//MatchID of match.
```
Example:
```javascript
CSGO.requestWatchInfoFriends({
  serverid: new Long(-569600767, -2130640678, true).toString(),
  matchid: new Long(39, 719230023, true).toString()
});
```
Requirements: game should be live.

Listen for the `watchList` event for the game coordinator's response.

### `requestCurrentLiveGames()`

Requests a list of current live games. Listen for the `matchList` event for the game coordinator's response.

## Player Info

### `playerProfileRequest(accountId)`

`accountId` is the player's account ID (A player's SteamID64 can be converted to an account ID with `CSGO.ToAccountID(steamid)`).

Requests a player's profile from the game coordinator. The player must be online and playing CS:GO. Listen for the `playerProfile` event for the game coordinator's response.

## Rich Presence

> Note: You cannot set your rich presence to arbitrary strings anymore. Rather, games now define a list of up to 20 rich presence values that can be displayed. See the `SetRichPresence` method in [this documentation](https://partner.steamgames.com/doc/api/ISteamFriends#SetRichPresence) for more info.

### `richPresenceUpload(richPresenceObject)`

Sets the rich presence object for the currently logged in user. Rich presence is Valve's solution to giving friends information on what you're doing in a game. For example, when you see information about another friends matchmaking game (as in, the map and score), this is set by using rich presence. An example of how to use this method can be found in [example.js](https://github.com/joshuaferrara/node-csgo/blob/master/example/example.js)

## Item Data

### `itemDataRequest(string s, string a, string d, string m)`

Requests item data for the specified CSGO item inspect link parameters. The parameter `s` has a value when the inspect link is from an inventory; likewise, the parameter `m` has a value when the inspect link is from the market. If there is no value for a given parameter from the inspect link, set it to `"0"`. 

Listen for the `itemData` event for the game coordinator's response.

Example for an inventory inspect link for a CSGO item
```javascript
// steam://rungame/730/76561202255233023/+csgo_econ_action_preview%20S76561198084749846A6768147729D12557175561287951743
CSGO.itemDataRequest("76561198084749846", "6768147729", "12557175561287951743", "0");
```

Example for a market inspect link for a CSGO item
```javascript
// steam://rungame/730/76561202255233023/+csgo_econ_action_preview%20M563330426657599553A6710760926D9406593057029549017
CSGO.itemDataRequest("0", "6710760926", "9406593057029549017", "563330426657599553");
```


## Sharecode Decoding/Encoding

### `new CSGO.SharecodeDecoder(string code);`

Instantiates a SharecodeDecoder class to decode sharecodes.

Calling the `decode()` method of the `SharecodeDecoder` will return an object with the decoded information.

```javascript
console.log(new CSGO.SharecodeDecoder("CSGO-U6MWi-hYFWJ-opPwD-JciHm-qOijD").decode())

{ matchId: '3106049990460440633',
  outcomeId: '3106056003414655216',
  tokenId: '11842' }
```

# Events
### `ready`
Emitted when the GC is ready to receive messages.  Be careful not to declare anonymous functions as event handlers here, as you'll need to be able to invalidate event handlers on an `unready` event.

### `unready`
Emitted when the connection status to the GC changes, and renders the library unavailable to interact.  You should clear any event handlers set in the `ready` event here, otherwise you'll have multiple handlers for each message every time a new `ready` event is sent.

### `exited`
Emitted when `.exit()` is called as a convenience for clearing handlers upon intentional exits.

### `itemData` (`itemDataResponse`)

```javascript
{ 
    "iteminfo":
   { 
        "accountid": null,
        "itemid": Long { "low": -1821786863, "high": 1, "unsigned": true },
        "defindex": 7,
        "paintindex": 474,
        "rarity": 6,
        "quality": 4,
        "paintwear": 1054492909,
        "paintseed": 183,
        "killeaterscoretype": null,
        "killeatervalue": null,
        "customname": null,
        "stickers": [],
        "inventory": 3221225475,
        "origin": 8,
        "questid": null,
        "dropreason": null,
        "floatvalue": 0.4263376295566559 
    }
}
```

Emitted when the game coordinator responds to the `itemDataRequest` method.

### `matchmakingStatsData` (`matchmakingStatsResponse`)
* `matchmakingStatsResponse` - Raw response object. Example response below.

```javascript
{
    "account_id": 137013074,
    "ongoingmatch": {                                       // Only populated when logged in user is in a match
        "serverid": 90112014586923017,
        "direct_udp_ip": 2734604850,
        "direct_udp_port": 27035,
        "reservationid": 18374688715512210549,
        "reservation": {
            "game_type": 520,
            "match_id": 3245263802660290728,
            "tournament_event": null,
            "pre_match_data": null
        },
        "map": "de_dust2",
        "server_address": "=[A:1:153428969:9318]:0"
    },
    "global_stats": {
        "players_online": 423480,
        "servers_online": 132472,
        "players_searching": 4212,
        "servers_available": 65497,
        "ongoing_matches": 17016,
        "search_time_avg": 46530,
        "search_statistics": [
            {
                "game_type": 264,
                "search_time_avg": 128555,
                "players_searching": 148
            },
            {
                "game_type": 520,
                "search_time_avg": 31962,
                "players_searching": 1768
            },
            {
                "game_type": 1032,
                "search_time_avg": 122353,
                "players_searching": 426
            },
            {
                "game_type": 2056,
                "search_time_avg": 136133,
                "players_searching": 160
            },
            {
                "game_type": 4104,
                "search_time_avg": 62643,
                "players_searching": 1069
            },
            {
                "game_type": 8200,
                "search_time_avg": 70380,
                "players_searching": 563
            },
            {
                "game_type": 16392,
                "search_time_avg": 115923,
                "players_searching": 132
            },
            {
                "game_type": 32776,
                "search_time_avg": 54906,
                "players_searching": 1248
            },
            {
                "game_type": 65544,
                "search_time_avg": 116871,
                "players_searching": 183
            },
            {
                "game_type": 131080,
                "search_time_avg": 82308,
                "players_searching": 145
            },
            {
                "game_type": 262152,
                "search_time_avg": 209331,
                "players_searching": 105
            },
            {
                "game_type": 524296,
                "search_time_avg": 270376,
                "players_searching": 110
            },
            {
                "game_type": 1048584,
                "search_time_avg": 64499,
                "players_searching": 1020
            },
            {
                "game_type": 268435464,
                "search_time_avg": 84615,
                "players_searching": 642
            },
            {
                "game_type": 536870920,
                "search_time_avg": 104965,
                "players_searching": 478
            },
            {
                "game_type": 2097160,
                "search_time_avg": 198734,
                "players_searching": 228
            },
            {
                "game_type": 134217736,
                "search_time_avg": 147703,
                "players_searching": 203
            },
            {
                "game_type": 8388616,
                "search_time_avg": 538828,
                "players_searching": 138
            },
            {
                "game_type": 16777224,
                "search_time_avg": 232350,
                "players_searching": 192
            },
            {
                "game_type": 4194312,
                "search_time_avg": 237269,
                "players_searching": 151
            },
            {
                "game_type": 33554440,
                "search_time_avg": 203183,
                "players_searching": 181
            }
        ],
        "main_post_url": "",
        "required_appid_version": 13494,
        "pricesheet_version": 1438240620,
        "twitch_streams_version": 2,
        "active_tournament_eventid": 6,
        "active_survey_id": 0
    },
    "penalty_seconds": null,                                // Contains amount of time logged in account has an MM cooldown
    "penalty_reason": null,                                 // Integer representing reason for MM cooldown
    "vac_banned": 0,
    "ranking": {
        "account_id": 137013074,
        "rank_id": 11,
        "wins": 192,
        "rank_change": null
    },
    "commendation": {
        "cmd_friendly": 3,
        "cmd_teaching": 3,
        "cmd_leader": 3
    },
    "medals": {
        "medal_team": 0,
        "medal_combat": 0,
        "medal_weapon": 0,
        "medal_global": 0,
        "medal_arms": 0,
        "display_items_defidx": [],
        "featured_display_item_defidx": null
    },
    "my_current_event": null,
    "my_current_event_teams": [],
    "my_current_team": null,
    "my_current_event_stages": [],
    "survey_vote": null,
    "activity": null,
    "player_level": 3,
    "player_cur_xp": 327684342,
    "player_xp_bonus_flags": null
}
```

Emitted when the game coordinator responds to the `matchmakingStatsRequest` method.

### `playerProfile` (Response to `playerProfileRequest`)


```json
{
  "request_id": null,
  "account_profiles": [
    {
      "account_id": 137013074,
      "ongoingmatch": null,
      "global_stats": null,
      "penalty_seconds": null,
      "penalty_reason": null,
      "vac_banned": null,
      "ranking": {
        "account_id": 137013074,
        "rank_id": 11,
        "wins": 192,
        "rank_change": null
      },
      "commendation": {
        "cmd_friendly": 3,
        "cmd_teaching": 3,
        "cmd_leader": 3
      },
      "medals": {
        "medal_team": 0,
        "medal_combat": 0,
        "medal_weapon": 0,
        "medal_global": 0,
        "medal_arms": 0,
        "display_items_defidx": [],
        "featured_display_item_defidx": null
      },
      "my_current_event": null,
      "my_current_event_teams": [],
      "my_current_team": null,
      "my_current_event_stages": [],
      "survey_vote": null,
      "activity": null,
      "player_level": 3,
      "player_cur_xp": 327684342,
      "player_xp_bonus_flags": null
    }
  ]
}
```

Emitted when the game coordinator responds to the `playerProfileRequest` method.

## `matchList` (Response to `requestRecentGames`)

The whole response ended up being too big for the readme and caused browsers to crash. Due to this, I've only included an excerpt as to what's returned.

```json
        {
          "reservationid": {
            "low": 65,
            "high": 715485165,
            "unsigned": true
          },
          "reservation": {
            "account_ids": [
              2879081,
              182261908,
              225695551,
              30039512,
              90132590,
              94815387,
              37671978,
              31906737,
              137013074,
              61347894
            ],
            "game_type": 1032,
            "match_id": null,
            "server_version": null,
            "rankings": [],
            "encryption_key": null,
            "encryption_key_pub": null,
            "party_ids": [],
            "whitelist": [],
            "tv_master_steamid": null,
            "tournament_event": null,
            "tournament_teams": [],
            "tournament_casters_account_ids": [],
            "tv_relay_steamid": null,
            "pre_match_data": null
          },
          "map": "http://replay124.valve.net/730/003072985384448163905_0699089210.dem.bz2",
          "round": null,
          "kills": [
            21,
            22,
            15,
            15,
            12,
            37,
            20,
            23,
            17,
            15
          ],
          "assists": [
            5,
            5,
            1,
            3,
            4,
            2,
            3,
            2,
            6,
            7
          ],
          "deaths": [
            22,
            22,
            24,
            23,
            21,
            13,
            13,
            19,
            20,
            20
          ],
          "scores": [
            55,
            54,
            40,
            39,
            37,
            79,
            65,
            59,
            41,
            37
          ],
          "pings": [],
          "round_result": null,
          "match_result": 2,
          "team_scores": [
            11,
            16
          ],
          "confirm": null,
          "reservation_stage": null,
          "match_duration": 2332,
          "enemy_kills": [
            21,
            22,
            15,
            15,
            12,
            37,
            20,
            23,
            17,
            15
          ],
          "enemy_headshots": [
            12,
            11,
            4,
            2,
            3,
            9,
            6,
            9,
            3,
            12
          ],
          "enemy_3ks": [],
          "enemy_4ks": [],
          "enemy_5ks": [],
          "mvps": [
            4,
            3,
            1,
            1,
            2,
            4,
            5,
            2,
            3,
            2
          ],
          "spectators_count": null,
          "spectators_count_tv": null,
          "spectators_count_lnk": null,
          "enemy_kills_agg": []
        }
```

Emitted when `requestRecentGames`, `requestGame`, `requestLiveGameForUser`, `requestCurrentLiveGames` is replied to.

## `watchList` (Response to `requestWatchInfoFriends`)
Example:
```json
{
  "request_id": 0,
  "account_ids": [],
  "watchable_match_infos": [
    {
      "server_ip": 2453839835,
      "tv_port": 28056,
      "tv_spectators": 1,
      "tv_time": 417,
      "tv_watch_password": {
        "buffer": {
          "type": "Buffer",
          "data": [ ]
        },
        "offset": 21,
        "markedOffset": -1,
        "limit": 53,
        "littleEndian": true,
        "noAssert": false
      },
      "cl_decryptdata_key": null,
      "cl_decryptdata_key_pub": {
        "low": -249571153,
        "high": 1941167002,
        "unsigned": true
      },
      "game_type": 32776,
      "game_mapgroup": "mg_de_mirage",
      "game_map": "de_mirage",
      "server_id": {
        "low": 2054631424,
        "high": 20977258,
        "unsigned": true
      },
      "match_id": {
        "low": 32,
        "high": 719254593,
        "unsigned": true
      },
      "reservation_id": null
    }
  ],
  "extended_timeout": null
}
```
