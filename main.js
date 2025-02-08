// This game disables the right click context menu.
document.addEventListener('contextmenu', event => event.preventDefault());


///////////////////////////////////////////////////////////////
// INITIALIZATION MANAGEMENT
///////////////////////////////////////////////////////////////
function onload() {
    Game.initialize();
    Game.setTile(-1,0, new ResourceWorldTile("forest"));
    Game.setTile(0,0, new PlayerWorldTile());
    // Game.setTile(0,-1, new StorageWorldTile());
    // Game.setTile(0,1, new CraftingWorldTile());
    Game.setTile(1,0, new ResourceWorldTile("rocks"));

    renderAllWorldTiles()
    Game.getTile(0,0).inventory.addItem(new Item("debug_paper", 1))
    
    initializeTooltips()
    initializeActionListener()
    initializeMovementListener()

    const GHOST_ITEM_ELEM = document.getElementById("GhostItem");
    setElemDisplay(GHOST_ITEM_ELEM, false)

    // initializeBackgroundObjects(10, "forest")

    initializeAudio()
}
function initializeAudio() {
    audio["drop"].volume = 0.2
    audio["forage"].volume = 0.2

    var bgmAudio = new Audio("resources/audio/ost_a_path_well_dusted.mp3");
    bgmAudio.loop = true;
    bgmAudio.volume = 0.5;
    bgmAudio.play();

}
function renderAllWorldTiles() {
    var worldTiles = document.getElementById("WorldTiles");
    worldTiles.innerHTML = "";

    for (row of Game.allObjects.worldTiles) {
        var worldTileRow = document.createElement("div");
        worldTileRow.classList.add("worldTileRow");
        
        for (tile of row) {
            var worldTile = generateWorldTileElement(tile);
            worldTile.id = tile.id;
            worldTileRow.appendChild(worldTile)
        }

        worldTiles.appendChild(worldTileRow);
    }
}


///////////////////////////////////////////////////////////////
// TOOLTIP MANAGEMENT
///////////////////////////////////////////////////////////////
var mousePosition = {
    x:0,
    y:0
}
// Listener for tooltips.
function initializeTooltips() {
    const GENERAL_TOOLTIP_ELEM = document.getElementById("GeneralTooltip");
    const ITEM_TOOLTIP_ELEM = document.getElementById("ItemTooltip");
    const GHOST_ITEM_ELEM = document.getElementById("GhostItem");
    // const CURSOR = document.getElementById("Cursor");
    document.addEventListener("mousemove",(e)=>{
        mousePosition.x = e.clientX;
        mousePosition.y = e.clientY;
        if (!GHOST_ITEM_ELEM.classList.contains("state-hidden")) {
            updateElementPosition(GHOST_ITEM_ELEM,e.clientX, e.clientY);
        }
        // updateElementPosition(CURSOR,e.clientX,e.clientY)


        
        if (e.target.classList.contains("itemSlot")) {
            let slot = getSlotOfInventorySlotElement(e.target);
            if (slot.hasItem()) {
                if (e.clientX > window.innerWidth / 2) {
                    ITEM_TOOLTIP_ELEM.classList.remove("state-righty")
                    ITEM_TOOLTIP_ELEM.classList.add("state-lefty")
                } else {
                    ITEM_TOOLTIP_ELEM.classList.remove("state-lefty")
                    ITEM_TOOLTIP_ELEM.classList.add("state-righty")
                }
                updateItemTooltip(slot.item)

                elemPosition = e.target.getBoundingClientRect();
                updateElementPosition(
                    ITEM_TOOLTIP_ELEM,
                    (elemPosition.left + elemPosition.right) / 2, 
                    (elemPosition.top + elemPosition.bottom) / 2
                );

                setElemDisplay(ITEM_TOOLTIP_ELEM, true)
            }
        } else if (e.target.classList.contains("tooltipper")) {
            if (e.clientX > window.innerWidth / 2) {
                GENERAL_TOOLTIP_ELEM.classList.remove("state-righty")
                GENERAL_TOOLTIP_ELEM.classList.add("state-lefty")
            } else {
                GENERAL_TOOLTIP_ELEM.classList.remove("state-lefty")
                GENERAL_TOOLTIP_ELEM.classList.add("state-righty")
            }
            let object = getObjectAssociatedWithElement(e.target)
            updateGeneralTooltip(object.name, object.desc, object.lore);

            elemPosition = e.target.getBoundingClientRect();
            updateElementPosition(
                GENERAL_TOOLTIP_ELEM,
                (elemPosition.left + elemPosition.right) / 2, 
                (elemPosition.top + elemPosition.bottom) / 2
            );

            setElemDisplay(GENERAL_TOOLTIP_ELEM, true)
        } else {
            setElemDisplay(GENERAL_TOOLTIP_ELEM, false)
            setElemDisplay(ITEM_TOOLTIP_ELEM, false)
        }

        // if (e.target.classList.contains("cursorable")) {
        //     CURSOR.style.setProperty("--color",`rgba(0,255,190,0.2)`);
        //     CURSOR.classList.add("state-active");
        // } else if (e.target.classList.contains("tooltipper")) {
        //     CURSOR.style.setProperty("--color",`rgba(0, 26, 255, 0.1)`);
        //     CURSOR.classList.remove("state-active");
        // } else {
        //     CURSOR.style.setProperty("--color",``);
        //     CURSOR.classList.remove("state-active");
        // }
    })  
}

