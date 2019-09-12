const express = require('express');
const session = require('express-session');
var helmet = require('helmet');
const app = express();

app.use(helmet());
//app.disable('x-powered-by'), if helmet is not used this can be used to disable x-powered-by

app.set('view engine', 'ejs');

app.use('/assets', express.static('assets'));

app.use(session({secret: 'secretId'}));

app.get('/index', function (req, res) {
    res.render('index', {user: req.session.theUser});
});

app.get('/register', function (req, res) {
    res.render('registration',{msg:"",error:[]});
});

app.get('/addItem', function (req, res) {
    res.render('addItems',{msg:"",error:[]});
});

var profileRoutes = require('./routes/profileController.js');
app.use('/profile', profileRoutes);

var categoryRoutes = require('./routes/catalogController.js');
app.use('/categories', categoryRoutes);

app.get('/about', function (req, res) {
    res.render('about', {user: req.session.theUser});
});

app.get('/contact', function (req, res) {
    res.render('contact', {user: req.session.theUser});
});

app.get('/*', function (req, res) {
    res.render('index', {user: req.session.theUser});
});

app.listen(8080, function () {
    console.log('listening to port 8080');
});
