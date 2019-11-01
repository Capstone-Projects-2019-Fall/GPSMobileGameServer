const express = require('express');
const bodyParser = require('body-parser');

module.exports = function(User) {

    let userdeck = express.Router();

    userdeck.use(bodyParser.urlencoded({extended: false}));
    userdeck.use(bodyParser.json());


    userdeck.post('/', (req, res) => {

        User.findOne({name: req.body.name},(err, reqUser) => {
            if(err)
                console.log(err);
            else{
                const targetcardIndex = reqUser.deck.findIndex((card) => {
                    if(card.name === req.body.cardname)
                        return true;
                    else 
                        return false;
                });
                if(req.body.isrefresh === 0)
                    reqUser.deck[targetcardIndex].pp -= 1;
                else
                //Right now cards just get refreshed to 20 pp
                    reqUser.deck[targetcardIndex].pp = 20;
                reqUser.save();
                res.send("Card updated");
            }
        });
    });

    return userdeck;
};
