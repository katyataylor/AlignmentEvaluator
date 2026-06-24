window.addEventListener(`DOMContentLoaded`, () => {
    
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

    let initialXPercent = (xScore / 10) * 98 +1;
    let initialYPercent = (yScore / 10) * 98 +1;

    playerDot.style.left = `${initialXPercent}%`;
    playerDot.style.top = `${initialYPercent}%`;

    // Listen for X-axis changes
    xSlider.addEventListener("input", () => {
        let currentScore = Number(xSlider.value);
        idScore = currentScore;
        superegoScore = 10 - currentScore;
        
        let totalXPoints = idScore + superegoScore;
        let xScore = totalXPoints === 0 ? 5 : (idScore / totalXPoints) * 10;
        
        let xPercentage = (xScore / 10) * 98 + 1;
        playerDot.style.left = `${xPercentage}%`;
    });

    // Listen for Y-axis changes
    ySlider.addEventListener("input", () => {
        let currentScore = Number(ySlider.value);
        benefitScore = currentScore;
        harmScore = 10 - currentScore;
        
        let totalYPoints = harmScore + benefitScore;
        let yScore = totalYPoints === 0 ? 5 : (benefitScore / totalYPoints) * 10;
        
        let yPercentage = (yScore / 10) * 98 + 1;
        playerDot.style.top = `${yPercentage}%`;
    });

});
