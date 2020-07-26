require('dotenv').config();

const express = require('express');
const bp = require('body-parser');
app = express();
const https = require('https');


PORT = typeof(process.env.PORT) === 'undefined' ? 3000 : process.env.PORT;

app.use(bp.urlencoded({extended: true}));
app.use('/public', express.static(__dirname + '/public'));


const cams = ['FHAZ', 'RHAZ', 'MAST', 'CHEMCAM', 'MAHLI', 'MARDI', 'NAVCAM',
'PANCAM', 'MINITES', 'None'];

const rovers = ['Curiosity', 'Opportunity', 'Spirit'];

app.get('/', (req, res) => {
    res.render(__dirname + '/views/index.ejs', {cams: cams, rovers: rovers});
});

app.post('/', (req, res, next) => {

    var link = 'https://api.nasa.gov/mars-photos/api/v1/rovers/' 
    + req.body.rover + '/photos?' + 'api_key=' + process.env.API_KEY;

    if (req.body.cams === 'None') {
        link = link + '&sol=' + req.body.sol;
    } else {
        link = link + '&camera=' + req.body.cams + '&sol=' + req.body.sol;
    }

    var data = '';

    https.get(link, (response) => {
        if (response.statusCode === 200) {
            response.on('data', function(dat) {
                try {
                    pics = (JSON.parse(dat).photos);
                    if (pics.length > 0) {
                        res.render(__dirname + '/views/img.ejs', {pics: pics});
                    } else {
                        const msg = 'No images found';
                        res.render(__dirname + '/views/message.ejs', {msg: msg});
                    }
                } catch(err) {
                    const msg = 'Could Not Fetch Images';
                    res.render(__dirname + '/views/message.ejs', {msg: msg});
                }
              });
        } else {
            const msg = 'Could Not Fetch Images';
            res.render(__dirname + '/views/message.ejs', {msg: msg});
        }
    });
});



app.listen(PORT, ()=>{console.log(`Listening on Port ${PORT}`)});