// Depends on: canvas, fixedPlanetSelect (from main.js)
// Depends on: planets, scale, fixedPlanet (from main.js)
// Depends on: MIN_SCALE, MAX_SCALE (from config.js)
// Depends on: timeSpeed (from main.js) - for updating
// Depends on: INITIAL_TIME_SPEED (from config.js) - for initialization

let planetTooltip = null;
let hoveredPlanetKey = null; // Stores the key of the currently hovered planet
let lastMouseX = 0; // Store last known mouse X relative to canvas
let lastMouseY = 0; // Store last known mouse Y relative to canvas

function initializeUITooltip() {
    planetTooltip = document.createElement('div');
    planetTooltip.id = 'planetTooltip';
    document.body.appendChild(planetTooltip);
}

function resizeCanvas() {
    if (!canvas) return; // Guard clause for initialization order
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    // No specific recentering logic needed here anymore due to how updatePlanetPositions works
    // The fixed planet is always at (0,0) in its log-scaled coordinate system.
    // The main animate loop will recalculate and redraw correctly.
}

function setupEventListeners() {
    const timeSpeedInput = document.getElementById('timeSpeedInput');
    const timeSpeedDisplay = document.getElementById('timeSpeedDisplay');

    if (!fixedPlanetSelect || !canvas || !timeSpeedInput || !timeSpeedDisplay) return; // Guard clause

    const secondsInWeek = 604800;
    const minLogWeeks = 1;
    const maxLogWeeks = 10000;
    const sliderMin = 1;
    const sliderMax = 10000;

    // Function to convert slider value to log-scaled weeks/sec
    function sliderToDisplayedWeeks(sliderVal) {
        if (sliderVal <= sliderMin) return minLogWeeks;
        if (sliderVal >= sliderMax) return maxLogWeeks;
        const normalizedSlider = (sliderVal - sliderMin) / (sliderMax - sliderMin);
        const calculatedWeeks = minLogWeeks * Math.pow(maxLogWeeks / minLogWeeks, normalizedSlider);
        return Math.max(minLogWeeks, Math.round(calculatedWeeks));
    }

    // Function to convert target weeks/sec to a slider value
    function weeksToSliderValue(weeksVal) {
        if (weeksVal <= minLogWeeks) return sliderMin;
        if (weeksVal >= maxLogWeeks) return sliderMax;
        // log_base(value/min) = exponent => log(value/min) / log(base) = exponent
        // exponent = (sliderVal - sliderMin) / (sliderMax - sliderMin)
        // log(weeksVal / minLogWeeks) / log(maxLogWeeks / minLogWeeks) = (sliderVal - sliderMin) / (sliderMax - sliderMin)
        const normalizedExponent = Math.log(weeksVal / minLogWeeks) / Math.log(maxLogWeeks / minLogWeeks);
        return Math.round(sliderMin + normalizedExponent * (sliderMax - sliderMin));
    }

    // Initialize time speed input (slider) and display
    const initialTargetWeeksPerSec = timeSpeed / secondsInWeek; // timeSpeed from main.js (via config)
    timeSpeedInput.value = weeksToSliderValue(initialTargetWeeksPerSec);
    
    const initialDisplayedWeeks = sliderToDisplayedWeeks(parseInt(timeSpeedInput.value, 10));
    timeSpeedDisplay.textContent = `${initialDisplayedWeeks} weeks/sec`;
    // Ensure global timeSpeed is consistent with the rounded display from initial slider value
    timeSpeed = initialDisplayedWeeks * secondsInWeek;

    fixedPlanetSelect.addEventListener('change', (event) => {
        fixedPlanet = event.target.value;
        for (const key in planets) {
            if (planets[key].path) {
                planets[key].path = []; // Clear paths on planet change
            }
        }
        // resizeCanvas(); // No longer strictly needed here, as animate will recenter
        autoZoom(); // Call autoZoom from main.js to adjust scale and clear paths if needed
    });

    window.addEventListener('resize', resizeCanvas);

    canvas.addEventListener('wheel', (event) => {
        event.preventDefault();
        const zoomIntensity = 0.1;
        const direction = event.deltaY < 0 ? 1 : -1;
        const oldScale = scale;

        scale += direction * zoomIntensity * scale;
        scale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, scale));

        if (scale !== oldScale) {
            for (const key in planets) {
                if (planets[key].path) {
                    planets[key].path = [];
                }
            }
        }
        // resizeCanvas(); // No longer strictly needed here for recentering zoom
    });

    canvas.addEventListener('click', (event) => {
        if (!canvas || !planets || typeof scale === 'undefined' || typeof fixedPlanet === 'undefined' || !fixedPlanetSelect) return;

        const rect = canvas.getBoundingClientRect();
        const clickX = event.clientX - rect.left;
        const clickY = event.clientY - rect.top;

        // These are the offsets used to center the fixedPlanet at canvas.width/2, canvas.height/2
        // planet.x and planet.y are already log-scaled relative to the current fixedPlanet.
        const currentOffsetX = canvas.width / 2;
        const currentOffsetY = canvas.height / 2;

        let clickedPlanetKey = null;

        // Check planets in reverse order of typical drawing (e.g., outer to inner, or based on size for overlap)
        // For simplicity, direct iteration is fine; smaller planets might be harder to click if overlapped.
        // A more robust solution might involve checking smaller planets first or using z-ordering if that was a concept here.
        for (const key in planets) {
            const planet = planets[key];
            const planetScreenX = planet.x * scale + currentOffsetX;
            const planetScreenY = planet.y * scale + currentOffsetY;
            const distance = Math.sqrt(Math.pow(clickX - planetScreenX, 2) + Math.pow(clickY - planetScreenY, 2));

            // Use the effective radius used in drawing for click detection
            const effectiveRadius = Math.max(1, planet.radius * Math.sqrt(scale)); 

            if (distance < effectiveRadius) {
                clickedPlanetKey = key;
                break; // Found a planet, no need to check others (assumes no problematic overlaps for now)
            }
        }

        if (clickedPlanetKey && clickedPlanetKey !== fixedPlanet) {
            fixedPlanet = clickedPlanetKey;
            fixedPlanetSelect.value = clickedPlanetKey; // Update dropdown

            // Clear paths
            for (const keyInPlanets in planets) {
                if (planets[keyInPlanets].path) {
                    planets[keyInPlanets].path = [];
                }
            }
            // The main animation loop will handle redrawing with the new fixedPlanet.
        }
    });

    canvas.addEventListener('mousemove', (event) => {
        if (!canvas || !planets || typeof scale === 'undefined' || !planetTooltip) return;

        const rect = canvas.getBoundingClientRect();
        lastMouseX = event.clientX - rect.left;
        lastMouseY = event.clientY - rect.top;

        const currentOffsetX = canvas.width / 2;
        const currentOffsetY = canvas.height / 2;

        let newlyDetectedHoverKey = null;

        for (const key in planets) {
            const planet = planets[key];
            const planetScreenX = planet.x * scale + currentOffsetX;
            const planetScreenY = planet.y * scale + currentOffsetY;
            const distance = Math.sqrt(Math.pow(lastMouseX - planetScreenX, 2) + Math.pow(lastMouseY - planetScreenY, 2));
            const effectiveRadius = Math.max(1, planet.radius * Math.sqrt(scale));

            if (distance < effectiveRadius) {
                newlyDetectedHoverKey = key;
                break;
            }
        }

        if (hoveredPlanetKey !== newlyDetectedHoverKey) {
            hoveredPlanetKey = newlyDetectedHoverKey;
            if (hoveredPlanetKey) {
                planetTooltip.textContent = planets[hoveredPlanetKey].name;
            }
        }
        // Positioning and visibility are now handled by updateActiveTooltipPosition in the animation loop
    });

    // Hide tooltip if mouse leaves canvas
    canvas.addEventListener('mouseout', () => {
        hoveredPlanetKey = null;
        // Visibility and cursor are handled by updateActiveTooltipPosition
    });

    timeSpeedInput.addEventListener('input', (event) => {
        let sliderValue = parseInt(event.target.value, 10);
        const displayedWeeks = sliderToDisplayedWeeks(sliderValue);
        
        timeSpeed = displayedWeeks * secondsInWeek; 
        timeSpeedDisplay.textContent = `${displayedWeeks} weeks/sec`;
    });
}

