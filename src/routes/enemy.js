const express = require('express');
const bodyParser = require('body-parser');

module.exports = function(mongoose) {
    const {Enemy} = require('../schemas/enemy')(mongoose);

    let enemy = express.Router();

    enemy.use(bodyParser.urlencoded({extended: false}));
    enemy.use(bodyParser.json());

    /**
     * Gets a specified enemy. Returns an enemy object with nodename = ":nodename".
     * Returns 404 if the specified enemy does not exist.
     */
    enemy.get('/:nodename', (req, res) => {
        const nodename = req.params.nodename;

        Enemy.findOne({
            nodename: nodename
        }, (err, result) => {
            if (err)
                console.log(err);
            if(result === null){
                res.status(404).send('No matching enemy found.');
            }
            else{
                res.send(JSON.stringify(result));
            }
        });
    });

    enemy.delete('/:nodename', (req, res) => {
        const nodename = req.params.nodename;

        Enemy.deleteOne({
            nodename: nodename
        }, (err, result) => {
            if (err)
                console.log(err);
            else
                res.send('Enemy delete successful.')
            });
    })

    /**
     * Updates the state of an existing enemy. Returns an updated enemy object with nodename = ":nodename".
     * Returns 404 if the specified enemy does not exist.
     */
    enemy.post('/update/:nodename', (req, res) => {
        const nodename = req.params.nodename;

        Enemy.findOne({
            nodename: nodename
        }, (err, result) => {
            if (err)
                console.log(err);
            if(result === null){
                res.status(404).send('No matching enemy found.');
            }
            else{
                for(var property in req.body){
                    if(Object.prototype.hasOwnProperty.call(req.body, property))
                    {
                        result[property] = req.body[property];
                    }
                }
                result.save();
                res.send(JSON.stringify(result));
            }
        });
    });

    enemy.post('/', (req, res) => {

        const newEnemy = new Enemy({
            name: req.body.name,
            nodename: req.body.nodename,
            hp: req.body.hp,
            regenrate: req.body.regenrate,
            attacks: req.body.attacks
        });

        newEnemy.save();

        res.send('Done');
    });

    return enemy;
};
