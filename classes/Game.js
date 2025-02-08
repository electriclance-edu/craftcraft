class Game {
    static allObjects = {
        worldTiles: undefined,
        inventories: {},
    }

    static get worldRadius() {
        return 5
    }
    static initialize() {
        this.allObjects.worldTiles = [];

        for (var x = -Game.worldRadius; x <= Game.worldRadius; x++) {
            var worldTileRow = []
            
            for (var y = -Game.worldRadius; y <= Game.worldRadius; y++) {
                var tile = new ResourceWorldTile(randElemWeighted({
                    "plains":50,
                    "forest":10,
                    "rocks":1
                }));
                tile.setPosition(x,y);
                worldTileRow.push(tile)
            }

            this.allObjects.worldTiles.push(worldTileRow)
        }
    }
    static addItem(item) {
        for (var inventory of Object.values(Game.allObjects.inventories)) {
            if ((inventory.name == "Player" || inventory.name == "Small Chest") && inventory.addItem(item)) return;
        }
    }
    static placeBlock(x,y,item) {
        switch (item.id) {
            case "crafting_table":
                Game.setTile(x,y,new CraftingWorldTile(), true)
                break;
            case "small_chest":
                Game.setTile(x,y,new StorageWorldTile(), true)  
                break;
            default:
                console.warn(`Game.placeBlock(): Attempted to place block of type ${item.id} at (${x},${y}), however no such block exists.`);
                break;
        }
    }
    static getObjectById(id) {
        var data = id.split('~');
        var objectType = data[0];

        switch (objectType) {
            case "tile":
                return Game.getTile(parseInt(data[1]),parseInt(data[2]));
            default:
                console.warn(`Game.getObjectById(): Attempted to get object from id ${id}, however no such type ${objectType} exists.`);
        }
    }
    static setTile(x, y, newTile, updateView = false) {
        this.allObjects.worldTiles[x + Game.worldRadius][y + Game.worldRadius] = newTile;
        newTile.setPosition(x,y);

        if (updateView) {
            var newView = generateWorldTileElement(newTile);
            var elem = document.getElementById(newTile.id);
            elem.replaceWith(newView);
        }
    }
    static getTile(x, y) {
        return this.allObjects.worldTiles[x + Game.worldRadius][y + Game.worldRadius];
    }
    static getInventory(id) {
        if (this.allObjects.inventories.hasOwnProperty(id)) {
            return Game.allObjects.inventories[id]
        } else {
            console.error(`Game.getInventory(): Attempted to get inventory of id "${id}", however no such inventory exists.`);
        }
    }
}