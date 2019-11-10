const express = require('express');
const bodyParser = require('body-parser');

module.exports = function(User) {

    let userdeck = express.Router();

    userdeck.use(bodyParser.urlencoded({extended: false}));
    userdeck.use(bodyParser.json());




    return userdeck;
};
