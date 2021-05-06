'use strict';

const Joi = require('joi');

const {Anno, schemaAnno} = require('../models/anno');

const getAnno = async (req) => {
        const anno = req.params.anno;
        const db = req.app.locals.db;
        const project = req.params.project;
        const col = db.collection(project);
        const query = { annoAcr : anno };
        const result = await col.findOne(query);
        if (!result) {
            return
          }else{
            const annoAcr = new Anno(result.annoAcr)
            return annoAcr;
          }       
}

const getDistinctAnni = async (req) => {
        const db = req.app.locals.db;
        const project = req.params.project;
        const col = db.collection(project);
        const fieldName = "annoAcr";
        const distinctAnni = await col.distinct(fieldName);
        const anniArray = [];
        if ((distinctAnni.length) === 0) {
            return anniArray;
          }else{
              await distinctAnni.forEach(doc => {
                const annoObj = new Anno(
                    doc
                );
                console.log(annoObj);
                anniArray.push(annoObj);
              });
              return anniArray; 
            }
}

const deleteAnno = async (req) => {
        const anno = req.params.anno;
        const db = req.app.locals.db;
        const project = req.params.project;
        const col = db.collection(project);
        const query = { annoAcr : anno };
        const result = await col.deleteMany(query);
        return result;
}

const updateAnno = async (req) => {
        const anno = req.params.anno;
        const db = req.app.locals.db;
        const project = req.params.project;
        const col = db.collection(project);
        const filter = { annoAcr : anno };
        const set = req.body;
        const valid = await schemaAnno.validateAsync(set);
        const updateLez = { $set: { annoAcr: set.annoAcr } };
        const result = await col.updateMany(filter, updateLez);
        return result;
}

module.exports = {
    getAnno,
    getDistinctAnni,
    deleteAnno,
    updateAnno
}