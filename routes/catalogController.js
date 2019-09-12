const express = require('express');
const ItemDB = require('../Utility/ItemDB.js');
const router = express.Router();
const {check, validationResult} = require('express-validator/check');

var mongoose = require('mongoose');

//mongoose.connect("mongodb://localhost:27017/Project", {useNewUrlParser: true});

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log("we're connected!");
});

var itemSchema = new mongoose.Schema({
    itemCode: {type: String, required: true},
    itemName: String,
    itemCategory: String,
    itemDescription: String,
    itemIngredients: String,
    itemRecipe: String,
    itemRating: Number,
    itemImageURL: String,
    UserId: {type: String, required: true}
}, {
    versionKey: false
});

var ItemModel = mongoose.model("Items", itemSchema, 'Items');

//for url categories/items/:itemCode
router.get('/items/:itemCode',
    check('itemCode').matches(/^(CA|DO|CC|BW|CO|BR|CH)\d+$/).withMessage('Must be AlphaNumeric')
        .isLength({min: 3}).withMessage('Must be at least 3 characters long')
        .custom(value => {
            return ItemDB.getItem(value, ItemModel).then(item => {
                if (!item) {
                    return Promise.reject('Item Code is  not valid.');
                }
            });
        }).withMessage('Item code is not valid')
    , async function (req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            let categories = await ItemDB.getCategories(ItemModel);
            let items = await ItemDB.getAllItems(ItemModel);
            res.render('categories', {
                category: categories,
                items: items,
                user: req.session.theUser,
                error: errors.array()
            });
        } else {

            let itemCode = req.params.itemCode;
            if (await ItemDB.validateItemCode(itemCode, ItemModel)) {
                var itemFromDB = await ItemDB.getItem(itemCode, ItemModel);
                res.render('items', {item: itemFromDB, user: req.session.theUser});
            } else {
                let categories = await ItemDB.getCategories(ItemModel);
                let items = await ItemDB.getAllItems(ItemModel);
                res.render('categories', {category: categories, items: items, user: req.session.theUser, error: []});
            }
        }
    });

//for url categories/items?itemCode=CA3
router.get('/items',  check('itemCode').matches(/^(CA|DO|CC|BW|CO|BR|CH)\d+$/).withMessage('Must be AlphaNumeric')
        .isLength({min: 3}).withMessage('Must be at least 3 characters long')
        .custom(value => {
            return ItemDB.getItem(value, ItemModel).then(item => {
                if (!item) {
                    return Promise.reject('Item Code is  not valid.');
                }
            });
        }).withMessage('Item code is not valid')
    , async function (req, res) {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            let categories = await ItemDB.getCategories(ItemModel);
            let items = await ItemDB.getAllItems(ItemModel);
            res.render('categories', {
                category: categories,
                items: items,
                user: req.session.theUser,
                error: errors.array()
            });
        } else {

            if (Object.keys(req.query).length !== 0 && Object.keys(req.query).includes('itemCode')) {

                let itemCode = req.query.itemCode;

                if (await ItemDB.validateItemCode(itemCode, ItemModel)) {
                    var itemFromDB = await ItemDB.getItem(itemCode, ItemModel);
                    res.render('items', {item: itemFromDB, user: req.session.theUser});
                } else {
                    let categories = await ItemDB.getCategories(ItemModel);
                    let items = await ItemDB.getAllItems(ItemModel);
                    res.render('categories', {
                        category: categories,
                        items: items,
                        user: req.session.theUser,
                        error: []
                    });
                }
            } else {
                let categories = await ItemDB.getCategories(ItemModel);
                let items = await ItemDB.getAllItems(ItemModel);
                res.render('categories', {category: categories, items: items, user: req.session.theUser, error: []});
            }
        }
    });

//for url categories/*
router.get('/*', async function (req, res) {
    let categories = await ItemDB.getCategories(ItemModel);
    let itemsData = await ItemDB.getAllItems(ItemModel);
    res.render('categories', {category: categories, items: itemsData, user: req.session.theUser, error: []});
});

module.exports = router;
module.exports.ItemModel = ItemModel;