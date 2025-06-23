function csvToMatrix(csvText, delimiter = ',') {
  return csvText
    .trim()
    .split('\n')
    .map(row => row.split(delimiter));
}

function parseIslandsMatrix(matrix) {
  const dataRows = matrix.slice(2);
  
  return dataRows.map(row => ({
    name: row[1].trim(),
    affordability: parseFloat(row[7]),
    residentServices: parseFloat(row[9]),
    greenSpace: parseFloat(row[18]),
    tourism: parseFloat(row[11]),
    userDensity: parseFloat(row[13]),
    accessibility: parseFloat(row[14]),
    reachability: parseFloat(row[16]),
    streetView: row[5].trim()
  }));
}

let islands = [];

fetch('./ISLES_ Data Hub - indicatorsInnerCity.csv')
  .then(response => response.text())
  .then(csvText => {
    const matrix = csvToMatrix(csvText);
    islands = parseIslandsMatrix(matrix);
  })
  .catch(err => console.error(err));

function findMostSimilarIsland(userInputs) {
    let mostSimilarIsland = null;
    let highestSimilarity = -1;
    
    islands.forEach(island => {
        const similarityScore = calculateSimilarity(userInputs, island);
        
        if (similarityScore > highestSimilarity) {
            highestSimilarity = similarityScore;
            mostSimilarIsland = island;
        }
    });
    
    return {
        island: mostSimilarIsland,
        similarity: highestSimilarity
    };
}

function calculateSimilarity(userInputs, island) {
    let sumOfSquares = 0;
    const indicators = ['affordability', 'residentServices', 'greenSpace', 'tourism', 'userDensity', 'accessibility', 'reachability'];
    
    indicators.forEach(ind => {
        sumOfSquares += Math.pow(userInputs[ind] - island[ind], 2);
    });
    
    const distance = Math.sqrt(sumOfSquares);
    const maxDistance = Math.sqrt(7 * 100);
    const similarityScore = ((maxDistance - distance) / maxDistance) * 100;
    
    return Math.round(similarityScore * 10) / 10;
}

function setupSliderValueDisplays() {
    const sliders = document.querySelectorAll('input[type="range"]');
    
    sliders.forEach(slider => {
        const valueDisplay = document.getElementById(`${slider.id}-value`);
        
        slider.addEventListener('input', () => {
            valueDisplay.textContent = slider.value;
        });
    });
}


function submitButtonClicked(event) {
    event.preventDefault();
    
    const userInputs = {
        affordability: parseInt(document.getElementById('affordability').value),
        residentServices: parseInt(document.getElementById('residentServices').value),
        greenSpace: parseInt(document.getElementById('greenSpace').value),
        tourism: parseInt(document.getElementById('tourism').value),
        userDensity: parseInt(document.getElementById('userDensity').value),
        accessibility: parseInt(document.getElementById('accessibility').value),
        reachability: parseInt(document.getElementById('reachability').value)
    };
    
    const result = findMostSimilarIsland(userInputs);
    const island = result.island;
    const similarity = result.similarity;
    
    document.getElementById('island-name').textContent = island.name;
    document.getElementById('result-affordability').textContent = Math.round(island.affordability * 100) / 100;
    document.getElementById('result-residentServices').textContent = Math.round(island.residentServices * 100) / 100;
    document.getElementById('result-greenSpace').textContent = Math.round(island.greenSpace * 100) / 100;
    document.getElementById('result-tourism').textContent = Math.round(island.tourism * 100) / 100;
    document.getElementById('result-userDensity').textContent = Math.round(island.userDensity * 100) / 100;
    document.getElementById('result-accessibility').textContent = Math.round(island.accessibility * 100) / 100;
    document.getElementById('result-reachability').textContent = Math.round(island.reachability * 100) / 100;
    document.getElementById('result-streetView').src = island.streetView;
    document.getElementById('similarity-score').textContent = `${similarity}%`;
    
    document.getElementById('results').style.display = 'block';
    document.getElementById('results').scrollIntoView({ behavior: 'smooth' });
}

document.addEventListener('DOMContentLoaded', () => {
    setupSliderValueDisplays();
    document.getElementById('preference-form').addEventListener('submit', submitButtonClicked);
    document.getElementById('try-again-btn').addEventListener('click', () => {
        document.getElementById('results').style.display = 'none';
        document.getElementById('preference-form').scrollIntoView({ behavior: 'smooth' });
    });
});