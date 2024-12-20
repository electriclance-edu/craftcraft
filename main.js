

document.addEventListener("mousemove",(e)=>{
    const TOOLTIP_ELEM = document.getElementById("ItemTooltip");
    updateElementPosition(TOOLTIP_ELEM,e.clientX,e.clientY)
    const GHOST_ITEM_ELEM = document.getElementById("GhostItem");
        setElemDisplay(TOOLTIP_ELEM, false)
    updateElementPosition(GHOST_ITEM_ELEM,e.clientX,e.clientY)
    
    if (e.target.classList.contains("itemSlot")) {
        let slot = getSlotOfInventorySlotElement(e.target);
        if (slot.hasItem()) {
            setElemDisplay(TOOLTIP_ELEM, true)
            updateTooltip(slot.item)
        }
    } else {
        setElemDisplay(TOOLTIP_ELEM, false)
    }
})

function setElemDisplay(elem,state) {
    if (state) {
        elem.classList.add("state-displayed")
        elem.classList.remove("state-hidden")
    } else {
        elem.classList.remove("state-displayed")
        elem.classList.add("state-hidden")
    }
}
function updateElementPosition(elem,x,y) {
    elem.style.setProperty("--x",`${x}px`);
    elem.style.setProperty("--y",`${y}px`);
}

var gameState = {
    craftingInventory:undefined,
    mainInventory:undefined,
    minionInventory:undefined
}

class Inventory {
    slots;
    constructor(name,rows,columns) {
        this.name = name;
        this.dimensions = [rows,columns]
        this.slots = [];
        for (var r = 0; r < rows; r++) {
            let row = [];
            for (var c = 0; c < columns; c++) {
                row.push(new InventorySlot(name,r + 1,c + 1));
            } 
            this.slots.push(row);
        }
    }
    getSlot(r,c) {
        return this.slots[r - 1][c - 1]
    }
    addItem(item) {
        for (var r = 0; r < this.dimensions[0]; r++) {
            let row = this.slots[r];
            for (var c = 0; c < this.dimensions[1]; c++) {
                if (!row[c].hasItem()) {
                    row[c].addItem(item)
                    return;
                }
            } 
        }
    }
}
class InventorySlot {
    item;
    constructor(inv,r,c) {
        this.locationData = {
            inventory:inv,
            row:r,
            column:c
        }
        this.item = Item.empty
    }
    hasItem() {
        return !(this.item == Item.empty)
    }
    addItem(item) {
        this.item = item
        this.updateView()
    }
    removeItem() {
        let removedItem = this.item
        this.item = Item.empty

        this.updateView()

        return removedItem;
    }
    transferItemTo(slot) {
        if (this.hasItem() && !slot.hasItem()) {
            let item = this.removeItem()
            slot.addItem(item)
        }
    }
    updateView() {
        let elem = this.getElem();
        if (this.item == Item.empty) {
            elem.innerHTML = ""
        } else {
            elem.innerHTML = ""
            let item = document.createElement("div")
            item.classList.add("item")
            item.style.setProperty("--url",`url('resources/img/item/${this.item.id}.PNG')`)
            elem.appendChild(item)
        }
    }
    getElem() {
        return document.getElementById(this.getId());
    }
    getId() {
        return `${this.locationData.inventory}-${this.locationData.row}-${this.locationData.column}`
    }
}
class Item {
    static empty = 'Item.empty'

    static Names = {
        "flint_axe":"Flint Axe",
        "flint_hammer":"Flint Hammer",
        "flint_pickaxe":"Flint Pickaxe",
        "flint":"Flint",
        "large_stick":"Large Stick",
        "sand":"Sand",
        "glass":"Glass",
        "seeds":"Seeds",
        "leaf":"Leaf",
        "grass":"Grass",
        "grass_bread":"Grass Bread",
        "log":"Log",
        "plank":"Plank",
        "string":"String",
        "thread":"Thread",
        "flint_neko":"Flint Artifact",
    }
    static Lores = {
        "flint_axe":"Trees fear me.",
        "flint_hammer":"Gets the job done.",
        "flint_pickaxe":"A faster mode of erosion.",
        "flint":"Millions of years of geologic activity just to end up as a 50 durability tool.",
        "large_stick":"It's pretty big.",
        "glass":"A material that stores magic.",
        "seeds":"Plant children. Delicious.",
        "leaf":"It's so green!",
        "grass":"You'll need a lot for roofing.",
        "grass_bread":"A little tough, but edible.",
        "log":"A punch wouldn't break it.",
        "plank":"Stolen from some pirates?",
        "sand":"A pile of granular silica, unrefined.",
        "string":"There's magic in these strands.",
        "thread":"Can give life to a worthy container.",
        "flint_neko":"The visage it evokes is.. strange.",
    }

