class UserItem {

    constructor(Item, rating, madeIt) {
        this._Item = Item;
        this._rating = rating;
        this._madeIt = madeIt;
    }

    /**
     *
     * Getter and Setters
     */


    get Item() {
        return this._Item;
    }

    set Item(value) {
        this._Item = value;
    }

    get rating() {
        return this._rating;
    }

    set rating(value) {
        this._rating = value;
    }

    get madeIt() {
        return this._madeIt;
    }

    set madeIt(value) {
        this._madeIt = value;
    }
}

module.exports = UserItem;