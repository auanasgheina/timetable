'use strict';

const Joi = require('joi');

const {Corso, schemaCorso} = require('../models/corso');

const getCorso = async (req) => {
        const corso = req.params.corso;
        const db = req.app.locals.db;
        const project = req.params.project;
        const col = db.collection(project);
        const query = { corsoAcr : corso };
        const result = await col.findOne(query);
        if (!result) {
            return
          }else{
            const corsoAcr = new Corso(result.corsoAcr)
            return corsoAcr;
          }       
}

const getDistinctCorsi = async (req) => {
        const db = req.app.locals.db;
        const project = req.params.project;
        const col = db.collection(project);
        const anno = req.params.anno;
        const fieldName = "corsoAcr";
        const query = { annoAcr : anno  };
        const distinctCorsi = await col.distinct(fieldName, query);
        const corsiArray = [];
        if ((distinctCorsi.length) === 0) {
            return corsiArray;
          }else{
              await distinctCorsi.forEach(doc => {
                const corsoObj = new Corso(
                    doc 
                );
                corsiArray.push(corsoObj);
              });
              return corsiArray; 
            }  
}

const deleteCorso = async (req) => {
        const corso = req.params.corso;
        const db = req.app.locals.db;
        const project = req.params.project;
        const col = db.collection(project);
        let query = { corsoAcr : corso };
        const vincoli = new Boolean(req.query.v);
        const lezioni = new Boolean(req.query.l)
        if (vincoli.valueOf()) {
            query.tipo = "lezione";
            const result = await col.deleteMany(query);
            return result;
        }
        if (lezioni.valueOf()) {
            query.tipo = "vincolo";
            const result = await col.bulkWrite([
                {deleteMany:
                    {
                        "filter" :  query
                    }  
                },
                {updateMany:
                    {
                        "filter" : { "tipo" : "lezione",
                                     "corsoAcr" : corso,
                                   },
                        "update" : { $set : {"stato" : "warning" } }
                    }
                },
           ]);
           return result;
        }       
}

const updateCorso = async (req, res, next) => {
        const corso = req.params.corso;
        const db = req.app.locals.db;
        const project = req.params.project;
        const col = db.collection(project);
        const filter = { corsoAcr : corso };
        const set = req.body;
        const valid = await schemaCorso.validateAsync(set);
        const updateLez = { $set: { corsoAcr: set.corsoAcr } };
        const result = await col.updateMany(filter, updateLez);
        return result
}

module.exports = {
    getCorso,
    getDistinctCorsi,
    deleteCorso,
    updateCorso
}