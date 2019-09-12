const express = require('express');
const UserItemDB = require('../Utility/UserItemDB.js');
const ItemDB = require('../Utility/ItemDB.js');
const UserDB = require('../Utility/UserDB.js');
const Item = require('../models/Item');
const User = require('../models/User');
const router = express.Router();
const bodyParser = require('body-parser');
const controller = require('./catalogController.js');

const {check, validationResult} = require('express-validator/check');

var urlencodedparser = bodyParser.urlencoded({extended: false});

var mongoose = require('mongoose');

//mongoose.connect("mongodb://localhost:27017/Project", {useNewUrlParser: true});

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log("we're connected!");
});

var userSchema = new mongoose.Schema({
    UserId: {type: String, required: true},
    password: {type: String, required: true},
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    emailAddress: String,
    address1: String,
    address2: String,
    city: String,
    state: String,
    zipCode: Number,
    country: String
}, {
    versionKey: false
});

var userItemSchema = new mongoose.Schema({
    UserId: {type: String, required: true},
    itemCode: {type: String, required: true},
    rating: Number,
    madeIt: Boolean
}, {
    versionKey: false
});

var UserModel = mongoose.model("User", userSchema, 'Users');
var UserItemModel = mongoose.model("UserItem", userItemSchema, 'UserItem');
var ItemModel = controller.ItemModel;


//this route will be executed when user clicks on Sign-In button
router.get('/signIn', async function (req, res) {
    if (req.session.theUser) {
        res.render('myItems', {msg: "", items: req.session.userProfile, user: req.session.theUser, error: []});
    } else {
        res.render('login', {msg: "", error: []});
    }
});

//this route will be executed when user wants to add item
router.post('/addItem', urlencodedparser, async function (req, res) {
        console.log("no errors");
        let userId = req.session.theUser._UserId;

      var itemsList = await ItemDB.getAllItems(ItemModel);
      var noOfItems = itemsList.length;
      console.log('no of items:'+noOfItems.length);
      var itemCode ="";
      if(req.body.itemCategory === "Cakes"){
          itemCode = "CA"+(noOfItems+1);
      }else if(req.body.itemCategory === "Donuts"){
          itemCode = "DO"+(noOfItems+1);
      }else if(req.body.itemCategory === "Cupcakes"){
          itemCode = "CC"+(noOfItems+1);
      }else if(req.body.itemCategory === "Brownies"){
          itemCode = "BW"+(noOfItems+1);
      }else if(req.body.itemCategory === "Cookies"){
          itemCode = "CO"+(noOfItems+1);
      }else if(req.body.itemCategory === "Bread"){
          itemCode = "BR"+(noOfItems+1);
      }else{
          itemCode = "CH"+(noOfItems+1);
      }
    console.log('itemcode:'+itemCode);
      console.log("item name: "+req.body.itemName);
        //itemCode, itemName, itemCategory, itemDescription, itemIngredients, itemRecipe, itemRating, itemImageURL,UserId
        var item = new Item(itemCode, req.body.itemName, req.body.itemCategory, req.body.itemDescription, req.body.itemIngredients,
            req.body.itemRecipe, req.body.itemRating, "/assets/images/avators.jpeg",userId);
        await ItemDB.addItem(ItemModel,item);
    res.redirect('/categories');

});

//this route will be executed when user wants to register himself
router.post('/register', urlencodedparser,[
    check('username').isLength({min: 8}).withMessage('Must be at least 8 characters long')
        .matches(/^[a-zA-Z0-9]+$/).withMessage("You can use characters in uppercase/lowercase and numbers.")
        .custom(async value => {
            return UserDB.checkUser(UserModel, value).then(records => {
                console.log("value of records:" + records);
                if (records !== 0) {
                    throw new Error('Username already exist.');
                } else {
                    return true;
                }
            })
        }),

    check('password').isLength({min: 8}).withMessage('Must be at least 8 characters long')
        .isLength({max: 15}).withMessage('length should not be more than 15 characters.')
        .matches(/^(?=.*[A-Z])(?=.+[a-z])(?=.+\d)(?=.+[$!()@&]).{8,15}$/).withMessage('Password should contains atleast 1 Uppercase, 1 lowercase, 1 number, 1 special character.'),

    check('password2').custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error('Password confirmation does not match password');
        }else{
            return true;
        }
    })], async function (req, res) {
    console.log('hello there');
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        res.render('registration', {msg: "", error: errors.array()});
    } else {
        console.log("no errors");
        var user = new User(req.body.username, req.body.password, req.body.firstname, req.body.lastname, req.body._emailAddress,
            req.body.address1, req.body.address2, req.body.city, req.body.state, req.body.zipcode, req.body.country);
        await UserDB.addUser(UserModel, user);
        res.render('login', {msg: "You successfully registered yourself. Please login.", error: []});
    }
});


