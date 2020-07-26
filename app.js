require('dotenv').config();

const express = require('express');
const bp = require('body-parser');
app = express();
const https = require('https');


PORT = typeof(process.env.PORT) === 'undefined' ? 3000 : process.env.PORT;

app.use(bp.urlencoded({extended: true}));
app.use('/public', express.static(__dirname + '/public'));

const apikey = process.env.API_KEY;

const cams = ['FHAZ', 'RHAZ', 'MAST', 'CHEMCAM', 'MAHLI', 'MARDI', 'NAVCAM',
'PANCAM', 'MINITES', 'None'];
const rovers = ['Curiosity', 'Opportunity', 'Spirit'];

function get_img(cam='None', res=res, rover='curiosity', sol=1000, req) {
    
}

app.get('/', (req, res) => {
    res.render(__dirname + '/views/index.ejs', {cams: cams, rovers: rovers});
});

app.post('/', (req, res, next) => {

    
    const cam = req.body.cams;
    const rover = req.body.rover;
    const sol = req.body.sol;

    var link = 'https://api.nasa.gov/mars-photos/api/v1/rovers/' 
    + rover + '/photos?' + 'api_key=' + apikey;

    if (cam === 'None') {
        link = link + '&sol=' + sol;
    } else {
        link = link + '&camera=' + cam + '&sol=' + sol;
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
                    const error = err;
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