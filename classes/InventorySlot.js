// A slot must always be part of an inventory. It cannot exist outside of one.
class InventorySlot {
    item;
    constructor(invIndex,r,c) {
        this.locationData = {
            inventory:invIndex,
            row:r,
            column:c
        }
        this.item = Item.empty
    }
    static isIdentical(a,b) {
        return  a.locationData.inventory.name == b.locationData.inventory.name &&
                a.locationData.row == b.locationData.row &&
                a.locationData.column == b.locationData.column;
    }
    static updateView(slot,elem = slot.getElem()) {
        if (Item.isEmpty(slot.item)) {
            elem.innerHTML = ""
        } else {
            elem.innerHTML = ""
            let item = document.createElement("div")
            item.classList.add("item")
            item.classList.add("item-" + getItemArchetype(slot.item.id).type)
            item.style.setProperty("--url",`url('resources/img/item/${slot.item.id}.PNG')`)
            elem.appendChild(item)
        }
        
        // Rendering the item count. It will not render when items are 1, but will render otherwise.
        // This means negative and 0 item stacks will render, so long as they are not empty.
        // This is for bug tracking.
        if (slot.item.count != 1 && !Item.isEmpty(slot.item)) elem.style.setProperty("--itemCount",`"${slot.item.count}"`)
        else elem.style.setProperty("--itemCount",`""`)
    }
    get inventory() {
        return Game.getInventory(this.locationData.inventory);
    }
    signalCraftEventAttempt() {
        if (this.inventory.listeningForCrafts) craftEvent_startAttempt(this.inventory)
    }
    make_empty(updateView = true) {
        this.item = Item.empty
        if (updateView) {
            InventorySlot.updateView(this)
            this.signalCraftEventAttempt()
        }
    }
    hasItem() {
        return !(Item.isEmpty(this.item))
    }
    addItem(item,updateView = true) {
        if (!this.hasItem()) {
            this.item = item.copy();
            item.makeEmpty();
            if (updateView) {
                InventorySlot.updateView(this)
                this.signalCraftEventAttempt()
            }
            return true;
        } else if (this.item.doesStackWith(item)) {
            Item.combine(this.item, item)
            if (updateView) {
                InventorySlot.updateView(this)
                this.signalCraftEventAttempt()
            }
            return true;
        }

        return false
    }
    removeItem(count,updateView = true) {
        let validRemove = count <= this.item.count;
        assert(validRemove,`InventorySlot.removeItem(): Attempted to remove ${count} of item ${this.item.id} in this slot, however there is only ${this.item.count} present within the slot. Nothing is removed.`)
        if (!validRemove) {
            return;
        }
        
        let removedItem = this.item.copy().setCount(count)
        this.item = this.item.setCount(this.item.count - count)

        if (updateView) {
            InventorySlot.updateView(this)
            this.signalCraftEventAttempt()
        }

        return removedItem;
    }
    // transferItemTo(slot,amount = 1) {
    //     if (!this.hasItem() || InventorySlot.isIdentical(this,slot)) {
    //         return false
    //     }
    //     if (!slot.hasItem()) {
    //         let item = this.removeItem(Math.max(Math.floor(this.item.count * amount),1))
    //         slot.addItem(item)
    //         return true
    //     } else if (slot.hasItem() && this.item.doesStackWith(slot.item)) {
    //         let toTransfer = Math.max(Math.floor(this.item.count * amount),1)
    //         slot.item.increment(toTransfer)
            
    //         InventorySlot.updateView(slot)
    //         slot.signalCraftEventAttempt()

    //         this.removeItem(toTransfer)
    //         return true
    //     }
    //     return false
    // }
    getElem() {
        return document.getElementById(this.getId());
    }
    getId() {
        return `${this.locationData.inventory}-${this.locationData.row}-${this.locationData.column}`
    }
}