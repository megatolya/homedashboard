const express = require('express')
const app = express()
const request = require('request');
const cheerio = require('cheerio');
const morgan = require('morgan');


app.use(morgan('tiny'));

app.get('/', (req, res) => {
    res.sendFile('./index.html', {root: __dirname});
});

app.get('/client.js', (req, res) => {
    res.sendFile('./client.js', {root: __dirname});
});


const UPDATE_DATA_TIMEOUT = 20000;

let trafficReady = false;
let weatherReady = false;
let trafficCurrentValue;
let weatherCurrentValue;

app.get('/traffic', (req, res) => {
    if (!trafficReady) {
        res.json({error: 'Traffic not ready'});
    }

    res.json({traffic: trafficCurrentValue});
});

app.get('/weather', (req, res) => {
    if (!weatherReady) {
        res.json({error: 'Weather not ready'});
    }
    res.json({weather: weatherCurrentValue});
});

app.listen(3000);

function updateData() {
    const url = 'https://yandex.ru/';
    request(url, function(err, resp, body){
        $ = cheerio.load(body);
        trafficCurrentValue = $('.traffic__rate-text').text();
        weatherCurrentValue = $('.weather__temp').text();
        trafficReady = true;
        weatherReady = true;
        console.log({trafficCurrentValue, weatherCurrentValue});
    });
}

setInterval(updateData, UPDATE_DATA_TIMEOUT);
updateData();
