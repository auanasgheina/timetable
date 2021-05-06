'use strict';
const Joi = require('joi');

class Lezione {
    constructor(_id, tipo, stato, annoAcr, aula, corsoAcr, giorno, inizio, fine){
        this._id = _id;
        this.tipo = tipo;
        this.stato = stato;
        this.annoAcr = annoAcr;
        this.aula = aula;
        this.corsoAcr = corsoAcr;
        this.giorno = giorno;
        this.inizio = inizio;
        this.fine = fine;
    }
}

const schemaLez = Joi.object({
    tipo : Joi.any().valid('lezione').required(),
    stato : Joi.any().valid('success','danger','warning').required(),
    annoAcr : Joi.string().alphanum().trim().min(3).max(8).required(),
    corsoAcr : Joi.string().alphanum().trim().min(3).max(8).required(),
    aula: {
        acr : Joi.string().alphanum().trim().min(3).max(8).required(),
        colore: Joi.string().trim().length(6).hex().required()
    },
    giorno: Joi.any().valid('lunedi',
                            'martedi',
                            'mercoledi',
                            'giovedi',
                            'venerdi').required(),
    inizio: Joi.number().min(900).max(1900).required().strict(),
    fine: Joi.number().greater(Joi.ref('inizio')).max(1900).required().strict()
});

module.exports = {
    Lezione,
    schemaLez
}