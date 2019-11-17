const express = require('express');
const router = express.Router();

const Researchers = require('../models/Researchers');

router.post("/", async (req, res, next) => {
    const {
        name,
        job_title
    } = req.body;
    if (!name || !job_title) {
        return res.status(400).json({
            status: 'error',
            message: `Expected valid values for researcher [name, job_title]`,
            payload: null,
        })
    }

    try {
        let researcher = {
            name,
            job_title
        };

        let registeredResearcher = await Researchers.createResearcher(researcher);
        res.status(200).json({
            status: 'success',
            message: "Researcher created",
            payload: registeredResearcher,
        })
    } catch (err) {
        res.status(409).json({
            status: 'error',
            message: `
                Expected valid values for researchers 
                name type VARCHAR UNIQUE NOT NULL
                job_title must not be null
                `,
            payload: err,
        })
    }
})

router.get('/', async (req, res, next) => {
    try {
        const researchers = await Researchers.getAll();
        res.status(200).json({
            status: 'success',
            message: "retireved all researchers",
            payload: researchers,
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
        const researcher = await Researchers.getResearcherById(id);
        res.status(200).json({
            status: 'success',
            message: "retireved researcher by id",
            payload: researcher,
        })
    } catch (err) {
        res.status(409).json({
            status: 'error',
            message: `
                /researchers/:id must be INT referencing researchers table
                `,
            payload: err,
        })
    }
});

router.patch('/:id', async (req, res, next) => {
    const {
        id
    } = req.params;
    const researcher_edits = req.body
    try {
        const updatedResearcher = await Researchers.updateResearcher(id, researcher_edits);
        res.status(200).json({
            status: 'success',
            message: "updated researcher by id",
            payload: updatedResearcher,
        })
    } catch (err) {
        res.status(409).json({
            status: 'error',
            message: `
                /researchers/:id must be INT referencing researchers table
                updated name must be UNIQUE
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
        const deletedResearcher = await Researchers.removeResearcher(id);
        res.status(200).json({
            status: 'success',
            message: "deleted researcher by id",
            payload: deletedResearcher,
        })
    } catch (err) {
        res.status(409).json({
            status: 'error',
            message: `
                /researchers/:id must be INT referencing researchers table
                `,
            payload: err,
        })
    }
});

module.exports = router;