    id;
    constructor(id) {
        this.id = id
    }
    static getName(item) {
        if (Item.Names.hasOwnProperty(item.id)) return Item.Names[item.id]
        else return "An Item..."
    }
    static getLore(item) {
        if (Item.Lores.hasOwnProperty(item.id)) return Item.Lores[item.id]
        else return "It's an item, you think?"
    }
}
class CraftingRecipe {
    isShaped;
    key;
    constructor(key,isShaped) {
        // If shaped, the key should be a 3x3 array of item ids.
        // For this implementation, we assume all crafting recipes are 3x3 and shaped. Sorry
    }
}

function onload() {
    initializeInventoryData()
    initializeInventoryElements()
    console.log(gameState)

    const GHOST_ITEM_ELEM = document.getElementById("GhostItem");
    setElemDisplay(GHOST_ITEM_ELEM, false)

    for (const id in Item.Names) {
        gameState.mainInventory.addItem(new Item(id))
    }

    initializeBackgroundObjects(10)
}
function initializeBackgroundObjects(amount) {
    for (var i = 0; i < amount; i++) {
        let elem = document.createElement("div");
        let randomStructure = randElem(["tree1","tree2","tree1","tree2","bush"]);
        elem.classList.add("backgroundObject");
        elem.style = `
            --x:${randInt(window.innerWidth - 100) + 50}px;
            --y:${randInt(window.innerHeight - 100) + 50}px;
            --url:url('resources/img/structure/${randomStructure}.PNG');
        `;
        document.getElementById("Background").appendChild(elem);
    }
}
function initializeInventoryData() {
    gameState.craftingInventory = new Inventory("craftingInventory",3,3);
    gameState.mainInventory = new Inventory("mainInventory",3,9);
    gameState.minionInventory = new Inventory("minionInventory",1,9);
}
function initializeInventoryElements() {
    let slots = document.getElementsByClassName("itemSlot")
    for (slot of Array.from(slots)) {
        slot.addEventListener('mousedown', inventorySlotManageMouseDown);
        slot.addEventListener('mouseup', inventorySlotManageMouseUp);
    }
}

var selectedSlot = null;
function inventorySlotManageMouseDown(e) {
    let slot = getSlotOfInventorySlotElement(e.target);
    if (slot.hasItem()) {
        selectedSlot = slot;
        displayGhostOf(slot.item)
    }
}
function updateTooltip(item) {
    const TT_NAME_ELEM = document.getElementById("ItemTooltipName");
    TT_NAME_ELEM.innerHTML = Item.getName(item)
    const TT_LORE_ELEM = document.getElementById("ItemTooltipLore");
    TT_LORE_ELEM.innerHTML = Item.getLore(item)
}
function displayGhostOf(item) {
    const GHOST_ITEM_ELEM = document.getElementById("GhostItem");
    GHOST_ITEM_ELEM.style.setProperty("--url",`url('resources/img/item/${item.id}.PNG')`)
    setElemDisplay(GHOST_ITEM_ELEM, true)
}
function inventorySlotManageMouseUp(e) {
    let slot = getSlotOfInventorySlotElement(e.target);
    selectedSlot.transferItemTo(slot)
    const GHOST_ITEM_ELEM = document.getElementById("GhostItem");
    setElemDisplay(GHOST_ITEM_ELEM, false)
}
function getSlotOfInventorySlotElement(elem) {
    let raw = elem.id.split("-")
    let data = {
        inventory:raw[0],
        row:parseInt(raw[1]),
        column:parseInt(raw[2])
    }
    return gameState[data.inventory].getSlot(data.row,data.column);
}



const assert = function(condition, message = '') {
    if (!condition) console.warn(`Assertion failed: ${message}`);
};
// Returns a random integer from 0 to max.
function randInt(max) {
    return Math.floor(Math.random() * (max + 1));
}
// Returns a random elem from a given arr.
function randElem(arr) {
    return arr[randInt(arr.length - 1)];
}