function getObjectAssociatedWithElement(elem) {
    var id = elem.getAttribute("data-obj-id")
    return Game.getObjectById(id);
}

function updateGeneralTooltip(name,desc,lore) {
    const NAME_ELEM = document.getElementById("GeneralTooltipName");
    const DESC_ELEM = document.getElementById("GeneralTooltipDesc");
    const LORE_ELEM = document.getElementById("GeneralTooltipLore");
    NAME_ELEM.innerHTML = name
    DESC_ELEM.innerHTML = desc
    LORE_ELEM.innerHTML = lore
}

function updateItemTooltip(item) {
    const TT_NAME_ELEM = document.getElementById("ItemTooltipName");
    TT_NAME_ELEM.innerHTML = Item.getName(item)
    const TT_LORE_ELEM = document.getElementById("ItemTooltipLore");
    TT_LORE_ELEM.innerHTML = Item.getLore(item)

    const TT_PROPS_CONTAINER = document.getElementById("ItemTooltipProperties");
    TT_PROPS_CONTAINER.innerHTML = "";
    const properties = Item.getProperties(item);
    for (const property in properties) {
        let line = document.createElement("p");
        line.innerHTML = `: ${properties[property]}`;
        let name = document.createElement("span");
        name.innerHTML = capitalize(property);
        line.prepend(name);

        TT_PROPS_CONTAINER.appendChild(line)
    }
    
}

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



