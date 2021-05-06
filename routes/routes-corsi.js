'use strict';

const express = require('express');
const { 
    getDistinctCorsi,
    deleteCorso,
    updateCorso,
    getCorso,
    } = require('../controllers/corsiCtrl');

const router = express.Router();

router.get('/:project/list/:anno', async (req,res)=>{
    try {
      const result = await getDistinctCorsi(req);
      res.send(result);
    } catch (error) {
        res.status(400).send('errore ' + error.message); 
    }  
});

router.delete('/:project/delete/:corso', async (req,res)=>{
    try {
      const result = await deleteCorso(req);
      const vincoli = new Boolean(req.query.v);
      const lezioni = new Boolean(req.query.l)
      if(vincoli.valueOf()){
        res.send(`${result.deletedCount} lezioni eliminate`);
      }
      if (lezioni.valueOf()) {
        res.send(`${result.deletedCount} vincoli eliminati, ${result.modifiedCount} lezioni modificate`);  
      } 
    } catch (error) {
        res.status(400).send('errore ' + error.message); 
    }  
});

router.get('/:project/:corso', async (req,res)=>{
    try {
      const result = await getCorso(req);
      if(result){
          res.send(result);
      } else{
        res.status(404).send("corso non trovato");
      }
    } catch (error) {
        res.status(400).send('errore ' + error.message); 
    }  
});

router.put('/:project/update/:corso', async (req,res)=>{
    try {
      const result = await updateCorso(req);
      res.send(`modificato ${req.params.corso} : ${result.modifiedCount} documenti modificati`);
    } catch (error) {
        res.status(400).send('errore ' + error.message); 
    }  
});

module.exports = {
    routes: router
}