require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
const path = require('path');

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/', express.static(path.join(__dirname, '../public')));

// your API calls
app.get('/rover-manifests/:roverName', async (req, res) => {
  try {
    const name = req.params['roverName'];
    const data = await fetch(
      `https://api.nasa.gov/mars-photos/api/v1/manifests/${name}?api_key=${process.env.API_KEY}`
    ).then((res) => res.json());
    res.send({ data });
  } catch (err) {
    console.log('error:', err);
  }
});

app.get('/rover/:roverName/:maxDate', async (req, res) => {
  try {
    const name = req.params['roverName'];
    const date = req.params['maxDate'];
    const data = await fetch(
      `https://api.nasa.gov/mars-photos/api/v1/rovers/${name}/photos?earth_date=${date}&api_key=${process.env.API_KEY}`
    ).then((res) => res.json());
    res.send({ data });
  } catch (err) {
    console.log('error:', err);
  }
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
