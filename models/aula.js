'use strict';
const Joi = require('joi');

class Aula {
    constructor(acr, colore){
        this.acr = acr;
        this.colore = colore;
    }
}
const schemaAula = Joi.object({
    acr : Joi.string().alphanum().trim().min(3).max(8).required(),
    colore: Joi.string().trim().length(6).hex().required()
});

module.exports = {Aula, schemaAula}