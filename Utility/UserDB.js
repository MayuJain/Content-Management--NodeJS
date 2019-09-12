const User = require('../models/User.js');
const UserItem = require('../models/UserItem.js');
const ItemDB = require('../Utility/itemDB.js');
const Item = require('../models/Item');

//returns all the Users in DB
module.exports.getAllUsers = function (UserModel) {

    return new Promise((resolve, reject) => {
        UserModel.find({}).then(data => {
            let models = [];
            for (let x = 0; x < data.length; x++) {
                models.push(new User(data[x].UserId,"", data[x].firstName, data[x].lastName, data[x].emailAddress,
                    data[x].address1, data[x].address2, data[x].city, data[x].state, data[x].zipCode, data[x].country));
            }
            resolve(models);
        }).catch(err => { return reject(err); })
    })
};

module.exports.getUser = function (Users,userID) {

    return new Promise((resolve, reject) => {
        Users.find({UserId:userID}).then(data => {
            resolve(new User(data[0].UserId,"", data[0].firstName, data[0].lastName, data[0].emailAddress,
                data[0].address1, data[0].address2, data[0].city, data[0].state, data[0].zipCode, data[0].country));
        }).catch(err => { return reject(err); })
    })
};

module.exports.checkUser = function (Users,userID) {

    return new Promise((resolve, reject) => {
        Users.find({UserId:userID}).then(data => {
            resolve(Object.keys(data).length);
        }).catch(err => { return reject(err); })
    })
};

module.exports.getUserItemsFromDB = function (userID,ItemsModel,UserItemModel) {

    return new Promise((resolve, reject) => {
        UserItemModel.find({UserId:userID}).then(async data => {
            let userItemList = [];
            for (let i = 0; i < data.length; i++) {
                let item = await ItemDB.getItem(data[i].itemCode, ItemsModel);
                let userItem = new UserItem(item, data[i].rating, data[i].madeIt);
                userItemList.push(userItem);
            }
            resolve(userItemList);
        }).catch(err => { return reject(err); })
    })
};

module.exports.getItemsCreatedByUser = function (userID,ItemsModel) {

    return new Promise((resolve, reject) => {
        ItemsModel.find({UserId:userID}).then(async data => {
            let userItemList = [];
            for (let i = 0; i < data.length; i++) {
                userItemList.push(new Item(data[i].itemCode,data[i].itemName,data[i].itemCategory,
                    data[i].itemDescription,data[i].itemIngredients,data[i].itemRecipe,data[i].itemRating,data[i].itemUserId));
            }
            resolve(userItemList);
        }).catch(err => { return reject(err); })
    })
};

module.exports.validateUser = function (Users,userID,pswrd) {

    return new Promise((resolve, reject) => {
        Users.find({$and: [{UserId:userID},{password:pswrd}]}).then(data => {
            if(data.length === 1){
                resolve(true);
            }else{
                resolve(false);
            }
        }).catch(err => { return reject(err); })
    })
};

//function to add item to user profile
module.exports.addUser=function(userModel, user) {

    return new Promise((resolve, reject) => {
        userModel.create({UserId:user.UserId,
            password:user.password,
            firstName:user.firstName,
            lastName:user.lastName,
            emailAddress:user.emailAddress,
            address1:user.address1,
            address2:user.address2,
            city:user.city,
            state:user.state,
            zipCode:user.zipCode,
            country:user.country
        }).then(function () {
            resolve()
        }).catch(err => { return reject(err); })

    });
};