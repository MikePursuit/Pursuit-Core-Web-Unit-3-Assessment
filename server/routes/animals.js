const express = require('express');
const router = express.Router();

const Animals = require('../models/Animals');

router.post("/", async (req, res, next) => {
    const {
        species_id,
        nickname
    } = req.body;
    if (!species_id || !nickname) {
        return res.status(400).json({
            status: 'error',
            message: `Expected valid values for animal [species_id, nickname]`,
            payload: null,
        })
    }

    try {
        let animal = {
            species_id,
            nickname
        };

        let registeredAnimal = await Animals.createAnimal(animal);
        res.status(200).json({
            status: 'success',
            message: `Animal created`,
            payload: registeredAnimal,
        })
    } catch (err) {
        res.status(409).json({
            status: 'error',
            message: `
                Expected valid values for animal 
                species_id type INT referencing species table
                nickname must not be null and must be unqiue
                `,
            payload: err,
        })
    }
})

router.get('/', async (req, res, next) => {
    try {
        const animals = await Animals.getAll();
        res.status(200).json({
            status: 'success',
            message: `retrieved all animals`,
            payload: animals,
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
        const animal = await Animals.getAnimalById(id);
        res.status(200).json({
            status: 'success',
            message: `retrieved animal by id`,
            payload: animal,
        })
    } catch (err) {
        res.status(409).json({
            status: 'error',
            message: `
                /animals/:id must be INT referencing animals table
                `,
            payload: err,
        })
    }
});

router.patch('/:id', async (req, res, next) => {
    const {
        id
    } = req.params;
    const animal_edits = req.body
    try {
        const updatedAnimal = await Animals.updateAnimal(id, animal_edits);
        if (updatedAnimal) {
            return res.status(200).json({
                status: 'success',
                message: `updated animal by id`,
                payload: updatedAnimal,
            })
        }

        res.status(404).json({
            status: 'error',
            message: `
                animal not found
                `,
            payload: null,
        })
    } catch (err) {
        res.status(409).json({
            status: 'error',
            message: `
                /animals/:id must be INT referencing animals table
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
        const deletedAnimal = await Animals.removeAnimal(id);
        if (deletedAnimal) {
            return res.status(200).json({
                status: 'success',
                message: `deleted animal by id`,
                payload: deletedAnimal,
            })
        }

        res.status(404).json({
            status: 'error',
            message: "Animal not found",
            payload: null
        })
    } catch (err) {
        res.status(409).json({
            status: 'error',
            message: `
                /animals/:id must be INT referencing animals table
                `,
            payload: err,
        })
    }
});

module.exports = router;