function generateBackgroundObjects(amount, targetElem, biome = ["tree1","tree2","tree1","tree2","bush"]) {
    for (var i = 0; i < amount; i++) {
        let elem = document.createElement("div");
        let randomStructure = randElem(biome);
        elem.classList.add("backgroundObject");
        elem.style = `
            --x:${randInt(200)};
            --y:${randInt(200)};
            --url:url('resources/img/structure/${randomStructure}.PNG');
            --size:${(randInt(15) + 92.5)/100};
        `;
        targetElem.appendChild(elem);
    }
}
function generateWorldTileElement(worldTile) {
    var worldTileElem = document.createElement("div")
    worldTileElem.classList.add("worldTile");
    worldTileElem.setAttribute("data-x",worldTile.x);
    worldTileElem.setAttribute("data-y",worldTile.y);
    var worldTileName = document.createElement("div")
    worldTileName.classList.add("worldTileName");
    worldTileName.innerHTML = worldTile.name ? worldTile.name : "";
    worldTileElem.appendChild(worldTileName);
    
    worldTileName.classList.add("tooltipper");
    worldTileName.setAttribute("data-obj-id",worldTile.id)

    switch (worldTile.type) {
        case WorldTileType.PLAYER:
            worldTileElem.classList.add("PlayerWorldTile")

            // Create the hotbar
            var inventoryContainer = document.createElement("div")
            inventoryContainer.classList.add("inventoryContainer");

            var inventory = generateInventoryElement(worldTile.inventory);
            inventoryContainer.appendChild(inventory);

            worldTileElem.appendChild(inventoryContainer);

            // Create the crafting 
            var craftingContainer = document.createElement("div");
            craftingContainer.classList.add("craftingContainer");
            
            var inventory = generateInventoryElement(worldTile.craftingInventory);
            craftingContainer.appendChild(inventory);
            
            var output = document.createElement("div");
            output.classList.add("itemOutput");
            var outputSlot = document.createElement("div");
            outputSlot.classList.add("specialItemSlot");
            outputSlot.id = `${worldTile.craftingInventory.id}-output`;
            output.appendChild(outputSlot)
            
            craftingContainer.appendChild(output);
            inventoryContainer.appendChild(craftingContainer);
            worldTileElem.appendChild(inventoryContainer);
            
            break;
        case WorldTileType.RESOURCE:
            // ResourceWorldTile
            generateBackgroundObjects(
                {
                    "plains":randInt(5) + 1,
                    "forest":randInt(5) + 5,
                    "rocks":randInt(2) + 1,
                }[worldTile.biome],
                worldTileElem, 
                {
                    "plains":["bush", "grass2", "grass2", "grass2", "grass", "ground"],
                    "forest":["tree1","tree2","tree1","tree2","bush"],
                    "rocks":["monoliths"],
                }[worldTile.biome]
            )
            worldTileElem.classList.add("cursorable");
            worldTileElem.onclick = (e)=>{
                if (heldItem && Item.getType(heldItem) == "block") {
                    // Place block
                    var x = parseInt(e.target.getAttribute("data-x"));
                    var y = parseInt(e.target.getAttribute("data-y"));
                    Game.placeBlock(x,y,heldItem);
                    heldItem.increment(-1);
                    const GHOST_ITEM_ELEM = document.getElementById("GhostItem");
                    setElemDisplay(GHOST_ITEM_ELEM, false)
                    playAudio("drop")
                } else {
                    // Gather resource
                    lootTable = worldTile.harvestTable.default;
                    if (heldItem && worldTile.harvestTable.hasOwnProperty(heldItem.id)) {
                        console.log('special detected')
                        lootTable = worldTile.harvestTable[heldItem.id];
                    }
                    var rolledItemId = randElemWeighted(lootTable);
                    if (rolledItemId != "empty") {
                        Game.addItem(new Item(rolledItemId,1));
                        playAudio("forage");
                    }
                }
            }
            worldTileName.style.setProperty("opacity",0.5)
            break;
        case WorldTileType.STORAGE:
            // StorageWorldTile
            var inventoryContainer = document.createElement("div")
            inventoryContainer.classList.add("inventoryContainer");

            var inventory = generateInventoryElement(worldTile.inventory);
            inventoryContainer.appendChild(inventory);

            worldTileElem.appendChild(inventoryContainer);
            break;
        case WorldTileType.CRAFTING_INVENTORY:
            // CraftingWorldTile 
            var inventoryContainer = document.createElement("div")
            inventoryContainer.classList.add("inventoryContainer");

            var craftingContainer = document.createElement("div");
            craftingContainer.classList.add("craftingContainer");
            
            var inventory = generateInventoryElement(worldTile.craftingInventory);
            craftingContainer.appendChild(inventory);
            
            var output = document.createElement("div");
            output.classList.add("itemOutput");
            var outputSlot = document.createElement("div");
            outputSlot.classList.add("specialItemSlot");
            outputSlot.id = `${worldTile.craftingInventory.id}-output`;
            output.appendChild(outputSlot)
            
            craftingContainer.appendChild(output);
            inventoryContainer.appendChild(craftingContainer);
            worldTileElem.appendChild(inventoryContainer);

            break;
        case WorldTileType.EMPTY:
            // DO Jack Shit
            break;
        default:
            console.warn(`generateWorldTile(): Received world tile of type ${worldTile.type}, however no such type exists.`)
    }

    return worldTileElem;
}
function generateInventoryElement(inventory) {
    let elem = document.createElement("div");
    elem.classList.add("inventory")
    elem.id = `inventory-${inventory.id}`;
    for (row in inventory.slots) {
        var itemRow = document.createElement("div");
        itemRow.classList.add("itemRow")
        for (col in inventory.slots[row]) {
            let slot = document.createElement("div");
            slot.id = `${inventory.id}-${row}-${col}`
            slot.classList.add("itemSlot");
            slot.addEventListener('mousedown', inventorySlotTransferEvent_SlotManageMouseDown);
            // slot.addEventListener('mousedown', inventorySlotTransferEvent_SlotManageMouseDown);
            // slot.addEventListener('mouseup', inventorySlotTransferEvent_SlotManageMouseUp);
            itemRow.appendChild(slot);
        }
        elem.appendChild(itemRow);
    }

    return elem
}

////////////////////////////////////////////////////////////
// ITEM MANAGEMENT
////////////////////////////////////////////////////////////

function getItemArchetype(id) {
    if (ItemTypes.hasOwnProperty(id)) return ItemTypes[id]
    else {
        console.warn(`getItemArchetype(): Attempted to get archetype of id "${id}", however no such archetype exists.`);
        return Item.empty
    }
}

