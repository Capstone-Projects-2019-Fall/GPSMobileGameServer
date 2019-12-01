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
            if (err){
                console.log(err);
                res.status(500).send(err);
            }
            else{
                res.json(result);
            }
        });
    });

    geodata.get('/findbystructure/:structure', (req,res) => {
        const struct = req.params.structure || 'Friendly';
        Node.find({
            structure: struct
        }, (err, result) => {
            if (err){
                console.log(err);
                res.status(500).send(err);
            }
            else{
                res.json(result);
            }
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

    //Update a node by node name
    geodata.post('/update/:nodename', (req,res) => {
        const nodename = req.params.nodename;

        Node.findOne({name: nodename},(err, reqNode) => {
            if (err){
                console.log(err);
                res.status(500).send(err);
            }
            else if(reqNode === null){
                res.status(404).send('No matching node found.');
            }
            else{
                reqNode.structure = req.body.structure;
                reqNode.save();
                res.json(reqNode);
            }
        });
    });

    //Reset all nodes to friendly state
    geodata.get('/resetnodes', (req,res) => {
        Node.find({},(err, result) => {
            if (err){
                console.log(err);
                res.status(500).send(err);
            }
            else{
                for (const node in result){
                    result[node].structure = 'Friendly';
                    result[node].save();
                }
                res.send('Nodes reset success');
            }            
        });
    });
    return geodata;
};