router.post('/login', urlencodedparser, [
    check('username').isLength({min: 8}).withMessage('Must be at least 8 characters long')
        .matches(/^[a-zA-Z0-9]+$/).withMessage("You can use characters in uppercase/lowercase and numbers."),
    check('password').isLength({min: 8}).withMessage('Must be at least 8 characters long')
        .isLength({max: 15}).withMessage('length should not be more than 15 characters.')
        .matches(/^(?=.*[A-Z])(?=.+[a-z])(?=.+\d)(?=.+[$!()@&]).{8,15}$/).withMessage('Password should contains atleast 1 Uppercase, 1 lowercase, 1 number, 1 special character.'),
], async function (req, res) {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.render('login', {msg: "", error: errors.array()});
    } else {

        if (req.body.username != null && req.body.password != null) {

            let username = req.body.username;
            let password = req.body.password;

            let validUser = await UserDB.validateUser(UserModel, username, password);

            if (validUser) {

                req.session.theUser = await UserDB.getUser(UserModel, username);
                req.session.userProfile = await UserDB.getUserItemsFromDB(username, ItemModel, UserItemModel);

                res.render('myItems', {msg: "", items: req.session.userProfile, user: req.session.theUser, error: []});

            } else {
                res.render('login', {msg: "Either username or password are incorrect. Please try again.", error: []})
            }

        } else {
            res.render('login', {msg: "", error: []});
        }
    }
});


//this route will be executed when user clicks on MyItems button
router.get('/myitems', function (req, res) {
    if (req.session.theUser) {
        res.render('myItems', {msg: "", items: req.session.userProfile, user: req.session.theUser, error: []});
    } else {
        res.render('error');
    }

});

//this route will be executed when user clicks on MyItems button
router.get('/mycreated', async function (req, res) {
    if (req.session.theUser) {
        let userId = req.session.theUser._UserId;
        let itemsList = await UserDB.getItemsCreatedByUser(userId,ItemModel);
        res.render('createdItems', {msg: "", items: itemsList, user: req.session.theUser, error: []});
    } else {
        res.render('error');
    }

});

//this route will be executed when user clicks on Sign-Out button
router.get('/signout', function (req, res) {
    req.session.destroy(function (err) {
        if (err) {
            res.negotiate(err);
        }
        res.redirect('/index');
    });
});

router.post('/updateProfile',urlencodedparser, async function (req, res) {

    if (req.session.theUser) {
        let reqItemCode = req.body.itemCode;
        let userId = req.session.theUser._UserId;
        //let userItemList = req.session.userProfile;
        let itemsList = await UserDB.getItemsCreatedByUser(userId, ItemModel);

        //to check action is not null
        if (req.body.action != null) {
            let action = req.body.action;
            let itemIncluded = false;
            let itemInAction = null;
            if (typeof (req.body.itemList) === 'undefined' || !req.body.itemList.includes(reqItemCode)) {
                res.render('createdItems', {
                    msg: "You can't perform this action.",
                    items: itemsList,
                    user: req.session.theUser, error: []
                });
            } else {
                //to check if requested itemCode is already in UserProfile
                for (let x = 0; x < itemsList.length; x++) {
                    if (itemsList[x]._itemCode === reqItemCode) {
                        itemIncluded = true;
                        itemInAction = itemsList[x];
                    }
                }
                console.log(JSON.stringify(itemInAction));

                if (action === 'update') {
                    if (itemIncluded) {
                        res.render('updateItem', {
                            item: itemInAction,
                            user: req.session.theUser
                        });
                    } else {
                        res.render('createdItems', {
                            msg: "You can't perform this action.",
                            items: itemsList,
                            user: req.session.theUser,
                            error: []
                        });
                    }

                } else if (action === 'delete') {
                    if (itemIncluded) {
                        UserItemDB.removeItem(UserItemModel, reqItemCode);
                        req.session.userProfile = await UserDB.getUserItemsFromDB(userId, ItemModel, UserItemModel);
                        res.render('myItems', {
                            msg: "",
                            items: req.session.userProfile,
                            user: req.session.theUser,
                            error: []
                        });
                    } else {
                        res.render('createdItems', {
                            msg: "You can't perform this action.",
                            items: itemsList,
                            user: req.session.theUser,
                            error: []
                        });
                    }
                } else {
                    res.render('createdItems', {
                        msg: "You can't perform this action.",
                        items: itemsList,
                        user: req.session.theUser,
                        error: []
                    });
                }
            }
        } else {
            res.render('createdItems', {
                msg: "You can't perform this action.",
                items: itemsList,
                user: req.session.theUser,
                error: []
            });
        }

    } else {
        res.render('error');
    }


});

