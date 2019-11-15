const express = require('express');
const app = express();
const axios = require('axios');

//This works when in heroku
const mongo_uri = process.env.MONGODB_URI;
const port = process.env.PORT || 3000;

//Use this for local test
// const mongo_uri = 'mongodb://general_user:Welcome1!@ds237308.mlab.com:37308/heroku_0lr22jrr';

const mongoose = require('mongoose');
mongoose.connect(mongo_uri, {useNewUrlParser: true});

//Importing user module here for userdeck and userdata
const geodata = require('./routes/geodata')(mongoose);
const userdata = require('./routes/userdata')(mongoose);
const enemy = require('./routes/enemy')(mongoose);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    // we're connected!
});

app.get('/', (req, res) => res.send('Hello World!'));
//Interval for our enemy update
var nodeCheckInterval = false;
const intervalTime = 300000;
app.get('/startenemynode', (req,res) => {
    nodeCheckInterval = setInterval(() => {
        //Find all friendly nodes
        axios.get('/geodata/findbystructure/Friendly',{
            proxy:{
                port: port
            }
        })
        .then((response) => {
            for (const node in response.data){
                const currentnode = response.data[node];
                const turn_chance = 10;
                //Nodes have a 'turn_chance'% chance of turning into an enemy
                if((Math.floor(Math.random() * Math.floor(100))) <= turn_chance){
                    console.log('about to change node')
                    //Creating a new boss tied to the chosen node name
                    axios.post('/enemy',{
                        name: 'Boss' + currentnode.name,
                        nodename: currentnode.name,
                        hp: 100,
                        regenrate: 5,
                        attacks: ['punch','kick']
                    },{
                        proxy:{
                            port: port
                        }
                    })
                    .then((response) => {
                        //Update/flip the node structure to enemy
                        axios.post('/geodata/updatebyname',{
                            name: currentnode.name,
                            structure: 'Enemy'
                        },{
                            proxy:{
                                port: port
                            }
                        })
                        .then((response) => {
                            console.log('node changed');
                        })
                        .catch((err) => {
                            console.log(err);
                        });
                    })
                    .catch((err) => {
                        console.log(err);
                    });
                }
            }
        })
        .catch((error) => { 
            console.log(error);
            clearInterval(nodeCheckInterval);
        });
    },intervalTime);
    res.send("Looping interval");
});
//Stop the enemy turning interval if needed
app.get('/stopenemynode',(req,res) => {
    if(nodeCheckInterval){
        clearInterval(nodeCheckInterval);
        res.send('Interval stopped');
    }
    else
        res.send('Interval has not been initiated')
});

app.use('/geodata', geodata);
app.use('/user', userdata);
app.use('/enemy', enemy);

app.listen(port, () => console.log(`Server started on port ${port}`));
