'use strict';

const ranks = {
    0: "Unranked",
    1: "Silver I",
    2: "Silver II",
    3: "Silver III",
    4: "Silver IV",
    5: "Silver Elite",
    6: "Silver Elite Master",
    7: "Gold Nova I",
    8: "Gold Nova II",
    9: "Gold Nova III",
    10: "Gold Nova Master",
    11: "Master Guardian I",
    12: "Master Guardian II",
    13: "Master Guardian Elite",
    14: "Distinguished Master Guardian",
    15: "Legendary Eagle",
    16: "Legendary Eagle Master",
    17: "Supreme Master First Class",
    18: "The Global Elite"
}

class Rank {
    static getString(intRank) {
        return ranks[intRank];
    }
}

exports.Rank = Rank;

const levels =
{
    0: 'Not Recruited',
    1: 'Recruit',
    2: 'Private',
    3: 'Private',
    4: 'Private',
    5: 'Corporal',
    6: 'Corporal',
    7: 'Corporal',
    8: 'Corporal',
    9: 'Sergeant',
    10: 'Sergeant',
    11: 'Sergeant',
    12: 'Sergeant',
    13: 'Master Sergeant',
    14: 'Master Sergeant',
    15: 'Master Sergeant',
    16: 'Master Sergeant',
    17: 'Sergeant Major',
    18: 'Sergeant Major',
    19: 'Sergeant Major',
    20: 'Sergeant Major',
    21: 'Lieutenant',
    22: 'Lieutenant',
    23: 'Lieutenant',
    24: 'Lieutenant',
    25: 'Captain',
    26: 'Captain',
    27: 'Captain',
    28: 'Captain',
    29: 'Major',
    30: 'Major',
    31: 'Major',
    32: 'Major',
    33: 'Colonel',
    34: 'Colonel',
    35: 'Colonel',
    36: 'Brigadier General',
    37: 'Major General',
    38: 'Lieutenant General',
    39: 'General',
    40: 'Global General'
};

class Level {
    static getString(intLevel) {
        return levels[intLevel];
    }
}

exports.Level = Level;