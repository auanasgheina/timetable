'use strict';
const Joi = require('joi');

class Vincolo {
    constructor(_id, tipo, stato, corsoAcr, giorno, inizio, fine){
        this._id = _id;
        this.tipo = tipo;
        this.stato = stato;
        this.corsoAcr = corsoAcr;
        this.giorno = giorno;
        this.inizio = inizio;
        this.fine = fine;
    }
}

const schemaVin = Joi.object({
    tipo : Joi.any().valid('vincolo').required(),
    stato : Joi.any().valid('success','danger','warning').required(),
    corsoAcr : Joi.string().alphanum().trim().min(3).max(8).required(),
    giorno: Joi.any().valid('lunedi',
                            'martedi',
                            'mercoledi',
                            'giovedi',
                            'venerdi').required(),
    inizio: Joi.number().min(900).max(1900).required().strict(),
    fine: Joi.number().greater(Joi.ref('inizio')).max(1900).required().strict()
});

module.exports = {Vincolo, schemaVin}