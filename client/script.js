document.addEventListener('DOMContentLoaded', async () => {
    populateOptions()
    let sightingsSel = document.querySelector('#sightings select')
    sightingsSel.addEventListener('change', (event) => {
        console.log(event.target.selectedOptions[0].value)
        getSightings(event.target.selectedOptions[0].value)
    })
})

const createSighting = (sighting) => {
    let sightingsList = document.querySelector('#sightings ul')
    let researcher = sighting.researcher_name
    let specie = sighting.species_name
    let habitat = sighting.category
    let sightItem = document.createElement('li')
    sightItem.innerText = `${researcher} spotted a ${specie} in ${habitat}`
    sightingsList.append(sightItem)
    
}

const getSightings = async (researcher_id = '') => {
    let url = !researcher_id ? `http://localhost:3100/sightings/` : `http://localhost:3100/sightings/researchers/${researcher_id}`
    console.log(url)
    let {data} = await axios.get(url)
    let sightingsList = document.querySelector('#sightings ul')
    sightingsList.innerHTML = ''
    if (!Array.isArray(data.payload)) {
        createSighting(data.payload)
        return
    }
    data.payload.forEach(sighting => createSighting(sighting));
}

const populateOptions = async () => {
    let sightingsSel = document.querySelector('#sightings select')
    let {data} = await axios.get(`http://localhost:3100/sightings/`)
    data.payload.forEach((sighting) => {
        createSighting(sighting)
        let sightOpt = document.createElement('option')
        sightOpt.value = sighting.researcher_id
        sightOpt.innerText = sighting.researcher_name
        sightingsSel.append(sightOpt)
    })
}