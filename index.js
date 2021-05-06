'use strict';

const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const config = require('./config');

const fileRoutes = require('./routes/routes-file');
const lezioniRoutes = require('./routes/ruotes-lezioni');
const searchRoutes = require('./routes/routes-search');
const anniRoutes = require('./routes/routes-anni');
const corsiRoutes = require('./routes/routes-corsi');
const auleRoutes = require('./routes/routes-aule');
const vincoliRoutes = require('./routes/routes-vincoli');

const { MongoClient } = require('mongodb');
const { mongodbUri } = require('./config');

//init
const app = express();

//middleware logging
app.use(morgan('dev'));

//req.body -> formato JSON
app.use(express.json());

app.use(cors());

//caricare file statici in cartella public
//app.use(express.static('public'));
//redirect pagina iniziale
//app.get('/', (req, res) => res.redirect('/timetable.html'));

app.use('/', async (req, res, next) => {
    try {
        const client = new MongoClient(mongodbUri, {
        useNewUrlParser: true, 
        useUnifiedTopology: true,
    });
    await client.connect();
    const db = client.db("timetable");
    app.locals.db = db;
    next();
    } catch (error) {
      res.send('errore');  
    }
});

app.use('/file', fileRoutes.routes);
app.use('/lez', lezioniRoutes.routes);
app.use('/search', searchRoutes.routes);
app.use('/anni', anniRoutes.routes);
app.use('/corsi', corsiRoutes.routes);
app.use('/aule', auleRoutes.routes);
app.use('/vin', vincoliRoutes.routes);

app.listen(config.port, () => console.log(`app in ascolto a ${config.url}`));