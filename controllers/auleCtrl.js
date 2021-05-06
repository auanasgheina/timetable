'use strict';

const Joi = require('joi');

const {Aula, schemaAula} = require('../models/aula');

const getAula = async (req) => {
        const aulaAcr = req.params.aula;
        const db = req.app.locals.db;
        const project = req.params.project;
        const col = db.collection(project);
        const query = { 'aula.acr' : aulaAcr };
        const result = await col.findOne(query);
        if (!result) {
            return
          }else{
            const aulaObj = new Aula(result.aula.acr, 
                result.aula.colore)
            return aulaObj;
          }       
}

const getDistinctAule = async (req) => {
        const db = req.app.locals.db;
        const project = req.params.project;
        const col = db.collection(project);
        const fieldName = "aula"
        const distinctAule = await col.distinct(fieldName);
        const auleArray = [];
        if ((distinctAule.length) === 0) {
            return auleArray;
          }else{
              await distinctAule.forEach(doc => {
                const aulaObj = new Aula(
                    doc.acr,
                    doc.colore
                );
                auleArray.push(aulaObj);
              });
              return auleArray; 
            }  
}

const deleteAula = async (req) => {
        const aula = req.params.aula;
        const db = req.app.locals.db;
        const project = req.params.project;
        const col = db.collection(project);
        let filter = { "aula.acr" : aula };
        const lezioni = new Boolean(req.query.l);
        if (!lezioni.valueOf()) {
            const result = await col.deleteMany(filter);
            return result;
        } else {
            const updateLez = { $set:
                {
                  "aula.acr": undefined,
                  "aula.colore": "transparent"
                }
             }
             const result = await col.updateMany(filter, updateLez);
             return result;
        }
}

const updateAula = async (req, res, next) => {
        const aula = req.params.aula;
        const db = req.app.locals.db;
        const project = req.params.project;
        const col = db.collection(project);
        const filter = { "aula.acr" : aula };
        const set = req.body;
        const valid = await schemaAula.validateAsync(set);
        const updateLez = { $set:
            {
              "aula.acr": set.acr,
              "aula.colore": set.colore
            }
         }
        const result = await col.updateMany(filter, updateLez);
        return result;
}

module.exports = {
    getAula,
    getDistinctAule,
    deleteAula,
    updateAula
}