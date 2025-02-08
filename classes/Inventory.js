// An inventory must always be a part of a WorldTile. It cannot exist outside of one.
class Inventory {
    slots;
    constructor(name,rows,columns) {
        this.id = `${Object.values(Game.allObjects.inventories).length}`;
        this.name = name;
        this.dimensions = [rows,columns]
        this.slots = [];
        for (var r = 0; r < rows; r++) {
            let row = [];
            for (var c = 0; c < columns; c++) {
                row.push(new InventorySlot(this.id,r,c));
            } 
            this.slots.push(row);
        }

        this.listeningForCrafts = false;
        Game.allObjects.inventories[this.id] = this;
    }
    static getInventoryById(id) {
        return Game.allObjects.inventories[id];
    }
    getSlot(r,c) {
        return this.slots[r][c]
    }
    setListeningForCrafts(state) {
        this.listeningForCrafts = true;
        return this
    } 
    addItems(arr) {
        for (const i in arr) {
            this.addItem(arr[i])
        }
    }
    addItem(item) {
        for (var r = 0; r < this.dimensions[0]; r++) {
            let row = this.slots[r];
            for (var c = 0; c < this.dimensions[1]; c++) {
                if (!row[c].hasItem() || row[c].item.doesStackWith(item)) {
                    row[c].addItem(item);
                    InventorySlot.updateView(row[c]);
                    if (this.listeningForCrafts) craftEvent_startAttempt(this)
                    return true;
                }
            } 
        }
        return false
    }
    satisfiesCraft() {
        // Returns the first crafting recipe the inventory's current state satisfies.
        for (const i in recipes) {
            let recipe = recipes[i];
            if (recipe instanceof ShapelessRecipe) {
                if (this.satisfiesShapelessCraft(recipe)) return recipe
                continue;
            }
            else {
                assert(recipe instanceof ShapedRecipe,"satisfiesCraft(): Received the ff. recipe which is not a ShapelessRecipe, but is also not a ShapedRecipe.",recipe);
                if (this.satisfiesShapedCraft(recipe)) return recipe
                continue;
            }
        }

        return false
    }
    satisfiesShapedCraft(recipe) {
        var contents_ids = []
        for (let row of this.slots) {
            var contentRow = []
            for (let slot of row) {
                contentRow.push(slot.item.id == "empty" ? "" : slot.item.id);
            }
            contents_ids.push(contentRow)
        }

        var top_left_corner = [
            contents_ids.length - 1,
            contents_ids[contents_ids.length - 1].length - 1
        ];
        var bottom_r_corner = [0,0];
        for (var r in contents_ids) {
            for (var c in contents_ids[r]) {
                if (contents_ids[r][c] != "") {
                    if (parseInt(r) < top_left_corner[0]) top_left_corner[0] = parseInt(r)
                    if (parseInt(c) < top_left_corner[1]) top_left_corner[1] = parseInt(c)
                    if (parseInt(r) > bottom_r_corner[0]) bottom_r_corner[0] = parseInt(r)
                    if (parseInt(c) > bottom_r_corner[1]) bottom_r_corner[1] = parseInt(c)
                }
            }
        }
        
        contents_ids = contents_ids.splice(top_left_corner[0],bottom_r_corner[0] - top_left_corner[0] + 1);
        for (r in contents_ids) {
            row = contents_ids[r]
            contents_ids[r] = row.splice(top_left_corner[1], bottom_r_corner[1] - top_left_corner[1] + 1);
        }
        // Compare with recipe
        return JSON.stringify(contents_ids) == JSON.stringify(recipe.key);
    }
    satisfiesShapelessCraft(recipe) {
        var items = [];
        for (const i in this.slots) {
            for (const j in this.slots[i]) {
                var slotItem = this.slots[i][j].item;
                if (!Item.isEmpty(slotItem)) items.push(slotItem.id);
            }
        }
        items.sort();
        recipe.ingredients.sort(); // Mutates the original recipe, but this should be ok.
        
        // This code will fail if crafts get more complicated than simple arrays of strings
        return items.toString() == recipe.ingredients.toString()
    }
}