const Item = require('../models/Item.js');

//returns item with an itemCode
module.exports.getItem = function (itemID,ItemsModel) {

    return new Promise((resolve, reject) => {
        ItemsModel.find({itemCode:itemID}).then(data => {
            resolve(new Item(data[0].itemCode, data[0].itemName, data[0].itemCategory, data[0].itemDescription,
                data[0].itemIngredients, data[0].itemRecipe, data[0].itemRating, data[0].itemImageURL));
        }).catch(err => { return reject(err); })
    })
};

//returns all the items in DB
module.exports.getAllItems = function (Items){

    return new Promise((resolve, reject) => {
        Items.find({}).then(data => {
            let models = [];
            for (let x = 0; x < data.length; x++) {
                models.push(new Item(data[x].itemCode, data[x].itemName, data[x].itemCategory, data[x].itemDescription,
                    data[x].itemIngredients, data[x].itemRecipe, data[x].itemRating, data[x].itemImageURL));
            }
            resolve(models);
        }).catch(err => { return reject(err); })
    })
};

//validates if an itemCode exists in DB
module.exports.validateItemCode = function (itemID,Items) {

    return new Promise((resolve, reject) => {
        Items.find({itemCode:itemID}).then(data => {
            resolve(data.length>0);
        }).catch(err => { return reject(err); })
    })
};

var categories = [];

//return all categories in DB
module.exports.getCategories = function (itemModel) {

    return new Promise((resolve, reject) => {
        itemModel.find({}).then(data => {
            for (let x = 0; x < data.length; x++) {
                if (!categories.includes(data[x].itemCategory)) {
                    categories.push(data[x].itemCategory);
                }
            }
            resolve(categories);
        }).catch(err => { return reject(err); })
    })

};


//function to add item to user profile
module.exports.addItem=function(itemModel, item) {

    return new Promise((resolve, reject) => {

        itemModel.create({itemCode:item.itemCode,
            itemName: item.itemName,
            itemCategory:item.itemCategory,
            itemDescription:item.itemDescription,
            itemIngredients:item.itemIngredients,
            itemRecipe:item.itemRecipe,
            itemRating:item.itemRating,
            itemImageURL:item.itemImageURL,
            UserId:item.UserId
        }).then(function () {
            resolve()
        }).catch(err => { return reject(err); })

    });
};


//method to return an item image URL
module.exports.getImageURL = function (itemCode) {
    return "/assets/images/" + itemCode + ".jpeg";
};
