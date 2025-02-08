const WorldTileType = {
    RESOURCE: "WorldTileType.RESOURCE",
    STORAGE: "WorldTileType.STORAGE",
    CRAFTING_INVENTORY: "WorldTileType.CRAFTING_INVENTORY",
    PLAYER: "WorldTileType.PLAYER",
    EMPTY: "WorldTileType.EMPTY",
}



// A WorldTile must always be positioned on the WorldTiles grid. 
// It cannot exist outside of the grid.
class WorldTile {
    type; // WorldTileType
    name;
    desc;
    lore;
    x;
    y;

    constructor(type = WorldTileType.EMPTY, name, desc, lore) {
        this.type = type;
        this.name = name;
        this.desc = desc;
        this.lore = lore;
        this.x = null;
        this.y = null;
    }
    get id() {
        return `tile~${this.x}~${this.y}`;
    }
    setPosition(x,y) {
        this.x = x;
        this.y = y;
    }
}



class ResourceWorldTile extends WorldTile {
    static biomeData = {
        "forest":{
            name:"Forest",
            desc:"Click to scavenge in the undergrowth.",
            lore:"Leaves rustle, and you know you are alone."
        },
        "rocks":{
            name:"Monoliths",
            desc:"Click to try hitting a monolith.",
            lore:"The monoliths stand tall: the last testament to the ancients' domination of the natural world."
        },
        "plains":{
            name:"Plains",
            desc:"Click to forage amongst the grass.",
            lore:"Grass and sometimes the rare bush, as far as the eye can see."
        },
    }
    static harvestTables = {
        "plains":{
            "default":{
                "grass": 50,
                "seeds": 10,
                "empty": 50,
            }
        },
        "rocks":{
            "default":{
                "sand":6,
                "flint":5,
                "flint_neko":1,
                "empty":10,
            },
            "flint_pickaxe":{
                "obsidian_pecko":1,
                "obsidian_shard":10,
                "large_obsidian":3,
            }
        },
        "forest":{
            "default":{
                "log":1,
                "stick":1,
                "leaf":2,
            }
        },
    }; // Contains loot tables of form dict[int, item]. int denotes the chance of getting the item, from 0-100.

    constructor(biome = "plains") {
        super(
            WorldTileType.RESOURCE,
            ResourceWorldTile.biomeData[biome].name,
            ResourceWorldTile.biomeData[biome].desc,
            ResourceWorldTile.biomeData[biome].lore
        )
        this.biome = biome;
        this.harvestTable = ResourceWorldTile.harvestTables[biome];
    }
}



class StorageWorldTile extends WorldTile {
    inventory;
    
    constructor(inventory = new Inventory("Small Chest",3,4)) {
        super(
            WorldTileType.STORAGE,
            "Small Chest", 
            "Stores 12 items.", 
            "Just a lil guy."
        );
        this.inventory = inventory;
    }
}

class CraftingWorldTile extends WorldTile {
    craftingInventory; // Inventory with flag listeningForCrafts enabled.

    constructor() {
        super(
            WorldTileType.CRAFTING_INVENTORY,
            "Crafting Table", 
            "Input items matching a recipe to get an output item.", 
            "For all your crafting needs."
        );
        var inventory = new Inventory("Crafting Table", 3, 3);
        inventory.setListeningForCrafts(true);
        this.craftingInventory = inventory;
    }
}

class PlayerWorldTile extends WorldTile {
    inventory;
    craftingInventory;

    constructor() {
        super(
            WorldTileType.PLAYER,
            "",
            "",
            ""
        );
        this.inventory = new Inventory("Player",1,4);
        this.craftingInventory = new Inventory("Crafting", 2, 2).setListeningForCrafts(true);
    }
}