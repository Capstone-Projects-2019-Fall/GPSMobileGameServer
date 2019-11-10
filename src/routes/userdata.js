const express = require('express');
const bodyParser = require('body-parser');

module.exports = function(mongoose) {
    const {User} = require('../schemas/user')(mongoose);

    let userdata = express.Router();

    userdata.use(bodyParser.urlencoded({extended: false}));
    userdata.use(bodyParser.json());

    userdata.get('/', (req, res) => {
        const username = req.query.name;

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

    userdata.post('/deck', (req, res) => {

        User.findOne({name: req.body.name},(err, reqUser) => {
            if(err)
                console.log(err);
            else{
                const targetcardIndex = reqUser.deck.findIndex((card) => {
                    return card.name === req.body.cardname;
                });
                if(req.body.isrefresh === 0)
                    reqUser.deck[targetcardIndex].pp -= 1;
                else
                //Right now cards just get refreshed to 20 pp
                    reqUser.deck[targetcardIndex].pp = 20;
                const returnPP = reqUser.deck[targetcardIndex].pp;
                reqUser.save();
                res.send(returnPP);
            }
        });
    });

    return userdata;
};