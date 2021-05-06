'use strict';

const Joi = require('joi');

const {Lezione, schemaLez} = require('../models/lezione');
const { ObjectId } = require('mongodb');

const addLezione = async (req) => {
       const lezione = req.body;
       const valid = await schemaLez.validateAsync(lezione);
       const db = req.app.locals.db;
       const project = req.params.project;
       const col = db.collection(project);
       const result = await col.insertOne(lezione);
       return result;
}

// const getLezione = async (req, res, next) => {
//     try {
//         const lezioneId = req.params._id;
//         const db = req.app.locals.db;
//         const project = req.params.project;
//         const col = db.collection(project);
//         const query = { _id : ObjectId(lezioneId) };
//         const doc = await col.findOne(query);
//         if (!doc) {
//             res.status(404).send("lezione non trovata");
//           }else{
//             const lezioneObj = new Lezione(
//                 doc._id,
//                 doc.tipo,
//                 doc.stato,
//                 doc.annoAcr,
//                 doc.aula,
//                 doc.corsoAcr,
//                 doc.giorno,
//                 doc.inizio,
//                 doc.fine,  
//             );
//             res.send(lezioneObj);
//           }       
//     } catch (error) {
//         res.status(400).send('errore ' + error.message); 
//     }
// }

const getLezione = async (req) => {
        const lezioneId = req.params._id;
        const db = req.app.locals.db;
        const project = req.params.project;
        const col = db.collection(project);
        const query = { _id : ObjectId(lezioneId) };
        const doc = await col.findOne(query);
        if (!doc) {
            return
          }else{
            const lezioneObj = new Lezione(
                doc._id,
                doc.tipo,
                doc.stato,
                doc.annoAcr,
                doc.aula,
                doc.corsoAcr,
                doc.giorno,
                doc.inizio,
                doc.fine,  
            );
            return lezioneObj;
          }       
}

const deleteLezione = async (req) => {
        const lezioneId = req.params._id;
        const db = req.app.locals.db;
        const project = req.params.project;
        const col = db.collection(project);
        const query = { _id : ObjectId(lezioneId) };
        const result = await col.deleteOne(query);
        if (result.deletedCount === 1) {
            return result;
          } else {
            return
          }      
    }

const getLezioniAnno = async (req) => {
        const anno = req.params.anno;
        const db = req.app.locals.db;
        const project = req.params.project;
        const col = db.collection(project);
        const query = { tipo : "lezione",  annoAcr : anno } ; 
        const cursor = await col.find(query);
        const lezArray = [];
        if ((await cursor.count()) === 0) {
            return (lezArray);
          }else{
              await cursor.forEach(doc => {
                const lezione = new Lezione(
                    doc._id,
                    doc.tipo,
                    doc.stato,
                    doc.annoAcr,
                    doc.aula,
                    doc.corsoAcr,
                    doc.giorno,
                    doc.inizio,
                    doc.fine,  
                );
                lezArray.push(lezione);
              });
              return (lezArray);
          }        
}

const updateLezione = async (req) => {
        const lezioneId = req.params._id;
        const db = req.app.locals.db;
        const project = req.params.project;
        const col = db.collection(project);
        const query = { _id : ObjectId(lezioneId) };
        const replacement = req.body;
        const valid = await schemaLez.validateAsync(replacement);
        const result = await col.replaceOne(query, replacement);
        return result;
}

module.exports = {
    addLezione,
    getLezione,
    deleteLezione,
    getLezioniAnno,
    updateLezione
}