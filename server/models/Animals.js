const {
    db,
    helpers,
    errors
} = require('../db/config.js');

const optionalCol = col => ({
    name: col,
    skip: (col) => col.value === null || col.value === undefined || !col.exists
})  

const createAnimal = async (animal) => {
    try {
        let insertQuery = `INSERT INTO animals (species_id, nickname) VALUES($/species_id/, $/nickname/) RETURNING *`;
        let newAnimal = await db.one(insertQuery, animal)
        return newAnimal;
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

const getAnimalById = async (id) => {
    try {
        let selectQuery = 'SELECT * FROM animals WHERE id = $1'
        let animal = await db.one(selectQuery, id);
        return animal;
    } catch (err) {
        throw err;
    }
}

const getAll = async () => {
    try {
        let animals = await db.any('SELECT * FROM animals');
        return animals;
    } catch (err) {
        throw err;
    }
}

const updateAnimal = async (id, animalEdits) => {
    const columnSet = new helpers.ColumnSet([
        optionalCol("species_id"),
        optionalCol("nickname"),
    ], {
        table: "animals"
    })

    const updateQuery = `${helpers.update(animalEdits, columnSet)} 
          WHERE id = $/id/ RETURNING *`;

    try {
        let animal = await db.one(updateQuery, {
            id
        })
        return animal
    } catch (err) {
        throw (err)
    }
}

const removeAnimal = async (id) => {
    let animal;
    try {
        animal = await db.one(`DELETE FROM animals WHERE id = $/id/ RETURNING *`, {
            id
        });
        return animal;
    } catch (err) {
        if (err instanceof errors.QueryResultError &&
            err.code === errors.queryResultErrorCode.noData) {
            animal = false
            return animal;
        }
        throw (err)
    }
}

module.exports = {
    createAnimal,
    getAnimalById,
    getAll,
    updateAnimal,
    removeAnimal
}