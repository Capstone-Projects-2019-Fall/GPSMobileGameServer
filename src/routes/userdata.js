const express = require('express');
const bodyParser = require('body-parser');

module.exports = function(mongoose) {
    const {User} = require('../schemas/user')(mongoose);

    let userdata = express.Router();

    userdata.use(bodyParser.urlencoded({extended: false}));
    userdata.use(bodyParser.json());

    userdata.get('/:name', (req, res) => {
        const username = req.params.name;

        User.findOne({
            name: username
        }, (err, result) => {
            if (err){
                console.log(err);
                res.status(500).send(err);
            }
            else if(result === null){
                res.status(404).send('No matching user found.');
            }
            else{
                res.json(result);
            }
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

        res.send(newUser);
    });

    userdata.post('/deck', (req, res) => {

        User.findOne({name: req.body.name},(err, reqUser) => {
            if (err){
                console.log(err);
                res.status(500).send(err);
            }
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

    /**
     * Gets "name"'s deck. Returns an array of integers.
     */
    userdata.get('/:name/deck', (req, res) => {
        const username = req.params.name;
        User.findOne({
            name: username
        }, (err, result) => {
            if (err){
                console.log(err);
                res.status(500).send(err);
            }
            else if(result === null){
                res.status(404).send('No matching player found.');
            }
            else{
                const deck = result.toObject().collection.filter(card => card.inDeck);
                res.json(deck);
            }
        });
    });

    /**
     * Updates "name"'s deck. Returns 200 OK status.
     */
    userdata.post('/:name/deck', (req, res) => {
        const username = req.params.name;

        User.findOne({
            name: username
        }, (err, result) => {
            if (err){
                console.log(err);
                res.status(500).send(err);
            }
            else if(result === null){
                res.status(404).send('No matching player found.');
            }
            else{
                result.deck = req.body.deck;
                result.save();
                res.sendStatus(200);
            }            
        });
    });

    userdata.get('/:name/collection', (req, res) => {
        const username = req.params.name;

        User.findOne({
            name: username
        }, (err, result) => {
            if (err){
                console.log(err);
                res.status(500).send(err);
            }
            else if(result === null){
                res.status(404).send('No matching player found.');
            }
            else{
                const collection = result.toObject().collection;
                res.json(collection);
            }
        });
    });

    return userdata;
};
