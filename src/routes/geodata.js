const express = require('express');
const bodyParser = require('body-parser');

const Node = requre('../schemas/node');

let geodata = express.router();

geodata.use(bodyParser.urlencoded({extended: false}));
geodata.use(bodyParser.json());

geodata.get('/', (req, res) => {
    let lat = req.query.lat;
    let long = req.query.long;

    Node.findOne().near({center: [long, lat], maxDistance: 100});
});

module.exports = geodata;
