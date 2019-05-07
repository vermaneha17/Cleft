const express = require('express');
const _ = require('lodash');
const createError = require('http-errors');

const {mongoose} = require('./db/mongoose');
const {User} = require('./model/user');
const responseHandler = require('./middleware/responseHandler');
const {authenticate} = require('./middleware/authenticate');

var port = process.env.PORT || 3000;
var app = express();
app.use(express.json());

//response handler
app.use(responseHandler);

app.get('/', (req, res) => {
    res.send('Welcome to cleft');
});

//create user
app.post('/users', (req, res) => {
    var body = _.pick(req.body, ['email','password','role']);
    var user =  new User(body);

    user.save().then(() => {
        //res.json(res.responseHandler(doc));
        return user.generateAuthToken();
    }).then((data) => {
        res.json(res.responseHandler(data));
    }).catch((err) => {
        res.status(400).send(err).end();
    });
});

//login




app.listen(port, () => {
    console.log('Server is up on port:', port);
});