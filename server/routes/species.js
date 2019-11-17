const express = require('express');
const router = express.Router();

const Species = require('../models/Species');

router.post("/", async (req, res, next) => {
    const {
        name,
        is_mammal
    } = req.body;
    if (!name || !is_mammal) {
        return res.status(400).json({
            status: 'error',
            message: `Expected valid values for specie [name, is_mammal]`,
            payload: null
        })
    }

    try {
        let specie = {
            name,
            is_mammal
        };

        let registeredSpecie = await Species.createSpecie(specie);
        res.status(200).json({
            status: 'success',
            message: "Specie created",
            payload: registeredSpecie,
        })
    } catch (err) {
        res.status(409).json({
            status: 'error',
            message: `
                Expected valid values for species 
                name type VARCHAR UNIQUE NOT NULL
                is_mammal must not be null defaults to false
                `,
            payload: err,
        })
    }
})

router.get('/', async (req, res, next) => {
    try {
        const species = await Species.getAll();
        res.status(200).json({
            status: 'success',
            message: "Species retrieved",
            payload: species,
        })
    } catch (err) {
        res.status(409).json({
            status: 'error',
            message: `
                There was an issue with your request
                `,
            payload: err,
        })
    }
});

router.get('/:id', async (req, res, next) => {
    let {
        id
    } = req.params
    try {
        const specie = await Species.getSpeciesById(id);
        res.status(200).json({
            status: 'success',
            message: "Species retrieved by id",
            payload: specie,
        })
    } catch (err) {
        res.status(409).json({
            status: 'error',
            message: `
                /species/:id must be INT referencing species table
                `,
            payload: err,
        })
    }
});

module.exports = router;