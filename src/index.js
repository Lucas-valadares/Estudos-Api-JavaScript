const express = require('express');
const bodyParser = require('body-parser');

const app = express();  // inicia a API

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

require('./app/controllers/index')(app);

app.listen(5000);