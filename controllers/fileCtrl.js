'use strict'

const formidable = require('formidable');
const path = require('path');
var fs = require('fs');
const {schemaVin} = require('../models/vincolo');
const {schemaLez} = require('../models/lezione');
const { searchLezioni, 
        searchAuleDisp, 
        searchVincoli, 
        searchLezInAula } = require('./searchCtrl');

const uploadFile = (req,res,next) => {
  const form = formidable.IncomingForm();
  form.parse(req, (err, fields, files) => {
    req._path = files.fileInput.path;
    next();
  });
}

const readFile = (req,res,next) => {
  fs.readFile(req._path, 'utf8', (err, data)=>{
        req._doc = JSON.parse(data);
        next(); 
  });
}

const insertInDb = async (req,res,next) => {
  const replace = new Boolean(req.query.r);
  const doc = req._doc;
  const db = req.app.locals.db;
  const project = req.params.project;
  const col = db.collection(project);
  const nDocInCol = await col.estimatedDocumentCount();
    if (nDocInCol === 0){
      const insert = await col.insertMany(doc);
    } else {
      var bulk = col.initializeOrderedBulkOp();
      if (replace){
        doc.forEach( async el => {
          if (el.tipo === 'lezione'){
            const resultSrcLez = await searchLezioni({'annoAcr': el.annoAcr,
                                                      'giorno': el.giorno,
                                                      'inizio':el.inizio,
                                                      'fine': el.fine}, 
                                                      project, 
                                                      db);
            if (resultSrcLez.length > 0){
              const resultSrcAula = await searchAuleDisp({'giorno': el.giorno,
                                                          'inizio':el.inizio,
                                                          'fine': el.fine}, 
                                                          project, 
                                                          db);
              if (resultSrcAula.some(a => a.acr === el.aula.acr)){
              bulk.find( {$and: [{resultSrcLez}]} ).remove();
                const resultSrcVin = await searchVincoli({'corsoAcr': el.annoAcr,
                                                          'giorno': el.giorno,
                                                          'inizio':el.inizio,
                                                          'fine': el.fine}, 
                                                          project, 
                                                          db);
                  el.stato = resultSrcVin.stato
                  bulk.insert(el); 
              } else {
                const resultsearchLezInAula = await searchLezInAula({'aula': el.aula,
                                                                      'giorno': el.giorno,
                                                                      'inizio':el.inizio,
                                                                      'fine': el.fine}, 
                                                                      project, 
                                                                      db);
                  bulk.find( {$and: [{resultsearchLezInAula}]} ).remove();
                  bulk.insert(el);
              }
            } else {
              const resultSrcAula = await searchAuleDisp({'giorno': el.giorno,
                                                          'inizio':el.inizio,
                                                          'fine': el.fine}, 
                                                          project, 
                                                          db);
              if (resultSrcAula.some(a => a.acr === el.aula.acr)){
                bulk.insert(el);
              } else {
                const resultsearchLezInAula = await searchLezInAula({'aula': el.aula,
                                                                      'giorno': el.giorno,
                                                                      'inizio':el.inizio,
                                                                      'fine': el.fine}, 
                                                                      project, 
                                                                      db);
                  bulk.find( {$and: [{resultsearchLezInAula}]} ).remove();
                  bulk.insert(el);
              }                                         
            }         
          }
          if (el.tipo === 'vincolo'){
            const resultSrcVin = await searchVincoli({'corsoAcr': el.corsoAcr,
                                                      'giorno': el.giorno,
                                                      'inizio':el.inizio,
                                                      'fine': el.fine}, 
                                                      project, 
                                                      db);
            if (resultSrcVin._id){
              //ok ok ok ok
              bulk.find({_id : resultSrcVin._id}).remove();
              bulk.insert(el);
              bulk.find({ "tipo" : "lezione",
                          "corsoAcr" : el.corsoAcr,
                          "giorno" : el.giorno,
                          "inizio" : { $lt : el.fine },
                          "fine" : { $gt : el.inizio }
                        }).update({$set: { "stato": el.stato}});
            } else {
              //ok ok ok ok
              bulk.insert(el);
              bulk.find({ "tipo" : "lezione",
                          "corsoAcr" : el.corsoAcr,
                          "giorno" : el.giorno,
                          "inizio" : { $lt : el.fine },
                          "fine" : { $gt : el.inizio }
                        }).update({$set: { "stato": el.stato}});
            }
          }
      await bulk.execute(); 
      });  
      } else {
        doc.forEach( async el => {
          if (el.tipo === 'lezione'){
            const resultSrcLez = await searchLezioni({'annoAcr': el.annoAcr,
                                                      'giorno': el.giorno,
                                                      'inizio':el.inizio,
                                                      'fine': el.fine}, 
                                                      project, 
                                                      db);
            if (resultSrcLez.length === 0)
              {
                const resultSrcAula = await searchAuleDisp({'giorno': el.giorno,
                                                            'inizio':el.inizio,
                                                            'fine': el.fine}, 
                                                            project, 
                                                            db);
                if (resultSrcAula.some(a => a.acr === el.aula.acr)){
                  const resultSrcVin = await searchVincoli({'corsoAcr': el.corsoAcr,
                                                          'giorno': el.giorno,
                                                          'inizio':el.inizio,
                                                          'fine': el.fine}, 
                                                          project, 
                                                          db);
                  el.stato = resultSrcVin.stato
                  bulk.insert(el);
                }
            }
            if (el.tipo === 'vincolo') {
              const resultSrcVin = await searchVincoli({'corsoAcr': el.corsoAcr,
                                                        'giorno': el.giorno,
                                                        'inizio':el.inizio,
                                                        'fine': el.fine}, 
                                                        project, 
                                                        db);
              if (!resultSrcVin._id)
                {
                bulk.insert(el);
                bulk.find({ "tipo" : "lezione",
                            "corsoAcr" : el.corsoAcr,
                            "giorno" : el.giorno,
                            "inizio" : { $lt : el.fine },
                            "fine" : { $gt : el.inizio }
                          }).update({$set: { "stato": el.stato}});
                }
            }
          }
        await bulk.execute(); 
        });
      }
  }
}

  module.exports = {
    uploadFile,
    readFile,
    insertInDb,
}