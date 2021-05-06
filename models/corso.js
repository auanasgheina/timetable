'use strict';
const Joi = require('joi');

class Corso {
    constructor(corsoAcr){
        this.corsoAcr = corsoAcr;
    }    
}

const schemaCorso = Joi.object({
    corsoAcr : Joi.string().alphanum().trim().min(3).max(8).required()
});

module.exports = {Corso, schemaCorso}