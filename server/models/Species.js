const {
    db,
    errors
} = require('../db/config.js');

const createSpecie = async (species) => {
    try {
        let insertQuery = `INSERT INTO species (name, is_mammal) VALUES($/name/, $/is_mammal/) RETURNING *`;
        let newSpecies = await db.one(insertQuery, species)
        return newSpecies;
    } catch (err) {
        // name already taken 
        if (err.code === "23505" && err.detail.includes("already exists")) {
            let customErr = "name not available. Please try a different one.";
            err = customErr;
            throw customErr;
        }
        throw err;
    }
}

const getSpeciesById = async (id) => {
    try {
        let selectQuery = 'SELECT * FROM species WHERE id = $1'
        let species = await db.one(selectQuery, id);
        return species;
    } catch (err) {
        throw err;
    }
}

const getAll = async () => {
    try {
        let species = await db.any('SELECT * FROM species');
        return species;
    } catch (err) {
        throw err;
    }
}

module.exports = {
    createSpecie,
    getSpeciesById,
    getAll
}