window.addEventListener(`DOMContentLoaded`, () => {

    // Slider listeners
    const xSlider1 = document.querySelector(`.x-slider-1`);
    const xSlider2 = document.querySelector(`.x-slider-2`);
    const ySlider1 = document.querySelector(`.y-slider-1`);
    const ySlider2 = document.querySelector(`.y-slider-2`);
    
    // Defines initial variable containers
    let idScore = 0;
    let superegoScore = 0;
    let benefitScore = 0;
    let harmScore = 0;

    // Grabs elements AFTER page loads
    const playerDot = document.querySelector(`.dot`);
    const xSlider = document.querySelector(`.x-slider`);
    const ySlider = document.querySelector(`.y-slider`);

    // Convert default scores into padded percentages for dot starting point
    let totalXPoints = idScore + superegoScore;
    let totalYPoints = harmScore + benefitScore;

    let xScore = totalXPoints === 0 ? 5 : (idScore / totalXPoints) * 10; // MISSING 'let'
    let yScore = totalYPoints === 0 ? 5 : (benefitScore / totalYPoints) * 10; // MISSING 'let'

    let initialXPercentage = (idScore / 20) * 98 + 1;
    let initialYPercentage = (benefitScore / 20) * 98 +1;

    playerDot.style.left = `${initialXPercentage}%`;
    playerDot.style.top = `${initialYPercentage}%`;

    const updateChart = () => {

        // Creates an array of current X slider values
        const xValues = [Number(xSlider1.value), Number(xSlider2.value)];
        let idScore = 0; 
        for (let i = 0; i < xValues.length; i++) { 
            idScore += xValues[i];
        }
        let maxXPoints = xValues.length * 10;
        let xPercentage = (idScore / maxXPoints) * 98 + 1;

    
        // Creates an array of current Y slider values
        const yValues = [Number(ySlider1.value), Number(ySlider2.value)];
        let benefitScore = 0; 
        for (let i = 0; i < yValues.length; i++) { 
            benefitScore += yValues[i];
        }
        let maxXYoints = yValues.length * 10;
        let yPercentage = (benefitScore / maxXYoints) *98 + 1;

        playerDot.style.left = `${xPercentage}%`;
        playerDot.style.top = `${yPercentage}%`;
    };

    xSlider1.addEventListener("input", updateChart);
    xSlider2.addEventListener("input", updateChart);
    ySlider1.addEventListener("input", updateChart);
    ySlider2.addEventListener("input", updateChart);

});
