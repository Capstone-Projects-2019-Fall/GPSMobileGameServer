const express = require('express');
const bodyParser = require('body-parser');

module.exports = function(mongoose) {
    const {Node} = require('../schemas/node')(mongoose);

    let geodata = express.Router();

    geodata.use(bodyParser.urlencoded({extended: false}));
    geodata.use(bodyParser.json());

    geodata.get('/', (req, res) => {
        const lat = req.query.lat;
        const long = req.query.long;
        const maxDist = req.query.maxDist || 2000;

        Node.find({
            location: {
                $near: {
                    $maxDistance: maxDist,
                    $geometry: {
                        type: "Point",
                        coordinates: [long, lat]
                    }
                }
            }
        }, (err, result) => {
            if (err)
                console.log(err);
            res.send(JSON.stringify(result));
        });
    });

    geodata.post('/', (req, res) => {

        const newNode = new Node({
            name: req.body.name,
            location: {
                type: "Point",
                coordinates: [req.body.lon, req.body.lat]
            }
        });

        newNode.save();

        res.send('Done');
    });

    return geodata;
};
