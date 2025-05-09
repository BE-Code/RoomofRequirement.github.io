// Depends on: ctx (from main.js), scale (from main.js), planets (from main.js)

function drawPlanet(planet, offsetX, offsetY) {
    ctx.beginPath();
    // Apply scaling and offset
    const drawX = planet.x * scale + offsetX;
    const drawY = planet.y * scale + offsetY;
    // Scale radius slightly with zoom, but ensure it doesn't become too small or too large
    const effectiveRadius = Math.max(1, planet.radius * Math.sqrt(scale)); 

    ctx.arc(drawX, drawY, effectiveRadius, 0, 2 * Math.PI);
    ctx.fillStyle = planet.color;
    ctx.fill();
    ctx.closePath();

    if (planet.rings && planet.name === "Saturn") {
        ctx.strokeStyle = 'rgba(150, 150, 100, 0.7)';
        ctx.lineWidth = Math.max(1, 2 * Math.sqrt(scale));
        ctx.beginPath();
        // Ensure ring dimensions are also somewhat scaled but don't invert or become too small
        const ringMajor = Math.max(effectiveRadius + 2, planet.radius * 2 * scale);
        const ringMinor = Math.max(effectiveRadius * 0.4, planet.radius * 0.8 * scale);
        ctx.ellipse(drawX, drawY, ringMajor, ringMinor, 0, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.closePath();
    }
}

function drawTraces(ctx) {
    for (const key in planets) {
        const planet = planets[key];
        if (planet.path && planet.path.length > 1) {
            ctx.beginPath();
            // Make Sun's path slightly more prominent or distinct
            ctx.strokeStyle = planet.isStar ? 'rgba(255, 255, 0, 0.4)' : 'rgba(200, 200, 200, 0.3)'; 
            ctx.lineWidth = planet.isStar ? 1.5 : 1;
            ctx.moveTo(planet.path[0].x, planet.path[0].y);
            for (let i = 1; i < planet.path.length; i++) {
                ctx.lineTo(planet.path[i].x, planet.path[i].y);
            }
            ctx.stroke();
            ctx.closePath();
        }
    }
}
