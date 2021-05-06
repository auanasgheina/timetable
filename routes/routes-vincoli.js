'use strict';

const express = require('express');
const {
    addVincolo,
    getVincolo,
    deleteVincolo,
    getVincoliCorso,
    updateVincolo,
    } = require('../controllers/vincoliCtrl');

const router = express.Router();

router.post('/:project/add', async (req,res,next)=>{
    try {
        const result = await addVincolo(req);
        res.send(`${result.insertedCount} vincolo aggiunto: ${result.modifiedCount} lezioni modificate`);
      } catch (error) {
          res.status(400).send('errore ' + error.message); 
      }  
});

router.get('/:project/vincolo/:_id', async (req,res,next)=>{
    try {
        const result = await getVincolo(req);
        if(result){
            res.send(result);
        } else{
          res.status(404).send("vincolo non trovato");
        }
      } catch (error) {
          res.status(400).send('errore ' + error.message); 
      }    
});


router.delete('/:project/delete/:_id', async (req,res,next)=>{
    try {
        const result = await deleteVincolo(req);
        if(result){
            res.send(`${result.deletedCount} vincolo eliminato: ${result.modifiedCount} lezioni modificate`);
        } else{
          res.status(404).send("vincolo non trovato");
        }
      } catch (error) {
          res.status(400).send('errore ' + error.message); 
      }    
});

router.get('/:project/:corso', async (req,res,next)=>{
    try {
        const result = await getVincoliCorso(req);
        res.send(result);
      } catch (error) {
          res.status(400).send('errore ' + error.message); 
      }    
});

router.put('/:project/update/:_id', async (req,res,next)=>{
    try {
        const result = await updateVincolo(req);
        if(result){
            res.send(`vincolo modificato: ${result.modifiedCount-1} lezioni modificate`);
        } else {
            res.send("vincolo non trovato")
        }
      } catch (error) {
          res.status(400).send('errore ' + error.message); 
      }    
});



module.exports = {
    routes: router
}