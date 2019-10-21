const express = require('express');
const bodyParser = require('body-parser');

module.exports = function(mongoose) {
    const Node = require('../schemas/node')(mongoose);

    let geodata = express.Router();

    geodata.use(bodyParser.urlencoded({extended: false}));
    geodata.use(bodyParser.json());

    geodata.get('/', (req, res) => {
        let lat = req.query.lat;
        let long = req.query.long;

        const near = Node.Node.find({
            location: {
                $near: {
                    $maxDistance: 1000,
                    $geometry: {
                        type: "Point",
                        coordinates: [long, lat]
                    }
                }
            }
        }, (err, res) => {
            if (err)
                console.log(err)
            return res
        });
        console.log(near);
        res.send('Done');
    });

    geodata.post('/', (req, res) => {
        console.log(req.body);

        const newNode = new Node.Node({
            name: req.body.name,
            location: req.body.location
        });

        newNode.save();

        res.send('Done');
    });

    return geodata;
};
