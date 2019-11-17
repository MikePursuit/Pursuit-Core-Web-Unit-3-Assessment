const express = require('express');
const router = express.Router();

const Habitats = require('../models/Habitats');

router.post("/", async (req, res, next) => {
    const {
        category
    } = req.body;
    if (!category) {
        return res.status(400).json({
            status: 'error',
            message: `Expected valid values for habitat [category]`,
            payload: null,
        })
    }

    try {
        let habitat = {
            category
        };

        let registeredHabitat = await Habitats.createHabitat(habitat);
        res.status(200).json({
            status: 'success',
            message: "Habitat created",
            payload: registeredHabitat,
        })
    } catch (err) {
        res.status(409).json({
            status: 'error',
            message: `
                Expected valid values for habitat 
                category type VARCHAR must be UNIQUE NOT NULL
                `,
            payload: err,
        })
    }
})

router.get('/', async (req, res, next) => {
    try {
        const habitats = await Habitats.getAll();
        res.status(200).json({
            status: 'success',
            message: "retrieved all habitats",
            payload: habitats,
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
        const habitat = await Habitats.getHabitatById(id);
        res.status(200).json({
            status: 'success',
            message: "retrieved habitat by id",
            payload: habitat,
        })
    } catch (err) {
        res.status(409).json({
            status: 'error',
            message: `
                /habitats/:id must be INT referencing habitats table
                `,
            payload: err,
        })
    }
});

module.exports = router;