//this route will be executed for profile functionality
router.post('/', urlencodedparser, [
    check('itemCode').matches(/^(CA|DO|CC|BW|CO|BR|CH)\d+$/).withMessage("Must be Alphanumeric")
        .isLength({min: 3}).withMessage('Item Code must be at least 3 characters long.')
        .custom(value => {
            return ItemDB.getItem(value, ItemModel).then(item => {
                if (!item) {
                    return Promise.reject('Item Code is  not valid.');
                }
            });
        }).withMessage("Item Code is not valid"),
    check('action').isIn(['save', 'updateProfile', 'updateRating', 'updateFlag', 'deleteItem', 'rateIt']).withMessage("Invalid Action."),
    check('rating').optional().isInt({min: 0, max: 5}).withMessage("Invalid rating."),
    check('madeItFlag').optional().isBoolean().withMessage("Invalid made It flag value.")
], async function (req, res) {

    let userItemList = req.session.userProfile;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.render('myItems', {msg: "", items: userItemList, user: req.session.theUser, error: errors.array()});
    } else {

        if (req.session.theUser) {
            let reqItemCode = req.body.itemCode;
            let userId = req.session.theUser._UserId;
            let userItemList = req.session.userProfile;

            //to check action is not null
            if (req.body.action != null) {
                let action = req.body.action;
                let itemIncluded = false;
                let itemInAction = null;
                let userItemInAction = null;
                if (typeof (req.body.itemList) === 'undefined' || !req.body.itemList.includes(reqItemCode)) {
                    res.render('myItems', {
                        msg: "You can't perform this action.",
                        items: userItemList,
                        user: req.session.theUser, error: []
                    });
                } else {
                    //to check if requested itemCode is already in UserProfile
                    for (let x = 0; x < userItemList.length; x++) {
                        if (userItemList[x]._Item._itemCode === reqItemCode) {
                            itemIncluded = true;
                            itemInAction = new Item(userItemList[x]._Item._itemCode, userItemList[x]._Item._itemName,
                                userItemList[x]._Item._itemCategory, userItemList[x]._Item._itemDescription, userItemList[x]._Item._itemIngredients,
                                userItemList[x]._Item._itemRecipe, userItemList[x]._Item._itemRating, userItemList[x]._Item._itemImageURL);
                            userItemInAction = userItemList[x];
                        }
                    }

                    if (action === 'save') {
                        if (req.body.itemList === reqItemCode) {
                            if (itemIncluded) {
                                res.render('myItems', {
                                    msg: "** This item is already saved in your profile. **",
                                    items: userItemList,
                                    user: req.session.theUser, error: []
                                });
                            } else {
                                let itemToAdd = await ItemDB.getItem(reqItemCode, ItemModel);
                                await UserItemDB.addItem(UserItemModel, itemToAdd, 0, false, userId);
                                req.session.userProfile = await UserDB.getUserItemsFromDB(userId, ItemModel, UserItemModel);
                                res.render('myItems', {
                                    msg: "Item Added to your profile successfully.",
                                    items: req.session.userProfile,
                                    user: req.session.theUser, error: []
                                });
                            }
                        } else {
                            res.render('myItems', {
                                msg: "You can't perform this action.",
                                items: userItemList,
                                user: req.session.theUser, error: []
                            });
                        }

                    } else if (action === 'updateProfile') {
                        if (itemIncluded) {
                            res.render('feedback', {
                                theItem: itemInAction,
                                userItem: userItemInAction,
                                user: req.session.theUser
                            });
                        } else {
                            res.render('myItems', {
                                msg: "You can't perform this action.",
                                items: userItemList,
                                user: req.session.theUser,
                                error: []
                            })
                        }

                    } else if (action === 'updateRating') {
                        if (req.body.itemList === reqItemCode) {
                            let reqRating = req.body.rating;
                            if (reqRating <= 5 || reqRating >= 0 || (reqRating % 1 === 0)) {
                                let actualRating = userItemInAction._rating;
                                if (reqRating !== actualRating) {
                                    await UserItemDB.updateItem(UserItemModel, userId, reqItemCode, reqRating, 'Rating');
                                }
                                req.session.userProfile = await UserDB.getUserItemsFromDB(userId, ItemModel, UserItemModel);
                                res.render('myItems', {
                                    msg: "",
                                    items: req.session.userProfile,
                                    user: req.session.theUser, error: []
                                });
                            } else {
                                res.render('myItems', {
                                    msg: "",
                                    items: userItemList,
                                    user: req.session.theUser,
                                    error: []
                                });
                            }
                        } else {
                            res.render('myItems', {
                                msg: "You can't perform this action.",
                                items: userItemList,
                                user: req.session.theUser, error: []
                            });
                        }
                    } else if (action === 'updateFlag') {
                        if (req.body.itemList === reqItemCode) {
                            let reqFlag = req.body.madeItFlag === 'true';
                            if (reqFlag === true || reqFlag === false) {
                                let actualFlag = userItemInAction._madeIt;
                                if (reqFlag !== actualFlag) {
                                    await UserItemDB.updateItem(UserItemModel, userId, reqItemCode, reqFlag, 'MadeIt');
                                }
                                req.session.userProfile = await UserDB.getUserItemsFromDB(userId, ItemModel, UserItemModel);
                                res.render('myItems', {
                                    msg: "",
                                    items: req.session.userProfile,
                                    user: req.session.theUser, error: []
                                });
                            } else {
                                res.render('myItems', {
                                    msg: "",
                                    items: userItemList,
                                    user: req.session.theUser,
                                    error: []
                                });
                            }
                        } else {
                            res.render('myItems', {
                                msg: "You can't perform this action.",
                                items: userItemList,
                                user: req.session.theUser, error: []
                            });
                        }

                    } else if (action === 'deleteItem') {
                        if (itemIncluded) {
                            UserItemDB.removeItem(UserItemModel, reqItemCode);
                            req.session.userProfile = await UserDB.getUserItemsFromDB(userId, ItemModel, UserItemModel);
                            res.render('myItems', {
                                msg: "",
                                items: req.session.userProfile,
                                user: req.session.theUser,
                                error: []
                            });
                        } else {
                            res.render('myItems', {
                                msg: "You can't perform this action.",
                                items: userItemList,
                                user: req.session.theUser, error: []
                            });
                        }
                    } else if (action === 'rateIt') {
                        if (itemIncluded) {
                            res.render('feedback', {
                                theItem: itemInAction,
                                userItem: userItemInAction,
                                user: req.session.theUser
                            });
                        } else {
                            res.render('myItems', {
                                msg: "Sorry...You can not rate this item. Please save the item first to rate it.",
                                items: userItemList,
                                user: req.session.theUser, error: []
                            });
                        }

                    } else {
                        res.render('myItems', {msg: "", items: userItemList, user: req.session.theUser, error: []});
                    }
                }
            } else {
                res.render('myItems', {msg: "", items: userItemList, user: req.session.theUser, error: []});
            }

        } else {
            res.render('error');
        }
    }
});

router.post('/deleteAll', urlencodedparser, async function (req, res) {

    if (req.session.theUser) {
        let userId = req.session.theUser._UserId;
        let userItemList = req.session.userProfile;

        if (req.body.action != null && req.body.action === 'deleteAll') {
            await UserItemDB.emptyProfile(UserItemModel);
            req.session.userProfile = await UserDB.getUserItemsFromDB(userId, ItemModel, UserItemModel);
            res.render('myItems', {msg: "", items: req.session.userProfile, user: req.session.theUser, error: []});
        } else {
            res.render('myItems', {msg: "", items: userItemList, user: req.session.theUser, error: []});
        }
    } else {
        res.render('error');
    }

});

module.exports = router;