'use strict';

const Joi = require('joi');

const {Vincolo, schemaVin} = require('../models/vincolo');
const { ObjectId } = require('mongodb');

const addVincolo = async (req) => {
        const vincolo = req.body;
        const valid = await schemaVin.validateAsync(vincolo);
        const db = req.app.locals.db;
        const project = req.params.project;
        const col = db.collection(project);
        const result = await col.bulkWrite([
            {insertOne: 
                {"document" : vincolo}
            },
            {updateMany:
                {
                    "filter" : { "tipo" : "lezione",
                                 "corsoAcr" : vincolo.corsoAcr,
                                 "giorno" : vincolo.giorno,
                                 "inizio" : { $lt : vincolo.fine },
                                 "fine" : { $gt : vincolo.inizio }
                               },
                    "update" : { $set : {"stato" : vincolo.stato } }
                }
            },
       ]);
       return result;
}

const getVincolo = async (req) => {
        const vincoloId = req.params._id;
        const db = req.app.locals.db;
        const project = req.params.project;
        const col = db.collection(project);
        const query = { _id : ObjectId(vincoloId) };
        const doc = await col.findOne(query);
        if (!doc) {
            return
          }else{
            const vincoloObj = new Vincolo(
                doc._id,
                doc.tipo,
                doc.stato,
                doc.corsoAcr,
                doc.giorno,
                doc.inizio,
                doc.fine,  
            );
            return (vincoloObj);
          }       
}

const deleteVincolo = async (req) => {
        const vincoloId = req.params._id;
        const db = req.app.locals.db;
        const project = req.params.project;
        const col = db.collection(project);
        const query = { _id : ObjectId(vincoloId) };
        const resultFind = await col.findOne(query);
        if (resultFind) {
            const resultBulk = await col.bulkWrite([
                {deleteOne: 
                    {
                        "filter" :  query
                    } 
                },
                {updateMany:
                    {
                        "filter" : { "tipo" : "lezione",
                                     "corsoAcr" : resultFind.corsoAcr,
                                     "giorno" : resultFind.giorno,
                                     "inizio" : { $lt : resultFind.fine },
                                     "fine" : { $gt : resultFind.inizio }
                                   },
                        "update" : { $set : {"stato" : "warning" } }
                    }
                },
           ]);
           return resultBulk;
          } else {
            return 
          }      
}

const getVincoliCorso = async (req) => {
        const corso = req.params.corso;
        const db = req.app.locals.db;
        const project = req.params.project;
        const col = db.collection(project);
        const query = { tipo : "vincolo",  corsoAcr : corso } ; 
        const cursor = await col.find(query);
        const vinArray = [];
        if ((await cursor.count()) === 0) {
            return(vinArray);
          }else{
              await cursor.forEach(doc => {
                const vincolo = new Vincolo(
                    doc._id,
                    doc.tipo,
                    doc.stato,
                    doc.corsoAcr,
                    doc.giorno,
                    doc.inizio,
                    doc.fine,  
                );
                vinArray.push(vincolo);
              });
              return(vinArray);
          }        
}

const updateVincolo = async (req) => {
        const vincoloId = req.params._id;
        const db = req.app.locals.db;
        const project = req.params.project;
        const col = db.collection(project);
        const query = { _id : ObjectId(vincoloId) };
        const replacement = req.body;
        const filter = { tipo : "lezione",
                         corsoAcr : replacement.corsoAcr,
                         giorno : replacement.giorno,
                         inizio : { $lt : replacement.fine },
                         fine : { $gt : replacement.inizio }
                        };
        const update = { $set : {stato : replacement.stato } };   
        const valid = await schemaVin.validateAsync(replacement);
        const resultFind = await col.findOne(query);
        if (resultFind){           
            const resultBulk = await col.bulkWrite([
                { replaceOne: { "filter": query, "replacement": replacement} },
                { updateMany: { "filter" : filter, "update" : update} }
        ]);
        return resultBulk
        } else {
            return
        }
}

module.exports = {
    addVincolo,
    getVincolo,
    deleteVincolo,
    getVincoliCorso,
    updateVincolo
}