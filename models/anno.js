'use strict';
const Joi = require('joi');

class Anno {
    constructor(annoAcr){
        this.annoAcr = annoAcr;
    }
} 
const schemaAnno = Joi.object({
        annoAcr : Joi.string().alphanum().trim().min(3).max(8).required()
    });

module.exports ={
  Anno,
  schemaAnno 
} 