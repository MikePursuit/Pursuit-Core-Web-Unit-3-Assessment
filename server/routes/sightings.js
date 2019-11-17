const express = require('express');
const router = express.Router();

const Sightings = require('../models/Sightings');

router.post("/", async (req, res, next) => {
    const {
        researcher_id,
        species_id,
        habitat_id
    } = req.body;
    if (!researcher_id || !species_id || !habitat_id) {
        return res.status(400).json({
            status: 'error',
            message: `Expected valid values for sighting [researcher_id, species_id, habitat_id]`,
            payload: null
        })
    }

    try {
        let sighting = {
            researcher_id,
            species_id,
            habitat_id
        };

        let registeredSighting = await Sightings.createSighting(sighting);
        res.status(200).json({
            status: 'success',
            message: "Sighting created",
            payload: registeredSighting,
        })
    } catch (err) {
        res.status(409).json({
            status: 'error',
            message: `
                Expected valid values for sighting 
                researcher_id type INT REFERENCING researchers table
                species_id type INT REFERENCING species table
                habitat_id type INT REFERENCING habitats table
                `,
            payload: err,
        })
    }
})

router.get('/', async (req, res, next) => {
    try {
        const sightings = await Sightings.getAll();
        res.status(200).json({
            status: 'success',
            message: "retrieved Sightings",
            payload: sightings,
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

router.get('/species/:id', async (req, res, next) => {
    let {
        id
    } = req.params
    try {
        const sighting = await Sightings.getSightingBySpeciesId(id);
        res.status(200).json({
            status: 'success',
            message: "retrieved Sighting by species id",
            payload: sighting,
        })
    } catch (err) {
        res.status(409).json({
            status: 'error',
            message: `
                /sightings/species/:id must be INT referencing species table
                `,
            payload: err,
        })
    }
});

router.get('/researchers/:id', async (req, res, next) => {
    let {
        id
    } = req.params
    try {
        const sighting = await Sightings.getSightingByResearchersId(id);
        res.status(200).json({
            status: 'success',
            message: "retrieved Sighting by researchers id",
            payload: sighting,
        })
    } catch (err) {
        res.status(409).json({
            status: 'error',
            message: `
                /sightings/researchers/:id must be INT referencing researchers table
                `,
            payload: err,
        })
    }
});

router.get('/habitats/:id', async (req, res, next) => {
    let {
        id
    } = req.params
    try {
        const sighting = await Sightings.getSightingByHabitatsId(id);
        res.status(200).json({
            status: 'success',
            message: "retrieved Sighting by habitats id",
            payload: sighting,
        })
    } catch (err) {
        res.status(409).json({
            status: 'error',
            message: `
                /sightings/habitats/:id must be INT referencing habitats table
                `,
            payload: err,
        })
    }
});

router.delete('/:id', async (req, res, next) => {
    const {
        id
    } = req.params;

    try {
        const deletedSighting = await Sightings.removeSighting(id);
        res.status(200).json({
            status: 'success',
            message: "deleted Sighting by id",
            payload: deletedSighting,
        })
    } catch (err) {
        res.status(409).json({
            status: 'error',
            message: `
                /sightings/:id must be INT referencing sightings table
                `,
            payload: err,
        })
    }
});

module.exports = router;
