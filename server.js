'use-strict'

const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const shops = require('./routes/shop');
const cofees = require('./routes/coffee');

const PORT = 3000 || 30001;

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use('/api', shops);
app.use('/api', cofees);

app.listen(PORT, () => {
	console.log(`http server listening on port ${PORT}`);
});

module.exports = app;