// This function will be called from the main animation loop
function updateActiveTooltipPosition() {
    if (!planetTooltip || !canvas || !planets || typeof scale === 'undefined') return; // Added more guards

    // If a planet is currently marked as hovered, verify it still is under the last mouse position
    if (hoveredPlanetKey) {
        const planet = planets[hoveredPlanetKey];
        if (planet) { // Check if planet exists (it should)
            const currentOffsetX = canvas.width / 2;
            const currentOffsetY = canvas.height / 2;
            const planetScreenX = planet.x * scale + currentOffsetX;
            const planetScreenY = planet.y * scale + currentOffsetY;
            const effectiveRadius = Math.max(1, planet.radius * Math.sqrt(scale));
            const distance = Math.sqrt(Math.pow(lastMouseX - planetScreenX, 2) + Math.pow(lastMouseY - planetScreenY, 2));

            if (distance >= effectiveRadius) {
                hoveredPlanetKey = null; // Planet moved out from under the stationary mouse
            }
        } else {
            hoveredPlanetKey = null; // Planet data seems inconsistent, clear hover
        }
    }

    if (hoveredPlanetKey && planets[hoveredPlanetKey]) {
        const planet = planets[hoveredPlanetKey];
        const currentOffsetX = canvas.width / 2;
        const currentOffsetY = canvas.height / 2;

        const planetScreenX = planet.x * scale + currentOffsetX;
        const planetScreenY = planet.y * scale + currentOffsetY;
        const effectiveRadius = Math.max(1, planet.radius * Math.sqrt(scale));

        planetTooltip.style.display = 'block';
        canvas.style.cursor = 'pointer';
        // planetTooltip.textContent is already set by mousemove
        
        planetTooltip.style.left = `${planetScreenX - planetTooltip.offsetWidth / 2}px`;
        planetTooltip.style.top = `${planetScreenY - effectiveRadius - planetTooltip.offsetHeight - 5}px`;
    } else {
        planetTooltip.style.display = 'none';
        canvas.style.cursor = 'default';
    }
}
