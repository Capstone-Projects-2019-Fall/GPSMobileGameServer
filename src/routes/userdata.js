const express = require('express');
const bodyParser = require('body-parser');

module.exports = function(User) {
    

    let userdata = express.Router();

    userdata.use(bodyParser.urlencoded({extended: false}));
    userdata.use(bodyParser.json());

    userdata.get('/', (req, res) => {
        const username = req.body.name;

        User.find({
            name: username
        }, (err, result) => {
            if (err)
                console.log(err);
            res.send(JSON.stringify(result));
        });
    });

    userdata.post('/', (req, res) => {
        const username = req.body.name;
        const newUser = new User({
            name: req.body.name,
            password: req.body.password,
            deck: []
        });

        newUser.save();

        res.send(username);
    });

    return userdata;
};
