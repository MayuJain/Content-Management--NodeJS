//function to add item to user profile
module.exports.addItem=function(userItemModel, item, rating, madeIt,userId) {

    return new Promise((resolve, reject) => {
        userItemModel.create({UserId:userId,itemCode:item._itemCode,rating:rating,madeIt:madeIt}).then(function () {
            resolve()
        }).catch(err => { return reject(err); })

    });
};

//function to remove item from user profile
module.exports.removeItem=function(userItemModel, itemID) {

    userItemModel.deleteOne({itemCode:itemID},function (err, data) {
        if(err){
            throw err;
        }
        console.log('deleted');
    })
};

//function to update item in user profile
module.exports.updateItem=function(UserItemModel,userId, itemId, requestedValue, flag) {

    if (flag === 'Rating') {

        return new Promise((resolve, reject) => {
            UserItemModel.findOneAndUpdate({ $and: [{ UserId: userId }, { itemCode: itemId }] },
                { $set: { rating: requestedValue} }
                , function (err, data) {
                    resolve(data);
                }).catch(err => { return reject(err); });
        })

    } else {

        return new Promise((resolve, reject) => {
            UserItemModel.findOneAndUpdate({ $and: [{ UserId: userId }, { itemCode: itemId }] },
                { $set: { madeIt: requestedValue} }
                , function (err, data) {
                    resolve(data);
                }).catch(err => { return reject(err); });
        });
    }


};

//remove all user items from user profile
module.exports.emptyProfile=function(userItemModel) {

    return new Promise((resolve, reject) => {
        userItemModel.find().deleteMany().exec().then(function () {
            resolve()
        }).catch(err => { return reject(err); })

    });
};