

document.addEventListener("mousemove",(e)=>{
    updateTooltipPosition(e.clientX,e.clientY)
    if (e.target.classList.contains("item")) {
        setTooltipDisplay(true)
    } else {
        setTooltipDisplay(false)
    }
})

function setTooltipDisplay(state) {
    const tooltip = document.getElementById("ItemTooltip");
    if (state) {
        tooltip.classList.add("state-displayed")
        tooltip.classList.remove("state-hidden")
    } else {
        tooltip.classList.remove("state-displayed")
        tooltip.classList.add("state-hidden")
    }
}
function updateTooltipPosition(x,y) {
    const tooltip = document.getElementById("ItemTooltip");
    tooltip.style.setProperty("--x",`${x}px`);
    tooltip.style.setProperty("--y",`${y}px`);
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
    id;
    constructor(id) {
        this.id = id
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

    gameState.mainInventory.getSlot(1,1).addItem(new Item("rock"))
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
    let data = getDataOfInventorySlotElement(e.target);
    selectedSlot = gameState[data.inventory].getSlot(data.row,data.column);
}
function inventorySlotManageMouseUp(e) {
    let data = getDataOfInventorySlotElement(e.target);
    selectedSlot.transferItemTo(gameState[data.inventory].getSlot(data.row,data.column))
}
function getDataOfInventorySlotElement(elem) {
    // Return the inventory, row, and column of that slot.
    let raw = elem.id.split("-")
    return {
        inventory:raw[0],
        row:parseInt(raw[1]),
        column:parseInt(raw[2])
    }
}

const assert = function(condition, message = '') {
    if (!condition) console.warn(`Assertion failed: ${message}`);
};