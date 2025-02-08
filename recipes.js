class Recipe {
    constructor(type,result) {
        this.type = type
        // assert(items.hasOwnProperty(result.id), `Recipe.constructor(): Initialized recipe with output result ${result.id}, however no such item exists.`);
        this.result = result  
    }
}
class ShapedRecipe extends Recipe {
    constructor(props) {
        super("shaped",props.result)
        
        const validProps = [
            assert(props.hasOwnProperty("result"),  "ShapedRecipe.constructor(): Attempted to initialize ShapedRecipe but is missing argument: result. The following props were received.", props),
            assert(props.hasOwnProperty("key"),     "ShapedRecipe.constructor(): Attempted to initialize ShapedRecipe but is missing argument: key. The following props were received.",    props),
        ];
        if (!validProps.every((val)=>val)) {
            console.warn("ShapedRecipe.constructor(): Missing some props. Initialization incomplete.")
            this.result = {
                id:Item.empty,
                count:0
            }
            this.key = []
            this.values = {}
            return;
        }

        this.key = props.key  
        this.values = props.values
    }
}
class ShapelessRecipe extends Recipe {
    constructor(props) {
        super("shapeless",props.result)

        const validProps = [
            assert(props.hasOwnProperty("result"),       "ShapelessRecipe.constructor(): Attempted to initialize ShapelessRecipe but is missing argument: result. The following props were received.", props),
            assert(props.hasOwnProperty("ingredients"),  "ShapelessRecipe.constructor(): Attempted to initialize ShapelessRecipe but is missing argument: key. The following props were received.",    props),
        ];
        if (!validProps.every((val)=>val)) {
            console.warn("ShapelessRecipe.constructor(): Missing some props. Initialization incomplete.")
            this.result = {
                id:Item.empty,
                count:0
            }
            this.ingredients = []
            return;
        }

        this.ingredients = props.ingredients
    }
}

var recipes = [
    new ShapelessRecipe({
        result:{
            id:"plank",
            count:4
        },
        ingredients:[
            "log"
        ]
    }),
    new ShapelessRecipe({
        result:{
            id:"thread",
            count:1
        },
        ingredients:[
            "string","string","string"
        ]
    }),
    new ShapelessRecipe({
        result:{
            id:"flint",
            count:4
        },
        ingredients:[
            "flint_neko"
        ]
    }),
    new ShapelessRecipe({
        result:{
            id:"large_obsidian",
            count:2
        },
        ingredients:[
            "obsidian_pecko"
        ]
    }),
    new ShapelessRecipe({
        result:{
            id:"obsidian_shard",
            count:2
        },
        ingredients:[
            "large_obsidian"
        ]
    }),
    new ShapedRecipe({
        result:{
            id:"small_chest",
            count:1
        },
        key:[
            ["plank","plank","plank"],
            ["plank","","plank"],
            ["plank","plank","plank"],
        ]
    }),
    new ShapedRecipe({
        result:{
            id:"flint_pickaxe",
            count:1
        },
        key:[
            ["flint","flint","flint"],
            ["","stick",""],
            ["","stick",""],
        ]
    }),
    new ShapedRecipe({
        result:{
            id:"flint_hammer",
            count:1
        },
        key:[
            ["flint","flint"],
            ["","stick"],
            ["","stick"],
        ]
    }),
    new ShapedRecipe({
        result:{
            id:"flint_axe",
            count:1
        },
        key:[
            ["flint","flint"],
            ["flint","stick"],
            ["","stick"],
        ]
    }),
    new ShapedRecipe({
        result:{
            id:"grass_bread",
            count:1
        },
        key:[
            ["grass","grass","grass"],
        ]   
    }),
    new ShapedRecipe({
        result:{
            id:"crafting_table",
            count:1
        },
        key:[
            ["plank","plank"],
            ["plank","plank"],
        ]
    }),
    new ShapedRecipe({
        result:{
            id:"glass",
            count:1
        },
        key:[
            ["sand","sand"],
            ["sand","sand"],
        ]
    }),
    new ShapedRecipe({
        result:{
            id:"stick",
            count:4
        },
        key:[
            ["plank"],
            ["plank"],
        ]
    })
]