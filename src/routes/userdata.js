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
        const newUser = new User({
            name: req.body.name,
            password: req.body.password,
            health: 100,
            gold: 0,
            library: req.body.library || {},
            homebase: {
                type: "Point",
                coordinates: [req.body.lon || 0, req.body.lat || 0]
            }
        });

        newUser.save();

        res.send(newUser);
    });

    userdata.post('/update/:name', (req, res) => {
        const username = req.params.name;
        User.findOne({name: username},(err, reqUser) => {
            if (err){
                console.log(err);
                res.status(500).send(err);
            }
            else if(reqUser === null){
                res.status(404).send('No matching user found.');
            }
            else{
                reqUser.health = req.body.health || reqUser.health;
                reqUser.gold = req.body.gold || reqUser.gold;
                reqUser.save();
                res.json(reqUser);
            }
        });
    });

    userdata.post('/:name/library', (req, res) => {
        const username = req.params.name;
        User.findOne({name: username},(err, reqUser) => {
            if (err){
                console.log(err);
                res.status(500).send(err);
            }
            else if(reqUser === null){
                res.status(404).send('No matching user found.');
            }
            else{
                reqUser.library = req.body;
                reqUser.save();
                res.json(reqUser.library);
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
                const deck = result.toObject().library.filter(card => card.inDeck === true);
                res.json(deck);
            }
        });
    });

    userdata.get('/:name/library', (req, res) => {
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
                const library = result.toObject().library;
                res.json(library);
            }
        });
    });

    /* set name's homebase coordinates*/
    userdata.post('/:name/homebase', (req, res) => {
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
                result.homebase.coordinates = [req.body.lon, req.body.lat];
                result.save();
                res.json(result);
            }
        });
    });

    return userdata;
};