///////////////////////////////////////////////////////////////
// KEYBOARD EVENT MANAGEMENT
///////////////////////////////////////////////////////////////
function initializeActionListener() {
    document.addEventListener("keypress",manageKeyboardActions);
}
function manageKeyboardActions(e) {
    var actions = {
        "KeyQ": (e)=>{
            // Throw heldItem
            heldItem = null
            const GHOST_ITEM_ELEM = document.getElementById("GhostItem");
            playAudio("forage");
            setElemDisplay(GHOST_ITEM_ELEM, false)
        }
    }
    
    if (!actions.hasOwnProperty(e.code)) return false

    actions[e.code](e);
}

var position = {
    x:0,
    y:0
}
function initializeMovementListener() {
    document.addEventListener("keypress",manageCameraMoveEvent);
}
function manageCameraMoveEvent(e) {
    var translations = {
        "KeyW":         [0,-1],
        "ArrowUp":      [0,-1],
        "KeyA":         [-1,0],
        "ArrowLeft":    [-1,0],
        "KeyS":         [0,1],
        "ArrowDown":    [0,1],
        "KeyD":         [1,0],
        "ArrowRight":   [1,0],
    }
    
    if (!translations.hasOwnProperty(e.code)) return false

    position.x += translations[e.code][0]
    position.y += translations[e.code][1]

    moveCamera(position.x,position.y);
}

function moveCamera(x,y) {
    var WORLD_CENTERER = document.getElementById("WorldTileCenterer");
    WORLD_CENTERER.style.setProperty("--x",x);
    WORLD_CENTERER.style.setProperty("--y",y);
}

///////////////////////////////////////////////////////////////
// CRAFTING EVENT MANAGEMENT
///////////////////////////////////////////////////////////////
function craftEvent_startAttempt(inventory) {
    let recipe = inventory.satisfiesCraft()

    var elem = document.getElementById(`${inventory.id}-output`);
    if (recipe) {
        // Display recipe
        var falseSlot = new InventorySlot();
        falseSlot.addItem(new Item(recipe.result.id,recipe.result.count),false)
        InventorySlot.updateView(falseSlot,elem)
        elem.onmousedown = (e)=>{
            craftEvent_endAttempt(falseSlot,elem,inventory)
        }
    } else {
        // Reset recipe
        InventorySlot.updateView(new InventorySlot(),elem)
        elem.onmousedown = ()=>{}
    }
}
function craftEvent_endAttempt(falseSlot,elem,inventory) {
    succeeded = false
    if (heldItem == null) {
        // Drag object out of thing
        heldItem = falseSlot.item.split(falseSlot.item.count);
        succeeded = true
    } else if (heldItem != null && falseSlot.item.doesStackWith(heldItem)) {
        heldItem = Item.combine(heldItem, falseSlot.item);
        succeeded = true
    }
    if (succeeded) {
        for (row of inventory.slots) {
            for (slot of row) {
                if (!Item.isEmpty(slot.item)) slot.item.increment(-1);
                InventorySlot.updateView(slot);
            }
        }

        displayGhostOf(heldItem)
        
        InventorySlot.updateView(falseSlot,elem);
        playAudio("take")
        
        craftEvent_startAttempt(inventory)
    }

}

///////////////////////////////////////////////////////////////
// DRAG EVENT MANAGEMENT
///////////////////////////////////////////////////////////////
var heldItem = null;
var oldSlot = null;

