const {
    db,
    errors
} = require('../db/config.js');

const createHabitat = async (habitat) => {
    try {
        let insertQuery = `INSERT INTO habitats (category) VALUES($/category/) RETURNING *`;
        let newHabitats = await db.one(insertQuery, habitat)
        return newHabitats;
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

const getHabitatById = async (id) => {
    try {
        let selectQuery = 'SELECT * FROM habitats WHERE id = $1'
        let habitats = await db.one(selectQuery, id);
        return habitats;
    } catch (err) {
        throw err;
    }
}

const getAll = async () => {
    try {
        let habitats = await db.any('SELECT * FROM habitats');
        return habitats;
    } catch (err) {
        throw err;
    }
}

module.exports = {
    createHabitat,
    getHabitatById,
    getAll
}