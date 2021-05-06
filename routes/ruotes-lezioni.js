'use strict';

const express = require('express');
const {
    addLezione,
    getLezione,
    deleteLezione,
    getLezioniAnno,
    updateLezione,
    } = require('../controllers/lezioniCtrl');

const router = express.Router();

router.post('/:project/add', async (req,res,next)=>{
    try {
        const result = await addLezione(req);
        res.send(`${result.insertedCount} lezione aggiunta`);
      } catch (error) {
          res.status(400).send('errore ' + error.message); 
      }  
});

router.get('/:project/lezione/:_id', async (req,res)=>{
    try {
      const result = await getLezione(req);
      if(result){
          res.send(result);
      } else{
        res.status(404).send("lezione non trovata");
      }
    } catch (error) {
        res.status(400).send('errore ' + error.message); 
    }  
});

router.delete('/:project/delete/:_id', async (req,res)=>{
    try {
      const result = await deleteLezione(req);
      if(result){
          res.send("lezione eliminata");
      } else{
        res.status(404).send("lezione non trovata");
      }
    } catch (error) {
        res.status(400).send('errore ' + error.message); 
    }  
});

router.get('/:project/:anno', async (req,res)=>{
    try {
      const result = await getLezioniAnno(req);
      res.send(result);
    } catch (error) {
        res.status(400).send('errore ' + error.message); 
    }  
});

router.put('/:project/update/:_id', async (req,res)=>{
    try {
      const result = await updateLezione(req);
      if (result.modifiedCount === 0) {
        res.status(404).send("lezione non trovata");
      } else {
            if (result.modifiedCount === 1) {
            res.send("lezione modificata");
            }
        }
    } catch (error) {
        res.status(400).send('errore ' + error.message); 
    }  
});

module.exports = {
    routes: router
}