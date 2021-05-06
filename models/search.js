'use strict';
const Joi = require('joi');

const schemaLezSearch = Joi.object({
    annoAcr : Joi.string().alphanum().trim().min(3).max(8).required(),
    giorno: Joi.any().valid('lunedi',
                            'martedi',
                            'mercoledi',
                            'giovedi',
                            'venerdi').required(),
    inizio: Joi.number().min(900).max(1900).required().strict(),
    fine: Joi.number().greater(Joi.ref('inizio')).max(1900).required().strict()
});

const schemaVinSearch = Joi.object({
    corsoAcr : Joi.string().alphanum().trim().min(3).max(8).required(),
    giorno: Joi.any().valid('lunedi',
                            'martedi',
                            'mercoledi',
                            'giovedi',
                            'venerdi').required(),
    inizio: Joi.number().min(900).max(1900).required().strict(),
    fine: Joi.number().greater(Joi.ref('inizio')).max(1900).required().strict()
});

const schemaAulaSearch = Joi.object({
    giorno: Joi.any().valid('lunedi',
                            'martedi',
                            'mercoledi',
                            'giovedi',
                            'venerdi').required(),
    inizio: Joi.number().min(900).max(1900).required().strict(),
    fine: Joi.number().greater(Joi.ref('inizio')).max(1900).required().strict()
});

const schemaLezInAulaSearch = Joi.object({
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
    schemaAulaSearch,
    schemaLezSearch,
    schemaVinSearch,
    schemaLezInAulaSearch
}