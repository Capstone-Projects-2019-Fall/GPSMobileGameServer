const express = require('express');
const app = express();
const port = process.env.PORT;

const mongoose = require('mongoose');
mongoose.connect(process.env.MONGOOSE_URL, {useNewUrlParser: true});

const geodata = require('./routes/geodata')(mongoose);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    // we're connected!
});

app.get('/', (req, res) => res.send('Hello World!'));

app.use('/geodata', geodata);

app.listen(port, () => console.log(`Server started on port ${port}`));
