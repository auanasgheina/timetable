'use strict';

const express = require('express');

const { uploadFile, readFile, insertInDb } = require('../controllers/fileCtrl');

const router = express.Router();


router.post('/:project/nuovo', async(req,res,next) => {
    try {
        const db = req.app.locals.db;
        const project = req.params.project;
        await db.createCollection(project);
        res.send(`collection ${project} creata`)
    } catch (error) {
        res.status(400).send('errore ' + error.message); 
    }

});

router.post('/:project/import', uploadFile, readFile, insertInDb);
    

//     try {
//         const result = await importFile(req);
//         res.send(`${result} lezioni aggiunte; ${result} vincoli aggiunti; ${result} lezioni modificate;`);
//       } catch (error) {
//           res.status(400).send('errore ' + error.message); 
//       }  
// });

// router.delete('/delete/:anno', deleteAnno);
// router.get('/:anno', getAnno);
// router.put('/update/:anno', updateAnno);

module.exports = {
    routes: router
}