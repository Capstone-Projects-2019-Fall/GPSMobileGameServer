const express = require('express');
const app = express();

//This works when in heroku
const mongo_uri = process.env.MONGODB_URI;
const port = process.env.PORT | 3000;

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

app.use('/geodata', geodata);
app.use('/user', userdata);
app.use('/enemy', enemy);

app.listen(port, () => console.log(`Server started on port ${port}`));
