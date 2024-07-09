//npm init
//npm i express
//npm i axios

const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const local_token = "10071997";

const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

const axios = require("axios").default;

app.get('/', (req, res) => {
    console.log(req.query);
    const challenge = req.query["hub.challenge"];
    const token = req.query["hub.verify_token"];
    console.log(token, local_token);
    if (local_token == token){
        res.send(challenge)
    } else {
        res.send("failed")
    }
})

app.post('/', (req, res) => {
    const body = req.body;
    body.entry.forEach(entry => {
        if(entry["messaging"]){
            entry.messaging.forEach(messaging => {
                respond(messaging.sender, messaging.message.text);
            });
        }
    });
    res.send("passed")
})

function respond(sender,text){
    console.log(sender, text);

    const page_id = 307935712412698;
    const page_access_token = "EAA1ruLjZCcKMBOZCaERphIO6eGgVZAZCpSMGpOxiu10BORQhg9hGkWFRwr63oT34EWZCNk2fZALJovdEPvsXhSFZAm5c1H5SBZATMTziunkoBA76DFchHulidZCBgP1irHfZC24EODjHgMZC7OffAdFXfNalSYK4PO3NbKdoDlMNJcHN7sM1PuSIGx30o4qtw7dk0rWnQZDZD";
    const url = `https://graph.facebook.com/v20.0/${page_id}/messages`;

    var message = {
        "recipient": sender,
        "messaging_type": "RESPONSE",
        "message": {"text": text + " " +"by the echo bot."},
        "access_token": `${page_access_token}`
    }

    axios.post(url, message).then((response)=>{
        console.log("responded");
    });
}

app.listen(port, () => {
  console.log(`App is running on port ${port}`)
})

