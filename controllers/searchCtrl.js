'use strict';

const {Aula} = require('../models/aula');
var _ = require('lodash');
const Joi = require('joi');
const {schemaAulaSearch,
       schemaLezSearch,
       schemaVinSearch,
      schemaLezInAulaSearch} = require('../models/search');

const searchLezioni = async (req, pr, localsDb) => {
  const valid = await schemaLezSearch.validateAsync(req);
  const anno = req.annoAcr;
  const giorno = req.giorno;
  const inizio = req.inizio;
  const fine = req.fine;
  const query = { tipo : "lezione",
                  annoAcr : anno,
                  giorno : giorno,
                  inizio : { $lt : fine },
                  fine : { $gt : inizio } 
              };
  const options = { projection: {_id:1} };
  const db = localsDb;
  const project = pr;
  const col = db.collection(project);
  const result = await col.find(query, options);
  const lezioniInSlot = [];
    if ((await result.count()) > 0){
      await result.forEach(doc => {
      const lez = { _id : doc._id};
      lezioniInSlot.push(lez);
    });
}
  return lezioniInSlot;
}

const searchAuleDisp = async (req, pr, localsDb) => {
  const valid = await schemaAulaSearch.validateAsync(req);
  const giorno = req.giorno;
  const inizio = req.inizio;
  const fine = req.fine;
  const query = { tipo : "lezione",
                  giorno : giorno,
                  inizio : { $lt : fine },
                  fine : { $gt : inizio } 
              };
  const projecton = { _id: 1, aula : 1}
  const db = localsDb;
  const project = pr;
  const col = db.collection(project);
  const cursor = await col.find(query, projecton);
  const auleOccupate = [];
    if ((await cursor.count()) > 0) {
        await cursor.forEach(doc => {
            const aulaObj = new Aula(
                doc.aula.acr,
                doc.aula.colore
            );
            auleOccupate.push(aulaObj);
          });
      }
  const fieldName = "aula"
  const distinctAule = await col.distinct(fieldName);
  const aule = [];
    if ((distinctAule.length) > 0) {
          await distinctAule.forEach(doc => {
            const aulaObj = new Aula(
                doc.acr,
                doc.colore
            );
            aule.push(aulaObj);
          });
        }
  const auleDisp = _.differenceWith(aule, auleOccupate, _.isEqual)
  return auleDisp;     
}

const searchVincoli = async (req, pr, localsDb) => {
  const valid = await schemaVinSearch.validateAsync(req);
  const corso = req.corsoAcr;
  const giorno = req.giorno;
  const inizio = req.inizio;
  const fine = req.fine;
  const query = { tipo : "vincolo",
                  corsoAcr : corso,
                  giorno : giorno,
                  inizio : { $lt : fine },
                  fine : { $gt : inizio } 
              };
  const db = localsDb;
  const project = pr;
  const col = db.collection(project);
  const result = await col.findOne(query);
      if(result){
        const vincolo = { _id : result._id, stato : result.stato};
        return vincolo;
      }else{
        return({stato: "warning"});
      }       
}

const searchLezInAula = async (req, pr, localsDb) => {
  const valid = await schemaLezInAulaSearch.validateAsync(req);
  const aula = req.aula;
  const giorno = req.giorno;
  const inizio = req.inizio;
  const fine = req.fine;
  const query = { tipo : "lezione",
                  aula : aula,
                  giorno : giorno,
                  inizio : { $lt : fine },
                  fine : { $gt : inizio } 
              };
  const options = { projection: {_id:1} };
  const db = localsDb;
  const project = pr;
  const col = db.collection(project);
  const result = await col.find(query, options);
  const lezioniInAula = [];
    if ((await result.count()) > 0){
      await result.forEach(doc => {
      const lez = { _id : doc._id};
      lezioniInAula.push(lez);
    });
}
  return lezioniInAula;
}


module.exports = {
    searchLezioni,
    searchAuleDisp,
    searchVincoli,
    searchLezInAula
}