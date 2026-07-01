window.addEventListener(`DOMContentLoaded`, () => {

    document.querySelectorAll('.question-box').forEach(box => {
    const slider = box.querySelector('input[type="range"]');
    if (!slider) return;

    box.style.userSelect = 'none';
    box.style.webkitUserSelect = 'none';

    box.addEventListener('focusin', () => box.classList.add('active-interaction'));
    box.addEventListener('focusout', () => box.classList.remove('active-interaction'));

    let animationFrameId = null;
    let startX = 0;
    let startY = 0;
    let isScrollingPage = false;
    let isTrackingSlider = false;

    function handleInputScaling(e) {
        if (animationFrameId) cancelAnimationFrame(animationFrameId);

        animationFrameId = requestAnimationFrame(() => {
            const rect = slider.getBoundingClientRect();
            let percentage = (e.clientX - rect.left) / rect.width;
            percentage = Math.max(0, Math.min(1, percentage));
            
            const min = parseFloat(slider.min) || 0;
            const max = parseFloat(slider.max) || 10;
            const computedValue = min + percentage * (max - min);
            
            slider.value = computedValue.toFixed(1);
            slider.dispatchEvent(new Event('input', { bubbles: true }));
        });
    }

    box.addEventListener('pointerdown', (e) => {
        // Record the exact point where the user first placed their thumb
        startX = e.clientX;
        startY = e.clientY;
        isScrollingPage = false;
        isTrackingSlider = false;

        const trackingMove = (moveEvent) => {
            // If the browser already decided this gesture is a vertical scroll, stop here
            if (isScrollingPage) return;

            // If we haven't locked onto an action yet, calculate the gesture direction
            if (!isTrackingSlider) {
                const deltaX = Math.abs(moveEvent.clientX - startX);
                const deltaY = Math.abs(moveEvent.clientY - startY);

                // If the movement is primarily vertical, lock this gesture to page scrolling
                if (deltaY > deltaX && deltaY > 8) {
                    isScrollingPage = true;
                    cleanup();
                    return;
                }

                // If movement is primarily horizontal, lock onto the slider
                if (deltaX > 8) {
                    isTrackingSlider = true;
                    box.classList.add('active-interaction');
                    box.setPointerCapture(e.pointerId);
                }
            }

            // Only update slider values if horizontal intent is locked in
            if (isTrackingSlider) {
                handleInputScaling(moveEvent);
            }
        };

        const trackingUp = (upEvent) => {
            // Auto-scroll to next container smoothly after user finishes a drag adjustment
            if (isTrackingSlider) {
                const nextBox = box.nextElementSibling;
                if (nextBox && nextBox.classList.contains('question-box')) {
                    setTimeout(() => {
                        nextBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }, 300); // 300ms pause gives visual breathing room
                }
            }

            if (isTrackingSlider) {
                box.releasePointerCapture(upEvent.pointerId);
            }
            if (document.activeElement !== slider) {
                box.classList.remove('active-interaction');
            }
            cleanup();
        };

        function cleanup() {
            box.removeEventListener('pointermove', trackingMove);
            box.removeEventListener('pointerup', trackingUp);
            box.removeEventListener('pointercancel', trackingUp);
        }

        box.addEventListener('pointermove', trackingMove);
        box.addEventListener('pointerup', trackingUp);
        box.addEventListener('pointercancel', trackingUp);
    });
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

