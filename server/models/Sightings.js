const {
    db,
    errors
} = require('../db/config.js');

const createSighting = async (sighting) => {
    try {
        let insertQuery = `INSERT INTO sightings (researcher_id, species_id, habitat_id) VALUES($/researcher_id/, $/species_id/, $/habitat_id/) RETURNING *`;
        let newSighting = await db.one(insertQuery, sighting)
        return newSighting;
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

const getSightingBySpeciesId = async (id) => {
    try {
        let selectQuery = 'SELECT * FROM sightings WHERE species_id = $1'
        let sightings = await db.any(selectQuery, id);
        if (sightings.length === 0) throw err
        if (sightings.length === 1) return sightings[0]
        return sightings;
    } catch (err) {
        throw err;
    }
}

const getSightingByResearchersId = async (id) => {
    try {
        let selectQuery = `
            SELECT 
                sightings.id AS sighting_id,
                researcher_id,
                species_id,
                habitat_id,
                researchers.name AS researcher_name,
                researchers.job_title AS researcher_job_title,
                category,
                species.name AS species_name,
                is_mammal 
            FROM sightings 
            INNER JOIN researchers 
            ON sightings.researcher_id = researchers.id 
            INNER JOIN habitats 
            ON sightings.habitat_id = habitats.id 
            INNER JOIN species 
            ON sightings.species_id = species.id
            WHERE researcher_id = $1`
        let sightings = await db.any(selectQuery, id);
        if (sightings.length === 0) throw err
        if (sightings.length === 1) return sightings[0]
        return sightings;
    } catch (err) {
        throw err;
    }
}

const getSightingByHabitatsId = async (id) => {
    try {
        let selectQuery = 'SELECT * FROM sightings WHERE habitat_id = $1'
        let sightings = await db.any(selectQuery, id);
        if (sightings.length === 0) throw err
        if (sightings.length === 1) return sightings[0]
        return sightings;
    } catch (err) {
        throw err;
    }
}


const getAll = async () => {
    try {
        let sightings = await db.any(
            `SELECT 
                sightings.id AS sighting_id,
                researcher_id,
                species_id,
                habitat_id,
                researchers.name AS researcher_name,
                researchers.job_title AS researcher_job_title,
                category,
                species.name AS species_name,
                is_mammal 
            FROM sightings 
            INNER JOIN researchers 
            ON sightings.researcher_id = researchers.id 
            INNER JOIN habitats 
            ON sightings.habitat_id = habitats.id 
            INNER JOIN species 
            ON sightings.species_id = species.id`);
        return sightings;
    } catch (err) {
        throw err;
    }
}

const removeSighting = async (id) => {
    let sighting;
    try {
        sighting = await db.one(`DELETE FROM sightings WHERE id = $/id/ RETURNING *`, {
            id
        });
        return sighting;
    } catch (err) {
        throw (err)
    }
}

module.exports = {
    createSighting,
    getSightingBySpeciesId,
    getSightingByResearchersId,
    getSightingByHabitatsId,
    removeSighting,
    getAll
}