window.addEventListener(`DOMContentLoaded`, () => {

        document.querySelectorAll('.question-box').forEach(box => {
        const slider = box.querySelector('input[type="range"]');
        if (!slider) return;

        // Prevent default click highlights or text selections during active dragging
        box.style.userSelect = 'none';

        // Listen for standard keyboard focus or direct slider clicks
        box.addEventListener('focusin', () => {
            box.classList.add('active-interaction');
        });

        box.addEventListener('focusout', () => {
            box.classList.remove('active-interaction');
        });

        // Listen for mouse dragging states (handles your expanded hit-target dragging click rules)
        box.addEventListener('mousedown', () => {
            box.classList.add('active-interaction');
            
            // Remove class only when the user lets go of the mouse anywhere on screen
            const removeActiveDrag = () => {
                // Keep active if the keyboard focus is still inside the element
                if (document.activeElement !== slider) {
                    box.classList.remove('active-interaction');
                }
                window.removeEventListener('mouseup', removeActiveDrag);
            };
            window.addEventListener('mouseup', removeActiveDrag);
        });

        function handleInputScaling(e) {
            // Find the bounding box dimensions of the interactive slider bar
            const rect = slider.getBoundingClientRect();
            
            // Target client horizontal position regardless of desktop mouse or mobile touch input
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            
            // Calculate the percentage relative to the slider position bounds
            let percentage = (clientX - rect.left) / rect.width;
            
            // Clamp bounds to prevent math errors beyond the 0 to 1 range boundary
            percentage = Math.max(0, Math.min(1, percentage));
            
            // Distribute calculated value across slider attributes min/max map bounds
            const min = parseFloat(slider.min) || 0;
            const max = parseFloat(slider.max) || 10;
            const computedValue = min + percentage * (max - min);
            
            // Apply values and fire event updates so your clearDescription rules trigger
            slider.value = computedValue.toFixed(1);
            slider.dispatchEvent(new Event('input', { bubbles: true }));
        }

        // Capture standard container clicks
        box.addEventListener('mousedown', (e) => {
            handleInputScaling(e);
            
            // Enable drag state tracking anywhere on screen until the cursor releases
            const trackingMove = (moveEvent) => handleInputScaling(moveEvent);
            const trackingUp = () => {
                window.removeEventListener('mousemove', trackingMove);
                window.removeEventListener('mouseup', trackingUp);
            };
            
            window.addEventListener('mousemove', trackingMove);
            window.addEventListener('mouseup', trackingUp);
        });

        // Mirror gestures for mobile screen layouts 
        box.addEventListener('touchstart', (e) => {
            handleInputScaling(e);
            
            const trackingMove = (moveEvent) => handleInputScaling(moveEvent);
            const trackingEnd = () => {
                window.removeEventListener('touchmove', trackingMove);
                window.removeEventListener('touchend', trackingEnd);
            };
            
            window.addEventListener('touchmove', trackingMove);
            window.addEventListener('touchend', trackingEnd);
        }, { passive: true });
    });

  // Radio toggle inputs
  const radioA = document.getElementById("personality");
  const radioB = document.getElementById("action");

  // Elements
  const playerDot = document.querySelector(`.dot`);
  const containerA = document.querySelector(".optionA");
  const containerB = document.querySelector(".optionB");
  const submitBtn = document.getElementById("submit-quiz-btn"); // Grab the button

  // Toggle Functionality
  function toggle() {
    const selectedOption = document.querySelector(`input[name="eitherOrGroup"]:checked`).value;
    
    if (selectedOption === "A") {
      containerA.style.display = "block";
      containerB.style.display = "none";
    } else if (selectedOption === "B") {
      containerA.style.display = "none";
      containerB.style.display = "block";
    }
    
    // Hide the dot again if they switch quiz modes so they have to re-submit
    playerDot.style.display = "none";
    // Hide description container when switching quiz modes
    document.getElementById("result-container").style.display = "none";
  }

  radioA.addEventListener("change", toggle);
  radioB.addEventListener("change", toggle);

  // Core Math Logic Function
  const updateChart = () => {
    // 1. Find out which section is currently active
    const selectedOption = document.querySelector(`input[name="eitherOrGroup"]:checked`).value;
    let activeContainer = selectedOption === "A" ? containerA : containerB;

    // 2. Dynamically grab ONLY the sliders inside the active container
    const xSliders = activeContainer.querySelectorAll(`input[class*="x-slider"]`);
    const ySliders = activeContainer.querySelectorAll(`input[class*="y-slider"]`);

    // 3. Calculate X-Axis (Law vs Chaos)
    let totalXScore = 0;
    xSliders.forEach(slider => {
      totalXScore += Number(slider.value);
    });
    let maxXPoints = xSliders.length * 10; 
    let xPercentage = maxXPoints === 0 ? 50 : (totalXScore / maxXPoints) * 98 + 1;

    // 4. Calculate Y-Axis (Good vs Evil)
    let totalYScore = 0;
    ySliders.forEach(slider => {
      totalYScore += Number(slider.value);
    });
    let maxYPoints = ySliders.length * 10;
    let yPercentage = maxYPoints === 0 ? 50 : (totalYScore / maxYPoints) * 98 + 1;

    // 5. Move the dot to its final calculated coordinates
    playerDot.style.left = `${xPercentage}%`;
    playerDot.style.top = `${yPercentage}%`;

    // 6. REVEAL THE DOT! 
    playerDot.style.display = "block";

    // 7. NEW: Calculate alignment text and reveal description box
    showAlignmentDescription(xPercentage, yPercentage);
  };

  // Listen for the button click to run the math and show the dot
  submitBtn.addEventListener("click", updateChart);

  // Run initial setup on page load
  toggle();
  // Hide description container when switching quiz modes
  document.getElementById("result-container").style.display = "none";

    // Database of descriptions mapped directly to alignment keys
    const alignmentDescriptions = {
        "Lawful Good": "Your instincts are kept in check by a strong internal compass, and your actions consistently benefit those around you. You play by the rules and they happen to be the right rules.",
        "Neutral Good": "You do what's right without being rigid about how — structure and impulse balance out, but your impact on others stays positive. Flexible in method, consistent in outcome.",
        "Chaotic Good": "Your gut calls the shots, but it usually points you toward helping others. You break rules when they get in the way of doing what's right.",
        "Lawful Neutral": "Discipline and self-control define you, but you're not particularly driven by helping or harming others. You follow the system because that's what keeps things running.",
        "True Neutral": "Instinct and discipline cancel each other out, and your net impact on others hovers near zero. You exist in balance not by ideology, but by nature.",
        "Chaotic Neutral": "You act on impulse and answer to no one, but your actions don't trend toward helping or hurting others in any meaningful way. Freedom is the point and consequences are secondary.",
        "Lawful Evil": "You're disciplined, controlled, and methodical, and you use all of it to serve yourself at others' expense. The rules are a tool, not a value.",
        "Neutral Evil": "You're neither reckless nor principled. You just do what benefits you, regardless of who it hurts. No strong code, no strong impulse, just quiet self-interest.",
        "Chaotic Evil": "You act on raw impulse with little regard for rules or the people around you. Harm to others isn't the goal, but it's rarely the obstacle either."
    };

    function showAlignmentDescription(xPct, yPct) {
        let alignmentX = "";
        let alignmentY = "";

        // Determine X-Axis bucket (Law vs Chaos)
        // 0 to 33.3% = Lawful, 33.3% to 66.6% = Neutral, 66.6% to 100% = Chaotic
        if (xPct <= 33.33) {
            alignmentX = "Lawful";
        } else if (xPct <= 66.66) {
            alignmentX = "Neutral";
        } else {
            alignmentX = "Chaotic";
        }

        // Determine Y-Axis bucket (Good vs Evil)
        // Note: Top of grid (low percentage) is Good, bottom of grid (high percentage) is Evil
        if (yPct <= 33.33) {
            alignmentY = "Good";
        } else if (yPct <= 66.66) {
            alignmentY = "Neutral";
        } else {
            alignmentY = "Evil";
        }

        // Combine axes to create key (Handle special case for True Neutral)
        let finalAlignmentKey = `${alignmentX} ${alignmentY}`;
        if (finalAlignmentKey === "Neutral Neutral") {
            finalAlignmentKey = "True Neutral";
        }

        // Target UI output containers
        const resultContainer = document.getElementById("result-container");
        const resultTitle = document.getElementById("result-title");
        const resultText = document.getElementById("result-text");

        // Inject text and slide open the result box
        resultTitle.textContent = finalAlignmentKey;
        resultText.textContent = alignmentDescriptions[finalAlignmentKey];
        resultContainer.style.display = "block";
    }

});

