// Represents a quantity of items. Can be called an item stack.
class Item {
    static empty = new Item("empty")

    id;
    constructor(id,count = 0) {
        this.id = id;
        this.count = count;
    }
    static getName(item) {
        if (ItemTypes.hasOwnProperty(item.id)) return ItemTypes[item.id].name;
        else return "An Item...";
    }
    static getLore(item) {
        if (ItemTypes.hasOwnProperty(item.id)) return ItemTypes[item.id].lore;
        else return "It's a thing, you think?";
    }
    static getData(item) {
        if (ItemTypes.hasOwnProperty(item.id)) return ItemTypes[item.id];
        else console.warn(`Item.getData(): Attempted to get data of item with id ${item.id}, however such id is not present within ItemTypes (items.js)`)
    }
    static getProperties(item) {
        if (ItemTypes.hasOwnProperty(item.id)) if (ItemTypes[item.id].hasOwnProperty("properties")) return ItemTypes[item.id].properties;
        else return [];
    }
    static getType(item) {
        if (ItemTypes.hasOwnProperty(item.id)) if (ItemTypes[item.id].hasOwnProperty("type")) return ItemTypes[item.id].type;
        else return "resource";
    }
    static isEmpty(item) {
        if (item.id == Item.empty.id) assert(item.count == 0,`Item.isEmpty: Given item is of id "${item.id}" which is empty, however has count ${item.count}, which is not zero.`);
        return item.id == Item.empty.id;
    }
    static combine(a, b) {
        if (a.doesStackWith(b)) {
            a.count += b.count;
            b.count = 0;
            return a;
        }
    }
    increment(count) {
        this.count += count;
        if (this.count <= 0) {
            this.makeEmpty();
        }
        return this;
    }
    setCount(count) {
        this.count = count;
        if (this.count <= 0) {
            this.makeEmpty();
        }
        return this;
    }
    makeEmpty() {
        this.id = Item.empty.id;
        this.count = Item.empty.count;
        return this;
    }
    split(amount = Math.ceil(this.count / 2)) {
        var new_stack = new Item(this.id).setCount(amount);
        this.setCount(this.count - amount)
        return new_stack
    }
    copy() {
        return new Item(this.id).setCount(this.count);
    }
    get type() {
        return Item.getData(this).type;
    }
    doesStackWith(item) {
        return this.id == item.id;
    }
}