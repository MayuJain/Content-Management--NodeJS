class Item {

    constructor(itemCode, itemName, itemCategory, itemDescription, itemIngredients, itemRecipe, itemRating, itemImageURL,UserId) {
        this._itemCode = itemCode;
        this._itemName = itemName;
        this._itemCategory = itemCategory;
        this._itemDescription = itemDescription;
        this._itemIngredients = itemIngredients;
        this._itemRecipe = itemRecipe;
        this._itemRating = itemRating;
        this._itemImageURL = itemImageURL;
        this._UserId = UserId;
    }

    /**
     *
     * Getter and Setters
     */


    get itemCode() {
        return this._itemCode;
    }

    set itemCode(value) {
        this._itemCode = value;
    }

    get itemName() {
        return this._itemName;
    }

    set itemName(value) {
        this._itemName = value;
    }

    get itemCategory() {
        return this._itemCategory;
    }

    set itemCategory(value) {
        this._itemCategory = value;
    }

    get itemDescription() {
        return this._itemDescription;
    }

    set itemDescription(value) {
        this._itemDescription = value;
    }

    get itemIngredients() {
        return this._itemIngredients;
    }

    set itemIngredients(value) {
        this._itemIngredients = value;
    }

    get itemRecipe() {
        return this._itemRecipe;
    }

    set itemRecipe(value) {
        this._itemRecipe = value;
    }

    get itemRating() {
        return this._itemRating;
    }

    set itemRating(value) {
        this._itemRating = value;
    }

    get itemImageURL() {
        return this._itemImageURL;
    }

    //will be using in future to save the images
    set itemImageURL(value) {
        this._itemImageURL = value;
    }

    get UserId() {
        return this._UserId;
    }

    set UserId(value) {
        this._UserId = value;
    }
}

module.exports = Item;