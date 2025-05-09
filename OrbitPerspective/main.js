// Global state variables
let fixedPlanet = 'sun';
let scale = 1;
let simulationTime = 0;
let timeSpeed; // Will be initialized from config
let planets = {}; // This will be populated from PLANET_DATA

// DOM Elements
const canvas = document.getElementById('orbitCanvas');
const ctx = canvas.getContext('2d');
const fixedPlanetSelect = document.getElementById('fixedPlanetSelect');

// Depends on: PLANET_DATA, LOG_COMPRESSION_FACTOR (from config.js)
// Depends on: keplerToCartesian (from orbitCalculations.js)
function updatePlanetPositions(time) {
    // 1. Calculate raw Sun-relative positions for all planets (in pixels)
    for (const key in planets) {
        const planet = planets[key];
        if (planet.isStar) {
            planet.rawSunX = 0;
            planet.rawSunY = 0;
            continue;
        }
        const periodSeconds = planet.periodDays * 24 * 60 * 60;
        const meanMotion = (2 * Math.PI) / periodSeconds;
        const meanAnomaly = (meanMotion * time) % (2 * Math.PI);
        const coords = keplerToCartesian(planet.orbitalRadiusAU, planet.eccentricity, meanAnomaly);
        planet.rawSunX = coords.x;
        planet.rawSunY = coords.y;
    }

    // 2. Determine raw coordinates of the fixed planet (our reference for log scaling)
    const fixedPlanetObj = planets[fixedPlanet];
    const refX = fixedPlanetObj.rawSunX;
    const refY = fixedPlanetObj.rawSunY;

    // 3. Calculate log-scaled final positions for all planets relative to the fixed planet
    for (const key in planets) {
        const planet = planets[key];
        const rawRelX = planet.rawSunX - refX;
        const rawRelY = planet.rawSunY - refY;
        const linearDist = Math.sqrt(rawRelX * rawRelX + rawRelY * rawRelY);

        if (linearDist === 0) {
            planet.x = 0;
            planet.y = 0;
        } else {
            const logScaledDist = Math.log1p(linearDist / LOG_COMPRESSION_FACTOR) * LOG_COMPRESSION_FACTOR;
            planet.x = (logScaledDist / linearDist) * rawRelX;
            planet.y = (logScaledDist / linearDist) * rawRelY;
        }
    }

    const offsetX = canvas.width / 2;
    const offsetY = canvas.height / 2;
    return { offsetX, offsetY };
}

// Depends on: TIME_SPEED (from config.js)
// Depends on: updatePlanetPositions (self)
// Depends on: drawTraces, drawPlanet (from drawing.js)
// Depends on: ctx, canvas (self)
// Depends on: planets, scale (self)
function animate() {
    simulationTime += timeSpeed / 60; // Assuming 60 FPS, uses local timeSpeed

    const { offsetX, offsetY } = updatePlanetPositions(simulationTime);

    // Update paths for all planets based on their new screen positions
    for (const key in planets) {
        const planet = planets[key];
        const screenX = planet.x * scale + offsetX;
        const screenY = planet.y * scale + offsetY;
        planet.path.push({ x: screenX, y: screenY });
        // No MAX_PATH_LENGTH check, paths grow indefinitely
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawTraces(ctx); // Pass ctx

    // Draw all planets including the Sun using their log-scaled coordinates
    for (const key in planets) {
        drawPlanet(planets[key], offsetX, offsetY);
    }

    updateActiveTooltipPosition(); // Update tooltip based on current hover state and planet positions

    requestAnimationFrame(animate);
}

function autoZoom() {
    if (!canvas || !planets) return;

    // Ensure planet.x, planet.y are fresh and log-scaled for the current fixedPlanet and time
    updatePlanetPositions(simulationTime); 

    let max_abs_x_coord = 0;
    let max_abs_y_coord = 0;

    for (const key in planets) {
        const p = planets[key];
        max_abs_x_coord = Math.max(max_abs_x_coord, Math.abs(p.x));
        max_abs_y_coord = Math.max(max_abs_y_coord, Math.abs(p.y));
    }

    let new_scale_x = Infinity;
    if (max_abs_x_coord > 0) {
        new_scale_x = (canvas.width / 2 * 0.95) / max_abs_x_coord;
    } else if (max_abs_x_coord === 0 && max_abs_y_coord === 0) {
        // Only one point at the origin, or all x are zero.
        // If all y are also zero, new_scale_x remains Infinity, handled below to default to 1.
    }

    let new_scale_y = Infinity;
    if (max_abs_y_coord > 0) {
        new_scale_y = (canvas.height / 2 * 0.95) / max_abs_y_coord;
    } else if (max_abs_y_coord === 0 && max_abs_x_coord === 0) {
        // Only one point at the origin, or all y are zero.
    }
    
    let new_scale;
    if (max_abs_x_coord === 0 && max_abs_y_coord === 0) {
        new_scale = 1; // Default scale if all points are effectively at the origin of the view
    } else {
        new_scale = Math.min(new_scale_x, new_scale_y);
        // If one dimension was all zeros, its new_scale component would be Infinity.
        // Math.min correctly picks the finite one in that case.
    }

    const oldScale = scale;
    scale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, new_scale));

    if (scale !== oldScale) {
        for (const keyInPlanets in planets) { // Use a different key name to avoid confusion
            if (planets[keyInPlanets].path) {
                planets[keyInPlanets].path = [];
            }
        }
    }
}

function initializeSimulation() {
    timeSpeed = INITIAL_TIME_SPEED; // Initialize timeSpeed here

    // Deep copy PLANET_DATA and initialize dynamic properties
    for (const key in PLANET_DATA) {
        planets[key] = { ...PLANET_DATA[key] }; // Shallow copy of properties
        planets[key].x = 0;
        planets[key].y = 0;
        planets[key].rawSunX = 0;
        planets[key].rawSunY = 0;
        planets[key].path = [];
    }

    // Setup UI elements and listeners from ui.js
    // resizeCanvas must be available globally or passed
    // setupEventListeners must be available globally or called appropriately
    initializeUITooltip(); // Create the tooltip element
    setupEventListeners(); // Assumes functions from ui.js are globally available

    resizeCanvas(); // Initial resize to set canvas dimensions
    updatePlanetPositions(simulationTime); // Calculate initial positions
    autoZoom();     // Set initial scale based on positions

    animate();      // Start simulation
}

// Start everything once the DOM is ready (or immediately if scripts are at the end of body)
initializeSimulation();
