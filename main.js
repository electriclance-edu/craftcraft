

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
    constructor(rows,columns) {
        this.slots = Array(rows).fill().map(()=>{
            return Array(columns).fill().map(()=>{
                return new InventorySlot()
            })
        })
    }
    getSlot(r,c) {
        return this.slots[r - 1][c - 1]
    }
}
class InventorySlot {
    item;
    constructor() {
        this.item = Item.empty
    }
    hasItem() {
        return !(this.item == Item.empty)
    }
    addItem(item) {
        this.item = item
    }
    removeItem() {
        let removedItem = this.item
        this.item = Item.empty
        return this.item;
    }
    transferItemTo(slot) {
        if (this.hasItem() && !slot.hasItem()) {
            let item = this.removeItem()
            slot.addItem(item)
        }
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
}

function initializeInventoryData() {
    gameState.craftingInventory = new Inventory(3,3)
    gameState.mainInventory = new Inventory(3,9)
    gameState.minionInventory = new Inventory(1,9)
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
    console.log(data)
}
function getDataOfInventorySlotElement(elem) {
    // Return the inventory, row, and column of that slot.
    let raw = elem.getAttribute('data-slot').split("-")
    return {
        inventory:raw[0],
        row:parseInt(raw[1]),
        column:parseInt(raw[2])
    }
}
function addItem(inventory,r,c) {
    assert(["mainInventory","minionInventory","craftingInventory"].includes(inventory),`Invalid inventory ${inventory} passed into addItem().`)
}

const assert = function(condition, message = '') {
    if (!condition) console.warn(`Assertion failed: ${message}`);
};