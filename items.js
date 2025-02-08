const ItemTypes = {
    "empty": {
        name:"Nothing",
        lore:"You probably shouldn't be seeing this.",
        type:"resource"
    },
    "debug_paper": {
        name:"A strangely colored letter.",
        lore:`It reads:\n'Thanks for trying out my demo!\nStart out by clicking tiles to get resources.\nThen make a <b>crafting table</b> and place it.\nYou can also craft a chest to sort out the inventory issues.\nCraft a <b>flint pickaxe</b> and hold it while clicking on the Monoliths to get obsidian.\nThere are some other recipes, but not that many.\nThrow me away with Q. Ok bye'\nA strange letter indeed.`,
        type:"minion"
    },
    // "debug_paper": {
    //     name:"A strangely colored letter.",
    //     lore:`It reads:\n'Thanks for trying out my demo!\nI wasn't able to implement an actual gameplay loop in time, so there isn't much to do.\nClick tiles to gather resources.\nCraft a <b>flint pickaxe</b> and hold it while clicking on the Monoliths to get stone.\nThere are some other recipes, but not that many.\nCool bye'\nA strange letter indeed.`,
    //     type:"minion"
    // },
    "flint_axe":{
        name:"Flint Axe",
        lore:"Trees fear me.",
        type:"resource",
    },
    "flint_hammer":{
        name:"Flint Hammer",
        lore:"Gets the job done.",
        type:"resource",
    },
    "flint_pickaxe":{
        name:"Flint Pickaxe",
        lore:"A faster mode of erosion.",
        type:"resource",
    },
    "flint":{
        name:"Flint",
        lore:"Millions of years of geologic activity just to end up as a 50 durability tool.",
        type:"resource",
    },
    "stick":{
        name:"Stick",
        lore:"An absolute beauty of a stick.",
        type:"resource",
    },
    "sand":{
        name:"Sand",
        lore:"You reckon this is a pile of unrefined silicate minerals in a fine granular form.",
        type:"resource",
    },
    "glass":{
        name:"Glass",
        lore:"A planar piece of glass, produced by the Pilkington float process. You think.",
        type:"resource",
    },
    "seeds":{
        name:"Seeds",
        lore:"Plant children. Delicious.",
        type:"resource",
        properties:{
            saturation:0.5
        }
    },
    "leaf":{
        name:"Leaf",
        lore:"It's so green!",
        type:"resource",
    },
    "grass":{
        name:"Grass",
        lore:"You'll need a lot for anything.",
        type:"resource",
    },
    "grass_bread":{
        name:"Grass Bread",
        lore:"A little tough, but edible.",
        type:"resource",
        properties:{
            saturation:1.5
        }
    },
    "log":{
        name:"Log",
        lore:"So sturdy, a punch wouldn't do anything to it.",
        type:"resource",
    },
    "plank":{
        name:"Plank",
        lore:"Stolen from some pirates?",
        type:"resource",
    },
    "string":{
        name:"String",
        lore:"There's magic in these strands.",
        type:"resource",
    },
    "thread":{
        name:"Thread",
        lore:"Can give life to a worthy container.",
        type:"resource",
    },
    "flint_neko":{
        name:"Flint Artifact",
        lore:"You're not sure what this is.",
        type:"resource",
    },
    "minion_mel":{
        name:"Mel",
        lore:"She's happy to help.",
        type:"minion",
    },
    "small_chest":{
        name:"Small Chest",
        lore:"Place me on an empty tile!",
        type:"block",
        properties:{
            worldTile:"small_chest"
        }
    },
    "crafting_table":{
        name:"Crafting Table",
        lore:"Place me on an empty tile!",
        type:"block",
        properties:{
            worldTile:"crafting_table"
        }
    },
    "obsidian_pecko":{
        name:"Obsidian Artifact",
        lore:"The pointy bit is sharp.",
        type:"resource",
    },
    "obsidian_shard":{
        name:"Obsidian Shard",
        lore:"Impossibly sharp, but brittle. Would make for good knives.",
        type:"resource",
    },
    "large_obsidian":{
        name:"Obsidian Chunk",
        lore:"Ten might open up a portal?",
        type:"resource",
    },
}