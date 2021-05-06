'use strict';

const express = require('express');
const { 
    getDistinctAnni,
    deleteAnno,
    updateAnno,
    getAnno,
    } = require('../controllers/anniCtrl');

const router = express.Router();

router.get('/:project/list', async (req,res)=>{
    try {
      const result = await getDistinctAnni(req);
      res.send(result);
    } catch (error) {
        res.status(400).send('errore ' + error.message); 
    }  
});

router.delete('/:project/delete/:anno', async (req,res)=>{
    try {
      const result = await deleteAnno(req);
      if(result){
          res.send(`eliminato ${req.params.anno} : ${result.deletedCount} lezioni eliminate`);
      } else{
        res.status(404).send("anno non trovato");
      }
    } catch (error) {
        res.status(400).send('errore ' + error.message); 
    }  
});

router.get('/:project/:anno', async (req,res)=>{
    try {
      const result = await getAnno(req);
      if(result){
          res.send(result);
      } else{
        res.status(404).send("anno non trovato");
      }
    } catch (error) {
        res.status(400).send('errore ' + error.message); 
    }  
});

router.put('/:project/update/:anno', async (req,res)=>{
    try {
      const result = await updateAnno(req);
      res.send(`modificato ${req.params.anno} : ${result.modifiedCount} lezioni modificate`);
    } catch (error) {
        res.status(400).send('errore ' + error.message); 
    }  
});


module.exports = {
    routes: router
}