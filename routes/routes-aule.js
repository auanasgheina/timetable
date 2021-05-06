'use strict';

const express = require('express');
const { 
    getDistinctAule,
    deleteAula,
    updateAula,
    getAula,
    } = require('../controllers/auleCtrl');

const router = express.Router();

router.get('/:project/list', async (req,res)=>{
    try {
      const result = await getDistinctAule(req);
      res.send(result);
    } catch (error) {
        res.status(400).send('errore ' + error.message); 
    }  
});

// ?query.params l=true -> elimina lezioni 
router.delete('/:project/delete/:aula', async (req,res)=>{
    try {
      const result = await deleteAula(req);
      const lezioni = new Boolean(req.query.l);
        if (!lezioni.valueOf()) {
            res.send(`${result.deletedCount} lezioni eliminate`);
        }
        else {
           res.send(`${result.modifiedCount} lezioni modificate`); 
        }
    } catch (error) {
        res.status(400).send('errore ' + error.message); 
    }  
});


router.get('/:project/aula/:aula', async (req,res)=>{
    try {
      const result = await getAula(req);
      if(result){
          res.send(result);
      } else{
        res.status(404).send("aula non trovata");
      }
    } catch (error) {
        res.status(400).send('errore ' + error.message); 
    }  
});

router.put('/:project/update/:aula', async (req,res)=>{
    try {
      const result = await updateAula(req);
      res.send(`modificata ${req.params.aula} : ${result.modifiedCount} lezioni modificate`);
    } catch (error) {
        res.status(400).send('errore ' + error.message); 
    }  
});

module.exports = {
    routes: router
}