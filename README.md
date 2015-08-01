node-csgo
========

[![Join the chat at https://gitter.im/joshuaferrara/node-csgo](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/joshuaferrara/node-csgo?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

[![Build Status](https://travis-ci.org/joshuaferrara/node-csgo.svg?branch=master)](https://travis-ci.org/joshuaferrara/node-csgo)
[![Code Climate](https://codeclimate.com/github/joshuaferrara/node-csgo/badges/gpa.svg)](https://codeclimate.com/github/joshuaferrara/node-csgo)
[![Gratipay donate button](https://img.shields.io/gratipay/joshuaferrara.svg)](https://www.gratipay.com/joshuaferrara/ "Donate weekly to this project using Gratipay")

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
    "account_id": 137013074,
    "ongoingmatch": null,
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
    "penalty_seconds": null,
    "penalty_reason": null,
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

Emitted when `requestRecentGames` is replied to.