function inventorySlotTransferEvent_SlotManageMouseDown(e) {
    const GHOST_ITEM_ELEM = document.getElementById("GhostItem");
    var slot = getSlotOfInventorySlotElement(e.target)

    if (heldItem == null) {
        if (slot.hasItem()) {
            // Take item from slot and hold
            if (e.button == 2) {
                toHold = Math.ceil(slot.item.count / 2)
            } else {
                toHold = slot.item.count;
            }
            displayGhostOf(slot.item)
            heldItem = slot.item.split(toHold);
            slot.signalCraftEventAttempt();
            
            InventorySlot.updateView(slot);
            playAudio("take")
        }
    } else {
        if (false) {

        } else if (slot.hasItem()) {
            if (slot.item.doesStackWith(heldItem)) {
                // Stack item in
                toAdd = heldItem
                if (e.button == 2) {
                    toAdd = heldItem.split(1)
                }
                slot.addItem(toAdd);
                InventorySlot.updateView(slot);
                playAudio("drop")
            } else {
                // Switch item, hold this new item
                temp = slot.item;
    
                slot.item = heldItem;
                slot.signalCraftEventAttempt();
                InventorySlot.updateView(slot);
                playAudio("drop")
    
                heldItem = temp;
                playAudio("take")
            }
        } else if (!slot.hasItem()) {
            // Drop item to empty slot
            toAdd = heldItem
            if (e.button == 2) {
                toAdd = heldItem.split(1)
            }
            slot.addItem(toAdd);
            InventorySlot.updateView(slot);
            playAudio("drop")
        }
    }
    if (heldItem != null && heldItem.count == 0) { 
        heldItem = null
        setElemDisplay(GHOST_ITEM_ELEM, false)
    } else if (heldItem != null) {
        displayGhostOf(heldItem)
    }
}
// var selectedSlot = null;
// function inventorySlotTransferEvent_SlotManageMouseDown(e) {
//     let slot = getSlotOfInventorySlotElement(e.target);
//     if (slot.hasItem()) {
//         selectedSlot = slot;
//         displayGhostOf(slot.item)
//         playAudio("take")
//         document.body.addEventListener("mouseup", inventorySlotTransferEvent_WorldManageMouseUp)
//         document.addEventListener("mouseup", inventorySlotTransferEvent_cleanUp)
//     }
// }
// function inventorySlotTransferEvent_SlotManageMouseUp(e) {
//     if (selectedSlot) {
//         let slot = getSlotOfInventorySlotElement(e.target);
//         if (selectedSlot.transferItemTo(slot,e.button == 2 ? 0.5 : 1)) playAudio("drop")
//         inventorySlotTransferEvent_cleanUp()
//     }
// }
// function inventorySlotTransferEvent_WorldManageMouseUp(e) {
//     document.body.removeEventListener("mouseup", inventorySlotTransferEvent_WorldManageMouseUp)
// }
// function inventorySlotTransferEvent_cleanUp() {
//     const GHOST_ITEM_ELEM = document.getElementById("GhostItem");
//     setElemDisplay(GHOST_ITEM_ELEM, false)
//     selectedSlot = null
//     document.removeEventListener("mouseup", inventorySlotTransferEvent_cleanUp) 
// }

function displayGhostOf(item) {
    const GHOST_ITEM_ELEM = document.getElementById("GhostItem");
    updateElementPosition(GHOST_ITEM_ELEM,mousePosition.x,mousePosition.y);
    GHOST_ITEM_ELEM.style.setProperty("--url",`url('resources/img/item/${item.id}.PNG')`);
    GHOST_ITEM_ELEM.children[0].innerHTML = item.count > 1 ? item.count : "";
    console.log()
    setElemDisplay(GHOST_ITEM_ELEM, true);
}
function getSlotOfInventorySlotElement(elem) {
    let raw = elem.id.split("-")
    let data = {
        inventory:raw[0],
        row:parseInt(raw[1]),
        column:parseInt(raw[2])
    }
    var inventory = Game.getInventory(data.inventory);
    if (inventory) {
        return inventory.getSlot(data.row,data.column);
    } else {
        console.warn(`getSlotOfInventorySlotElement(): Attempted to access inventory ${data.inventory}, however no such inventory exists.`)
    }
}

///////////////////////////////////////////////////////////////
// MISCELLANEOUS
///////////////////////////////////////////////////////////////
// Returns a random integer from 0 to max.
function randInt(max) {
    return Math.floor(Math.random() * (max + 1));
}
// Returns a random elem from a given arr.
function randElem(arr) {
    return arr[randInt(arr.length - 1)];
}
// Returns a random elem with weights.
function randElemWeighted(weightedDict) {
    const weights = Object.values(weightedDict);
    const keys = Object.keys(weightedDict);
    var max = weights.reduce((a,b) => a + parseInt(b), 0);
    var roll = randInt(max);

    var sum = 0;
    for (i in weights) {
        sum += parseInt(weights[i]);
        if (roll <= sum) return keys[i]
    }
}

// From Grepper search: "capitalize js"
const capitalize = (str) => str[0].toUpperCase() + str.slice(1)



///////////////////////////////////////////////////////////////
// AUDIO MANAGEMENT
///////////////////////////////////////////////////////////////
const audio = {
    drop:new Audio("resources/audio/pop.mp3"),
    take:new Audio("resources/audio/take.mp3"),
    forage:new Audio("resources/audio/forage.mp3"),
}
function playAudio(key) {
    const sfx = audio[key];
    sfx.pause();
    sfx.currentTime = 0;
    sfx.play()
}




///////////////////////////////////////////////////////////////
// DEPRECATED
///////////////////////////////////////////////////////////////
