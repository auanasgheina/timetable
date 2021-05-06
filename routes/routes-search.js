'use strict';

const express = require('express');
const {
    searchLezioni, 
    searchAuleDisp,
    searchVincoli
    } = require('../controllers/searchCtrl');

const router = express.Router();

router.post('/:project/lezionislot', async (req,res)=>{
    try {
      const result = await searchLezioni(req.body, req.params.project, req.app.locals.db);
      res.send(result);
    } catch (error) {
        res.status(400).send('errore ' + error.message); 
    }  
});

router.post('/:project/auledisp', async (req,res)=>{
    try {
      const result = await searchAuleDisp(req.body, req.params.project, req.app.locals.db);
      res.send(result);
    } catch (error) {
        res.status(400).send('errore ' + error.message); 
    }  
});

router.post('/:project/vincolislot', async (req,res)=>{
    try {
      const result = await searchVincoli(req.body, req.params.project, req.app.locals.db);
      res.send(result);
    } catch (error) {
        res.status(400).send('errore ' + error.message); 
    }  
});




module.exports = {
    routes: router
}