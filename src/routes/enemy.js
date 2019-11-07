const express = require('express');
const bodyParser = require('body-parser');

module.exports = function(mongoose) {
    const {Enemy} = require('../schemas/enemy')(mongoose);

    let enemy = express.Router();

    enemy.use(bodyParser.urlencoded({extended: false}));
    enemy.use(bodyParser.json());

    enemy.get('/', (req, res) => {
        const nodename = req.query.nodename;

        Enemy.find({
            nodename: nodename
        }, (err, result) => {
            if (err)
                console.log(err);
            res.send(JSON.stringify(result));
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
