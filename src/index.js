const express = require('express');
const app = express();

//This works when in heroku
const mongo_uri = process.env.MONGODB_URI;
const port = process.env.PORT;

//Use this for local test
// const port = 8080;
// const mongo_uri = 'mongodb://general_user:Welcome1!@ds237308.mlab.com:37308/heroku_0lr22jrr';

const mongoose = require('mongoose');
mongoose.connect(mongo_uri, {useNewUrlParser: true});

//Importing user module here for userdeck and userdata
const {User} = require('./schemas/user')(mongoose);

const geodata = require('./routes/geodata')(mongoose);
const userdeck = require('./routes/userdeck')(User);
const userdata = require('./routes/userdata')(User);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    // we're connected!
});

app.get('/', (req, res) => res.send('Hello World!'));

app.use('/geodata', geodata);
app.use('/userdeck',userdeck);
app.use('/userdata',userdata);

app.listen(port, () => console.log(`Server started on port ${port}`));
