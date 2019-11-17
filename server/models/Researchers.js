const {
    db,
    helpers,
    errors
} = require('../db/config.js');

const optionalCol = col => ({
    name: col,
    skip: (col) => col.value === null || col.value === undefined || !col.exists
})

const createResearcher = async (researcher) => {
    try {
        let insertQuery = `INSERT INTO researchers (name, job_title) VALUES($/name/, $/job_title/) RETURNING *`;
        let newResearcher = await db.one(insertQuery, researcher)
        return newResearcher;
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

const getResearcherById = async (id) => {
    try {
        let selectQuery = 'SELECT * FROM researchers WHERE id = $1'
        let researcher = await db.one(selectQuery, id);
        return researcher;
    } catch (err) {
        throw err;
    }
}

const getAll = async () => {
    try {
        let researchers = await db.any('SELECT * FROM researchers');
        return researchers;
    } catch (err) {
        throw err;
    }
}

const updateResearcher = async (id, researcherEdits) => {
    const columnSet = new helpers.ColumnSet([
        optionalCol("name"),
        optionalCol("job_title"),
    ], {
        table: "researchers"
    })

    const updateQuery = `${helpers.update(researcherEdits, columnSet)} 
          WHERE id = $/id/ RETURNING *`;

    try {
        let researcher = await db.one(updateQuery, {
            id
        })
        return researcher
    } catch (err) {
        if (
            (err instanceof errors.QueryResultError &&
                err.code === errors.queryResultErrorCode.noData) ||
            (err.code === "23503") //New owner not in table 
        ) {
            let researcher = false
            return researcher;
        }
        throw (err)
    }
}

const removeResearcher = async (id) => {
    try {
        let researcher = await db.one(`DELETE FROM researchers WHERE id = $/id/ RETURNING *`, {
            id
        });
        // if (researcher.length === 0) throw err
        return researcher;
    } catch (err) {
        throw (err)
    }
}

module.exports = {
    createResearcher,
    getResearcherById,
    getAll,
    updateResearcher,
    removeResearcher
}